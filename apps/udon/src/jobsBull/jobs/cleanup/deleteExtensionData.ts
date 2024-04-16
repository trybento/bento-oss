import { uniq } from 'lodash';
import { EXT_TEST_ACCOUNTS } from 'bento-common/utils/constants';
import {
  defaultAccountAttributes,
  defaultAccountUserAttributes,
} from 'bento-common/validation/bentoSettings.schema';
import { queryRunner } from 'src/data';
import { Account } from 'src/data/models/Account.model';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { CustomAttributeValue } from 'src/data/models/CustomAttributeValue.model';
import { Organization } from 'src/data/models/Organization.model';
import { JobHandler } from 'src/jobsBull/handler';
import { DeleteExtensionDataJob } from 'src/jobsBull/job';

/**
 * Resets an organization's attribute data and removes extension accounts
 *   Cutoff minutes can be set higher if the job is run x minutes after identified
 */
const handler: JobHandler<DeleteExtensionDataJob> = async (job, logger) => {
  const { organizationId, cutoffMinutes = 5 } = job.data;

  if (!organizationId) return;

  const organization = await Organization.findOne({
    where: { id: organizationId },
    attributes: ['slug'],
  });

  if (!organization) {
    logger.warn(
      `[deleteExtensionData] org id ${organizationId} does not exist.`
    );
    return;
  }

  logger.info(
    `[deleteExtensionData] Removing extension data for org ${organization.slug}`
  );

  /** Don't recreate default attributes */
  const defaultAttributes = uniq([
    ...defaultAccountAttributes,
    ...defaultAccountUserAttributes,
  ]);

  /* Reset data; identify will repopulate these */
  const existingAttributesRows = (await queryRunner({
    sql: `SELECT id FROM core.custom_attributes
				WHERE
					(created_at < NOW() - INTERVAL '${cutoffMinutes} minutes' OR name = 'bentoExtension')
					AND source = 'snippet'
					AND name NOT IN (:defaultAttributes)
					AND organization_id = :organizationId;`,
    replacements: { organizationId, defaultAttributes },
  })) as { id: number }[];
  const existingAttributesIds = existingAttributesRows.map((r) => r.id);

  const deletedCustomAttributeValues = await CustomAttributeValue.destroy({
    where: { customAttributeId: existingAttributesIds },
  });

  const deletedCustomAttributes = await CustomAttribute.destroy({
    where: { id: existingAttributesIds },
  });

  logger.info(
    `[deleteExtensionData] Deleted ${deletedCustomAttributes} attrs and ${deletedCustomAttributeValues} values for ${organization.slug}.`
  );

  /* Find and remove Bento Test (E/M) accounts. */
  const accountIdRows = (await queryRunner({
    sql: `
				SELECT a.id FROM core.accounts a
				WHERE a.name IN (:extensionAccounts)
					AND a.organization_id = :organizationId;
			`,
    replacements: {
      extensionAccounts: EXT_TEST_ACCOUNTS,
      organizationId,
    },
  })) as { id: number }[];

  const accountIds = accountIdRows.map((r) => r.id);

  const deleted = await Account.destroy({
    where: {
      id: accountIds,
      organizationId,
    },
  });

  logger.info(
    `[deleteExtensionData] Deleted ${deleted} accounts for ${organization.slug}`
  );
};

export default handler;
