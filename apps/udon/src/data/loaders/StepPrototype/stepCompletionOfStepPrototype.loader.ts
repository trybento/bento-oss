import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { queryRunner } from 'src/data';

type StepCompletionStats = {
  stepsCompleted: number;
  stepsInViewedGuides: number;
  viewedSteps: number;
};

type Args = {
  stepPrototypeId: number;
  /* We have the option to filter by template or not */
  templateId?: number;
};

const emptyStats = (): StepCompletionStats => ({
  stepsCompleted: 0,
  stepsInViewedGuides: 0,
  viewedSteps: 0,
});

/**
 * Return counts only. For many larger guides, fetching and serializing the data
 *   can be quite expensive
 */
export default function stepCompletionOfStepPrototypesLoader() {
  return new Dataloader<Args, StepCompletionStats, string>(
    async (args) => {
      const rows = (await queryRunner({
        sql: `--sql
					SELECT 
						sd.step_prototype_id AS "stepPrototypeId",
						sd.template_id AS "templateId",
						sd.completed_steps AS "stepsCompleted",
						sd.steps_in_viewed_guides AS "stepsInViewedGuides",
						sd.viewed_steps AS "viewedSteps"
					FROM analytics.step_data sd
					WHERE sd.step_prototype_id IN (:stepPrototypeIds)
				`,
        replacements: {
          stepPrototypeIds: args.map((a) => a.stepPrototypeId),
        },
      })) as Array<Args & StepCompletionStats>;

      const infoByStepPrototypeId = groupBy(rows, 'stepPrototypeId');
      return args.map(({ stepPrototypeId, templateId }) =>
        infoByStepPrototypeId[stepPrototypeId]
          ? infoByStepPrototypeId[stepPrototypeId].reduce((a, v) => {
              /**
               * If we are given a templateId to filter the stats by, only sum those
               * If not, sum everything
               */
              if (templateId && v.templateId !== templateId) return a;

              a.stepsCompleted += v.stepsCompleted;
              a.stepsInViewedGuides += v.stepsInViewedGuides;
              a.viewedSteps += v.viewedSteps;
              return a;
            }, emptyStats())
          : emptyStats()
      );
    },
    {
      cacheKeyFn: (args) => `${args.stepPrototypeId}-${args.templateId || 0}`,
    }
  );
}
