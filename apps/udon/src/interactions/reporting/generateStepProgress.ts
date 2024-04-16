import { convertArrayToCSV } from 'convert-array-to-csv';
import { isVideoGalleryTheme } from 'bento-common/data/helpers';
import { QueryDatabase, queryRunner } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { logger } from 'src/utils/logger';
import withPerfTimer from 'src/utils/perfTimer';
import { COLUMN_LABELS, formatRawDate } from './reports.helpers';

type DateArgs = { start: string; end: string };

enum StepProgressFields {
  'company_name' = 'company_name',
  'company_id' = 'company_id',
  'account_user_name' = 'account_user_name',
  'guide_name' = 'guide_name',
  'email' = 'email',
  'module_name' = 'module_name',
  'step_name' = 'step_name',
  'step_is_complete' = 'step_is_complete',
  'step_updated_at' = 'step_updated_at',
  'step_seen_on' = 'step_seen_on',
  'external_id' = 'external_id',
  'step_completed_at' = 'step_completed_at',
}

type StepProgressRow = Partial<Record<StepProgressFields, string>>;
type StepProgressFieldsToInclude = Partial<Record<StepProgressFields, boolean>>;

/** Only fields explicitly set to FALSE will be discarded. */
const isFieldIncluded = (value: boolean | undefined) => value !== false;

const orderedFields: StepProgressFields[] = [
  StepProgressFields.company_name,
  StepProgressFields.company_id,
  StepProgressFields.account_user_name,
  StepProgressFields.email,
  StepProgressFields.external_id,
  StepProgressFields.guide_name,
  StepProgressFields.module_name,
  StepProgressFields.step_name,
  StepProgressFields.step_is_complete,
  StepProgressFields.step_completed_at,
  StepProgressFields.step_updated_at,
  StepProgressFields.step_seen_on,
];

export default async function generateStepProgress({
  organization,
  dates,
  getSeens,
  templateEntityId,
}: {
  organization: Organization;
  dates?: DateArgs;
  getSeens?: boolean;
  templateEntityId?: string;
}) {
  const template = await Template.findOne({
    where: { entityId: templateEntityId },
    attributes: ['theme'],
  });

  const isVideoGallery = isVideoGalleryTheme(template?.theme);

  let mappedRows: string[][] = [[]];

  const includedFields = {
    [StepProgressFields.module_name]: !isVideoGallery,
    [StepProgressFields.step_is_complete]: !isVideoGallery,
    [StepProgressFields.step_updated_at]: !isVideoGallery,
    [StepProgressFields.step_seen_on]: !!getSeens,
  };

  const headers = [
    /**
     * Titles will be mapped to the order
     * set by 'orderedFields'
     */
    COLUMN_LABELS.accountName,
    COLUMN_LABELS.accountExternalId,
    COLUMN_LABELS.accountUserName,
    COLUMN_LABELS.accountUserEmail,
    COLUMN_LABELS.accountUserExternalId,
    COLUMN_LABELS.guideName,
    COLUMN_LABELS.moduleName,
    isVideoGallery ? 'Video name' : 'Step name',
    'Step is complete',
    'Step completed at',
    'Step updated at',
    isVideoGallery ? 'Video seen at' : 'Step last seen',
  ].reduce((acc, fieldTitle, idx) => {
    if (
      idx < orderedFields.length &&
      isFieldIncluded(includedFields[orderedFields[idx]])
    )
      acc.push(fieldTitle);
    return acc;
  }, [] as string[]);

  await withPerfTimer(
    'stepProgress.sql',
    async () => {
      mappedRows = await getStepProgressRows({
        organizationId: organization.id,
        dates,
        includedFields,
        templateEntityId,
      });
    },
    (time) =>
      logger.info(
        `[generateReport] sql done in ${time} w/ dates ${dates?.start}-${dates?.end}`
      )
  );

  const report: string[][] = [headers, ...mappedRows];

  let data = '';

  await withPerfTimer(
    'stepProgress.buildCSV',
    async () => {
      data = convertArrayToCSV(report) as string;
    },
    (time) =>
      logger.info(
        `[generateReport] csv done in ${time} for ${organization.entityId}`
      )
  );

  return data;
}

const CHUNK_SIZE = 500;

type Args = {
  organizationId: number;
  offset?: number;
  chunkSize?: number;
  dates?: DateArgs;
  /** Only fields explicitly set to FALSE will be discarded. */
  includedFields?: StepProgressFieldsToInclude;
  templateEntityId?: string;
};

const defaultIncludedFields: StepProgressFieldsToInclude = {
  [StepProgressFields.step_seen_on]: false,
};

