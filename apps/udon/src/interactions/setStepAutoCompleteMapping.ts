import promises from 'src/utils/promises';
import { DataSource, StepAutoCompleteRule } from 'bento-common/types';
import { withTransaction } from 'src/data';
import {
  CustomApiEvent,
  CustomApiEventType,
} from 'src/data/models/CustomApiEvent.model';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import { recordEventSeen } from './recordEvents/recordCustomApiEvents';
import { StepEventMapping } from 'src/data/models/StepEventMapping.model';
import { StepEventMappingRule } from 'src/data/models/StepEventMappingRule.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

type Args = {
  stepPrototype: StepPrototype;
  eventName: string;
  completeForWholeAccount: boolean;
  rules: StepAutoCompleteRule[];
};

type Options = {
  auditContext?: AuditContext;
};

export async function setStepAutoCompleteMapping(
  { stepPrototype, eventName, completeForWholeAccount, rules }: Args,
  { auditContext }: Options = {}
) {
  const createdStepEventMapping = (await withTransaction(async () => {
    const stepEventMapping = await StepEventMapping.create({
      eventName,
      completeForWholeAccount,
      stepPrototypeId: stepPrototype.id,
      organizationId: stepPrototype.organizationId,
    });

    const values = {
      organizationId: stepPrototype.organizationId,
      name: eventName,
      type: CustomApiEventType.Event,
    };

    const [apiEvents] = await CustomApiEvent.findOrCreate({
      where: values,
      defaults: values,
    });

    await recordEventSeen(apiEvents);

    const ruleAttrs = rules
      .filter((rule) => Object.keys(rule || {}).length)
      .map((rule) => {
        const {
          propertyName,
          valueType,
          ruleType,
          numberValue,
          textValue,
          booleanValue,
          dateValue,
        } = rule;

        return {
          stepEventMappingId: stepEventMapping.id,
          organizationId: stepPrototype.organizationId,
          propertyName,
          valueType,
          ruleType,
          numberValue,
          textValue,
          booleanValue,
          dateValue: dateValue != null ? new Date(dateValue) : undefined,
        };
      });

    await StepEventMappingRule.bulkCreate(ruleAttrs);

    await createCustomApiMappingRules(ruleAttrs, stepPrototype.organizationId);

    return stepEventMapping;
  })) as StepEventMapping;

  // TODO: This actually doesn't work because we always destroy and re-create mappings
  if (!createdStepEventMapping.isNewRecord) {
    auditContext?.logEvent({
      eventName: AuditEvent.autocompleteChanged,
      targets: [
        {
          type: AuditType.StepPrototype,
          id: createdStepEventMapping.stepPrototypeId!,
        },
      ],
    });
  }

  return createdStepEventMapping;
}

const createCustomApiMappingRules = async (
  ruleAttrs,
  organizationId: number
) => {
  await promises.each(ruleAttrs, async (ruleAttr: StepAutoCompleteRule) => {
    const values = {
      organizationId,
      name: ruleAttr.propertyName,
      type: CustomApiEventType.EventProperty,
    };

    await CustomApiEvent.findOrCreate({
      where: values,
      defaults: values,
    });
  });
};
