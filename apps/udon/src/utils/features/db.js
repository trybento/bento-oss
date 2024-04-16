/** The orgs to auto-add to new feature flags, by name */
const DEFAULT_ORGS = ['Bento', 'PaydayIO', 'Payday', 'Bugfix Org'];

const GET_DEFAULT_ORGS_QUERY = `--sql
	SELECT o.name
	FROM core.feature_flag_default_orgs ffdo
	JOIN core.organizations o ON o.id = ffdo.organization_id
	WHERE ffdo.enabled = TRUE;
`;

const SET_FOR_DEFAULT_ORGS_QUERY = `--sql
  INSERT INTO core.feature_flag_enabled
  (feature_flag_id, organization_id)
  SELECT :featureFlagId, organization.id as organization_id
  FROM core.organizations as organization
  WHERE organization.name IN (:orgNames);
`;

const RENAME_FF_QUERY = `--sql
	UPDATE
		core.feature_flags
	SET
		"name" = :newName
	WHERE
		name = :oldName 
`;

/**
 * Super shortcut method
 * @param {{ name: string; sendToAdmin: boolean; sendToEmbeddable: boolean; enabledForNewOrgs?: boolean; }} param0
 */
const newFeatureFlag = (opts) => ({
  up: (queryInterface) => createFeatureFlag(opts, queryInterface),
  down: (queryInterface) => deleteFeatureFlag(opts.name, queryInterface),
});

/**
 * @param {{ name: string; sendToAdmin: boolean; sendToEmbeddable: boolean; enabledForNewOrgs?: boolean; }} flag
 * @param {string[] | null} additionalDefaultOrgs by org name
 */
const createFeatureFlag = async (
  flag,
  queryInterface,
  additionalDefaultOrgs = []
) => {
  const [createdFlag] = await queryInterface.bulkInsert(
    { tableName: 'feature_flags', schema: 'core' },
    [
      {
        name: flag.name,
        send_to_admin: flag.sendToAdmin,
        send_to_embeddable: flag.sendToEmbeddable,
        ...(typeof flag.enabledForNewOrgs !== 'undefined' && {
          enabled_for_new_orgs: flag.enabledForNewOrgs,
        }),
      },
    ],
    { returning: true }
  );

  /* Skip adding defaults in this case */
  if (additionalDefaultOrgs === null) return;

  /**
   * @type {string[]}
   */
  let defaultOrgs;

  try {
    const defaultOrgResults = await queryInterface.sequelize.query(
      GET_DEFAULT_ORGS_QUERY
    );

    defaultOrgs = defaultOrgResults.reduce(
      (a, v) =>
        a.concat(
          v && v.rows && Array.isArray(v.rows)
            ? v.rows.map((r) => r.name)
            : v.name
            ? [v.name]
            : []
        ),
      []
    );
  } catch {}

  const orgNames = [
    ...new Set(
      additionalDefaultOrgs.concat(
        (defaultOrgs?.length || 0) > 0
          ? defaultOrgs
          : DEFAULT_ORGS.flatMap((orgName) => [orgName, `STAGING ${orgName}`])
      )
    ),
  ];

  await queryInterface.sequelize.query(SET_FOR_DEFAULT_ORGS_QUERY, {
    replacements: {
      orgNames,
      featureFlagId: createdFlag.id,
    },
  });
};

const deleteFeatureFlag = async (flagName, queryInterface) => {
  await queryInterface.bulkDelete(
    { tableName: 'feature_flags', schema: 'core' },
    { name: flagName }
  );
};

module.exports = {
  queries: {
    GET_DEFAULT_ORGS_QUERY,
    SET_FOR_DEFAULT_ORGS_QUERY,
  },
  constants: {
    DEFAULT_ORGS,
  },
  newFeatureFlag,
  createFeatureFlag,
  deleteFeatureFlag,
};
