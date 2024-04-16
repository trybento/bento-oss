import promises from 'src/utils/promises';
import { StepEventMappingInput } from 'bento-common/types';

import AuditContext from 'src/utils/auditContext';
import { StepEventMapping } from 'src/data/models/StepEventMapping.model';
import { getIsAnyStepAutoCompleteRuleIncomplete } from 'src/utils/stepAutoCompleteHelpers';
import { setStepAutoCompleteMapping } from './setStepAutoCompleteMapping';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

type Args = {
  stepPrototype: StepPrototype;
  eventMappings: StepEventMappingInput[] | undefined | null;
};

type Options = {
  auditContext?: AuditContext;
};

/** Update event mappings of a step */
export async function editStepPrototypeEventMappings(
  { stepPrototype, eventMappings }: Args,
  { auditContext }: Options = {}
): Promise<void> {
  await StepEventMapping.destroy({
    where: {
      stepPrototypeId: stepPrototype.id,
    },
  });

  if (!eventMappings?.length) return;

  await promises.each(eventMappings, async (eventMapping) => {
    const eventName = eventMapping.eventName;
    const completeForWholeAccount =
      eventMapping?.completeForWholeAccount || false;
    const rules = eventMapping?.rules;

    const isAnyRuleIncomplete = getIsAnyStepAutoCompleteRuleIncomplete(
      rules || []
    );

    if (eventName && rules && !isAnyRuleIncomplete) {
      await setStepAutoCompleteMapping(
        {
          stepPrototype,
          eventName,
          completeForWholeAccount,
          rules,
        },
        {
          auditContext,
        }
      );
    }
  });

  return;
}