/** Do this in batches to prevent too much work at once */
export const getStepProgressRows = async (args: Args): Promise<string[][]> => {
  const {
    organizationId,
    offset = 0,
    chunkSize = CHUNK_SIZE,
    dates,
    includedFields = defaultIncludedFields,
    templateEntityId,
  } = args;

  let rows: any = null;
  const mappedRows = await withPerfTimer(
    'stepProgress.sqlChunk',
    async () => {
      const sql = `--sql
				select distinct
					a.name as company_name,
					a.external_id as company_id,
					COALESCE(u.full_name, us.full_name, 'Unknown user') as account_user_name,
					COALESCE (u.email, us.email, 'Unknown user') as email,
					u.external_id,
					t.name as guide_name,
					COALESCE(gmb.name, m.name) as module_name,
					COALESCE(gsb.name, sp.name) as step_name,
					s.is_complete as step_is_complete,
					s.completed_at as step_completed_at,
          s.updated_at as step_updated_at,
          ${
            isFieldIncluded(includedFields.step_seen_on)
              ? 'lsv.date as step_seen_on,'
              : ''
          }
					gm.order_index,
          gsb.order_index
				from core.steps as s
        join core.guide_step_bases gsb
					on gsb.id = s.created_from_guide_step_base_id
					AND gsb.deleted_at IS NULL
        join core.step_prototypes sp
					on sp.id = s.created_from_step_prototype_id
				join core.guide_modules as gm
					on s.guide_module_id = gm.id
        join core.guide_module_bases gmb
          on gmb.id = gm.created_from_guide_module_base_id
        join core.modules m
          on m.id = gm.created_from_module_id
				join core.guides as g
					on gm.guide_id = g.id
				join core.guide_bases gb
					on gb.id = g.created_from_guide_base_id
				join core.templates t
					on g.created_from_template_id = t.id
				${
          isFieldIncluded(includedFields.step_seen_on)
            ? `
				left join (
					-- use only the latest rollup entry
						select * from (
								select *, row_number() over (
										partition by step_id
										order by date desc
								) as row_num
								from analytics.step_daily_rollup
                where organization_id = :organizationId
						) as ordered_rows
						where ordered_rows.row_num = 1
				) as lsv
					on lsv.step_id = s.id
				`
            : ''
        }
				left join core.account_users as u
					on (s.completed_by_account_user_id = u.id ${
            isFieldIncluded(includedFields.step_seen_on)
              ? 'OR lsv.account_user_id = u.id'
              : ''
          }) ${templateEntityId ? '' : 'AND u.internal = FALSE'}
				join core.accounts as a
					on gb.account_id = a.id AND a.deleted_at IS NULL
				LEFT JOIN core.users us
					ON us.id = s.completed_by_user_id AND us.deleted_at IS NULL
				where s.organization_id = :organizationId
					AND gm.deleted_at IS NULL
					${dates ? 'AND s.updated_at between :startDate and :endDate' : ''}
					${templateEntityId ? 'AND t.entity_id = :templateEntityId' : ''}
					${
            isFieldIncluded(includedFields.step_seen_on)
              ? 'AND (s.is_complete IS TRUE OR lsv.date IS NOT NULL)'
              : 'AND s.completed_at IS NOT NULL'
          }
				ORDER BY a.name, t.name, 2, gm.order_index, gsb.order_index
				LIMIT :chunkSize OFFSET :offset
			`;

      rows = (await queryRunner({
        sql,
        replacements: {
          chunkSize,
          organizationId,
          offset,
          ...(dates
            ? {
                startDate: dates?.start,
                endDate: dates?.end,
              }
            : {}),
          ...(templateEntityId ? { templateEntityId } : {}),
        },
        queryDatabase: QueryDatabase.follower,
      })) as StepProgressRow[];

      const result = rows.map((row) =>
        orderedFields.reduce((acc, k) => {
          if (isFieldIncluded(includedFields[k])) {
            switch (k) {
              case StepProgressFields.step_updated_at:
              case StepProgressFields.step_completed_at:
              case StepProgressFields.step_seen_on:
                acc.push(formatRawDate(row[k]));
                break;
              default:
                acc.push(row[k]);
                break;
            }
          }
          return acc;
        }, [] as string[])
      );

      return result;
    },
    (time) =>
      logger.debug(`[generateReport] csv chunk offset ${offset} in ${time}`)
  );

  if (rows.length < chunkSize) {
    return mappedRows;
  } else {
    return [
      ...mappedRows,
      ...(await getStepProgressRows({
        ...args,
        offset: offset + chunkSize,
      })),
    ];
  }
};
