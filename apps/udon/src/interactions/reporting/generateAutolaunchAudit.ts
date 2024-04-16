import { convertArrayToCSV } from 'convert-array-to-csv';

import { BASE_CLIENT_URL } from 'shared/constants';
import { TemplateState, TargetingType } from 'bento-common/types';
import { queryRunner } from 'src/data';
import { enableProcessingThreads } from 'src/utils/internalFeatures/internalFeatures';
import ProcessingPool from 'src/utils/processingPool';
import { AttributeRule } from '../targeting/types';
import { Organization } from 'src/data/models/Organization.model';
import { getTemplateState } from 'src/data/models/common';

type Args = {
  organization: Organization;
};

export type AutoLaunchableRow = {
  id: number;
  state: TemplateState;
  manuallyLaunched?: boolean | null;
  templateEntityId: string;
  templateName: string;
  isAutoLaunchEnabled: boolean;
  rules: AttributeRule[];
  ruleType: TargetingType;
};

export default async function generateAutolaunchAudit({ organization }: Args) {
  const sql = `
    SELECT
      t.id,
      t.state,
      t.manually_launched as "manuallyLaunched",
      t.entity_id AS "templateEntityId",
      t.name AS "templateName",
      t.is_auto_launch_enabled AS "isAutoLaunchEnabled",
      tar.rules,
      tar.rule_type AS "ruleType"
    FROM core.template_auto_launch_rules tar
    JOIN core.templates t
      ON t.id = tar.template_id
    WHERE tar.organization_id = :organizationId
      AND t.deleted_at IS NULL
    GROUP BY t.id, t.entity_id, t.name, t.is_auto_launch_enabled, tar.rules, tar.rule_type;
  `;

  const rows = (await queryRunner({
    sql,
    replacements: { organizationId: organization.id },
  })) as AutoLaunchableRow[];

  if (!rows) return;

  const useProcessingWorker = await enableProcessingThreads.enabled();

  const udonUrl = BASE_CLIENT_URL;

  const csvData = useProcessingWorker
    ? await ProcessingPool.exec(rowsToCsvData, [{ rows, udonUrl }])
    : rowsToCsvData({ rows, udonUrl });

  return convertArrayToCSV(csvData);
}

type TemplateRuleData = {
  templateEntityId: string;
  templateName: string;
  templateState: TemplateState;
  autoLaunchEnabled: boolean;
  ruleMap: Record<string, Array<AttributeRule | true>>;
};

export const rowsToCsvData = ({
  rows,
  udonUrl,
}: {
  rows: AutoLaunchableRow[];
  udonUrl: string;
}) => {
  if (!rows.length) return [];

  const MULTI_VALUE_DELIMITER = '/';

  const RT_STRING = {
    eq: '=',
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
  };

  const ruleToMatchString = (rule: AttributeRule | true) => {
    if (rule === true) return 'true';
    const { ruleType, value } = rule;

    if (ruleType === 'eq') return value;

    return `${RT_STRING[ruleType]} ${value}`;
  };

  /** Track what attrs we've seen */
  const attributesSeen: Record<string, 1> = { launchToAll: 1 };
  /** Map template id to the data */
  const templateDict: Record<number | string, TemplateRuleData> = {};

  /* Build the data cache */
  rows.forEach((autolaunchableTemplate) => {
    const {
      id,
      state,
      manuallyLaunched,
      ruleType,
      rules,
      templateEntityId,
      templateName,
      isAutoLaunchEnabled,
    } = autolaunchableTemplate;
    const templateEntry: TemplateRuleData = {
      templateEntityId,
      templateName,
      templateState: getTemplateState({
        template: { state, manuallyLaunched },
      }),
      autoLaunchEnabled: isAutoLaunchEnabled,
      ruleMap: {},
    };
    if (ruleType === 'all') {
      templateEntry.ruleMap['launchToAll'] = [true];
    } else {
      rules.forEach((rule) => {
        attributesSeen[rule.attribute] = 1;
        templateEntry.ruleMap[rule.attribute]
          ? templateEntry.ruleMap[rule.attribute].push(rule)
          : (templateEntry.ruleMap[rule.attribute] = [rule]);
      });
    }

    templateDict[id] = templateEntry;
  });

  /* Create the csv data rows */
  const csvData: string[][] = [];

  const attrsArray = Object.keys(attributesSeen);

  const headers = [
    'Guide name',
    'URL',
    'Template state',
    'Autolaunch enabled',
  ].concat(attrsArray);

  csvData.push(headers);
  Object.keys(templateDict).forEach((tId) => {
    const tData = templateDict[tId];
    const tUrl = `${udonUrl}/library/templates/${templateDict[tId].templateEntityId}`;
    const newRow = [
      tData.templateName,
      tUrl,
      tData.templateState,
      String(tData.autoLaunchEnabled),
    ].concat(
      attrsArray.map((attr) => {
        const rules = tData.ruleMap[attr];
        if (rules)
          return rules
            .map((rule) => ruleToMatchString(rule))
            .join(MULTI_VALUE_DELIMITER);
        return '';
      })
    );
    csvData.push(newRow);
  });

  return csvData;
};
