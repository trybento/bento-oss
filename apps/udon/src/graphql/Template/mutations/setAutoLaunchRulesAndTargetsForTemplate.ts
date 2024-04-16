import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { TargetAttributeRuleInputFields } from 'bento-common/graphql/targeting';
import generateMutation from 'src/graphql/helpers/generateMutation';
import TemplateType from 'src/graphql/Template/Template.graphql';
import EntityId from 'bento-common/graphql/EntityId';
import { GroupTargeting } from 'bento-common/types/targeting';
import { RuleType } from 'src/graphql/TemplateAutoLaunchRule/TemplateAutoLaunchRule.graphql';
import { Template } from 'src/data/models/Template.model';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { logger } from 'src/utils/logger';
import setAutoLaunchConfig from '../../../interactions/targeting/setAutoLaunch.helpers';
import {
  AttributeValueTypeEnumType,
  TargetRuleTypeEnumType,
  TargetTypeEnumType,
  TargetValueScalarType,
} from 'src/graphql/graphQl.types';
import { analytics, Events } from 'src/interactions/analytics/analytics';
import detachPromise from 'src/utils/detachPromise';

export const TargetAttributeRuleInputType = new GraphQLInputObjectType({
  name: 'TargetAttributeRuleInputType',
  fields: TargetAttributeRuleInputFields,
});

export const AutoLaunchRuleInputType = new GraphQLInputObjectType({
  name: 'AutoLaunchRuleInputType',
  fields: {
    autoLaunchRuleEntityId: {
      deprecationReason: 'not in use',
      type: EntityId,
    },
    ruleType: {
      type: new GraphQLNonNull(RuleType),
    },
    rules: {
      type: new GraphQLList(new GraphQLNonNull(TargetAttributeRuleInputType)),
    },
  },
});

const TemplateTargetRuleInputType = new GraphQLInputObjectType({
  name: 'TemplateTargetRuleInputType',
  description:
    'Determines the audience targeting criteria. Analogous to RawRule type',
  fields: {
    attribute: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ruleType: {
      type: new GraphQLNonNull(TargetRuleTypeEnumType),
    },
    valueType: {
      type: new GraphQLNonNull(AttributeValueTypeEnumType),
    },
    value: {
      type: new GraphQLNonNull(TargetValueScalarType),
    },
  },
});

const TemplateTargetGroupInputType = new GraphQLInputObjectType({
  name: 'TemplateTargetGroupInputType',
  description:
    'A single group of targeting rules for a template. See: TargetingGroup',
  fields: {
    rules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(TemplateTargetRuleInputType))
      ),
    },
  },
});

const TemplateTargetInputType = new GraphQLInputObjectType({
  name: 'TemplateTargetInputType',
  description: 'Determines a given target criteria. See: GroupTargetingSegment',
  fields: {
    type: {
      type: new GraphQLNonNull(TargetTypeEnumType),
    },
    groups: {
      type: new GraphQLList(new GraphQLNonNull(TemplateTargetGroupInputType)),
    },
  },
});

export const TemplateTargetsInputType = new GraphQLInputObjectType({
  name: 'TemplateTargetsInputType',
  description:
    'Determines the audience targeting criteria. See: GroupTargeting',
  fields: {
    account: {
      type: new GraphQLNonNull(TemplateTargetInputType),
    },
    accountUser: {
      type: new GraphQLNonNull(TemplateTargetInputType),
    },
    audiences: {
      type: TemplateTargetInputType,
    },
  },
});

type Args = {
  templateEntityId: string;
  isAutoLaunchEnabled: boolean;
  targets?: GroupTargeting;
  onlySetAutolaunchState?: boolean;
  gptRequestId?: string;
};

const setAutoLaunchRulesAndTargetsForTemplate = generateMutation({
  name: 'SetAutoLaunchRulesAndTargetsForTemplate',
  description: 'Set the auto launch rules and targets for a template',
  inputFields: {
    templateEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    isAutoLaunchEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    targets: {
      type: TemplateTargetsInputType,
    },
    onlySetAutolaunchState: {
      type: GraphQLBoolean,
    },
    gptRequestId: {
      type: GraphQLString,
    },
  },
  outputFields: {
    template: {
      type: TemplateType,
    },
  },
  mutateAndGetPayload: async (
    {
      templateEntityId,
      isAutoLaunchEnabled,
      targets,
      onlySetAutolaunchState = false,
      gptRequestId,
    }: Args,
    { organization, user }
  ) => {
    try {
      const template = await Template.findOne({
        where: {
          entityId: templateEntityId,
          organizationId: organization.id,
        },
        include: [TemplateAutoLaunchRule, TemplateTarget],
      });

      if (!template) {
        throw new Error('Template not found');
      }

      /** If GPT request is present, user is saving a GPT rule set. Record this */
      if (gptRequestId) {
        detachPromise(() =>
          analytics.newEvent(Events.gptEvent, {
            event: 'Targeting GPT',
            subEvent: 'Save',
            requestUser: user.email,
            organizationEntityId: organization.entityId,
            requestId: gptRequestId,
            payload: {
              templateEntityId: template.entityId,
              savedRules: targets,
            },
          })
        );
      }

      await setAutoLaunchConfig(
        {
          template,
          isAutoLaunchEnabled,
          onlySetAutolaunchState,
          targets,
        },
        {
          organization,
          user,
        }
      );

      await template.reload();

      return { template };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  },
});
export default setAutoLaunchRulesAndTargetsForTemplate;
