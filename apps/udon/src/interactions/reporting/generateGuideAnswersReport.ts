import { convertArrayToCSV } from 'convert-array-to-csv';

import { QueryDatabase, queryRunner } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { COLUMN_LABELS, formatRawDate } from './reports.helpers';

type Args = {
  organization: Organization;
  templateEntityId: string;
};

const sql = `--sql
	SELECT
		a.name AS "customerName",
		a.external_id AS "customerExternalId",
		au.full_name AS "participantName",
		au.email,
		au.external_id AS "participantExternalId",
		gsb.name AS "stepName",
		isb.label AS "inputLabel",
		isa.answer,
		isa.created_at AS "answeredOn"
	FROM core.input_step_answers isa
	JOIN core.account_users au
		ON isa.answered_by_account_user_id = au.id
	JOIN core.accounts a
		ON au.account_id = a.id
	JOIN core.input_step_bases isb
		ON isa.input_step_base_id = isb.id
	JOIN core.guide_step_bases gsb
		ON isb.guide_step_base_id = gsb.id
		AND gsb.deleted_at IS NULL
	JOIN core.guide_bases gb
		ON gsb.guide_base_id = gb.id
	JOIN core.templates t
		ON gb.created_from_template_id = t.id
	WHERE isa.step_id IS NOT NULL
		AND t.entity_id = :templateEntityId
		AND t.organization_id = :organizationId;
`;

export default async function generateGuideAnswersReport({
  organization,
  templateEntityId,
}: Args) {
  const rows = (await queryRunner({
    sql,
    replacements: {
      templateEntityId,
      organizationId: organization.id,
    },
    queryDatabase: QueryDatabase.follower,
  })) as {
    customerName: string;
    customerExternalId: string;
    participantName: string;
    email: string;
    participantExternalId: string;
    stepName: string;
    inputLabel: string;
    answer: string;
    answeredOn: string;
  }[];

  const mappedRows = rows.map(
    ({
      customerName,
      customerExternalId,
      participantName,
      email,
      participantExternalId,
      stepName,
      inputLabel,
      answer,
      answeredOn,
    }) => [
      customerName,
      customerExternalId,
      participantName,
      email,
      participantExternalId,
      stepName,
      inputLabel,
      answer,
      formatRawDate(answeredOn),
    ]
  );

  const headers = [
    COLUMN_LABELS.accountName,
    COLUMN_LABELS.accountExternalId,
    COLUMN_LABELS.accountUserName,
    COLUMN_LABELS.accountUserEmail,
    COLUMN_LABELS.accountUserExternalId,
    COLUMN_LABELS.stepName,
    'Input label',
    'Answer',
    'Answered on',
  ];

  const report: string[][] = [headers, ...mappedRows];

  return convertArrayToCSV(report);
}
