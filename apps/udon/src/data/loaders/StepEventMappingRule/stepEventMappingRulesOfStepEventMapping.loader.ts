import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepEventMappingRule } from 'src/data/models/StepEventMappingRule.model';

export default function stepEventMappingRulesOfStepEventMappingLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepEventMappingRule[]>(
    async (stepEventMappingIds) => {
      const rows = (await queryRunner({
        sql: `
        SELECT
          step_event_mapping_rules.id as step_event_mapping_rule_id
          , step_event_mappings.id as step_event_mapping_id
        FROM core.step_event_mapping_rules
        JOIN core.step_event_mappings
        ON step_event_mapping_rules.step_event_mapping_id = step_event_mappings.id
        WHERE step_event_mappings.id IN (:stepEventMappingIds)
        ORDER BY step_event_mappings.id ASC, step_event_mapping_rules.id ASC
      `,
        replacements: {
          stepEventMappingIds: stepEventMappingIds as number[],
        },
      })) as {
        step_event_mapping_rule_id: number;
        step_event_mapping_id: number;
      }[];

      return loadBulk(
        stepEventMappingIds,
        rows,
        'step_event_mapping_id',
        'step_event_mapping_rule_id',
        loaders.stepEventMappingRuleLoader
      );
    }
  );
}
