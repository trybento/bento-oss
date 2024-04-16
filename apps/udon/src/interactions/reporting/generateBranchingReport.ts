import { convertArrayToCSV } from 'convert-array-to-csv';
import { StepType } from 'src/../../common/types';

import { queryRunner, QueryDatabase } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { BranchingBranch } from 'src/data/models/types';
import getBranchingBranchesForStep from '../branching/getBranchingBranchesForStep';
import { COLUMN_LABELS, formatRawDate } from './reports.helpers';

type Args = {
  organization: Organization;
  templateEntityId: string;
};

const sql = `--sql
	SELECT
		s.id AS "stepId",
		au.full_name AS "accountUserName",
		au.email,
		au.external_id AS "accountUserExternalId",
		a.name AS "accountName",
		a.external_id AS "accountExternalId",
    COALESCE(gsb.name, sp.name) AS "stepName",
		s.completed_at AS "completedAt"
	FROM core.steps s
  JOIN core.guide_step_bases gsb
		ON gsb.id = s.created_from_guide_step_base_id
		AND gsb.deleted_at IS NULL
  JOIN core.step_prototypes sp
		on sp.id = s.created_from_step_prototype_id
	JOIN core.account_users au
		ON s.completed_by_account_user_id = au.id
	JOIN core.accounts a
		ON au.account_id = a.id
		AND a.deleted_at IS NULL
	JOIN core.guides g
		ON s.guide_id = g.id
	JOIN core.templates t
		ON t.id = g.created_from_template_id
	WHERE
		sp.step_type IN (:branchingStepTypes)
		AND s.organization_id = :organizationId
		AND t.entity_id = :templateEntityId;
`;

export default async function generateBranchingReport({
  organization,
  templateEntityId,
}: Args) {
  const rows = (await queryRunner({
    sql,
    replacements: {
      templateEntityId,
      organizationId: organization.id,
      branchingStepTypes: [StepType.branching, StepType.branchingOptional],
    },
    queryDatabase: QueryDatabase.follower,
  })) as {
    stepId: number;
    accountUserName: string;
    email: string;
    accountUserExternalId: string;
    accountName: string;
    accountExternalId: string;
    stepName: string;
    completedAt: string;
  }[];

  const branchingMap = await getBranchingBranchesForStep({
    stepIds: rows.map((r) => r.stepId),
  });

  const mappedRows = rows.map(
    ({
      accountName,
      accountExternalId,
      accountUserName,
      email,
      accountUserExternalId,
      stepName,
      completedAt,
      stepId,
    }) => [
      accountName,
      accountExternalId,
      accountUserName,
      email,
      accountUserExternalId,
      stepName,
      formatRawDate(completedAt),
      buildBranchingString(branchingMap[stepId]),
    ]
  );

  /** @todo Centralize labels so we can keep them consistent */
  const headers = [
    COLUMN_LABELS.accountName,
    COLUMN_LABELS.accountExternalId,
    COLUMN_LABELS.accountUserName,
    COLUMN_LABELS.accountUserEmail,
    COLUMN_LABELS.accountUserExternalId,
    'Step name',
    'Submitted on',
    'Selected options',
  ];

  const report: string[][] = [headers, ...mappedRows];

  return convertArrayToCSV(report);
}

const buildBranchingString = (choices: BranchingBranch[] = []) => {
  if (choices.length === 0) return '';

  return choices
    .reduce((a, v) => {
      if (v.selected) a.push(v.label);
      return a;
    }, [] as string[])
    .join(',');
};
