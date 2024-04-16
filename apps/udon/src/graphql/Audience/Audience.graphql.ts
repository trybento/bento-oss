import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { entityIdField } from 'bento-common/graphql/EntityId';
import { getRuleValue } from 'bento-common/utils/targeting';
import { TargetingType } from 'bento-common/types/targeting';
import { AudienceState } from 'bento-common/types';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { GraphQLContext } from 'src/graphql/types';
import { Audience } from 'src/data/models/Audience.model';
import { TargetsType } from '../graphQl.types';
import TemplateType from '../Template/Template.graphql';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';
import UserType from '../User/User.graphql';

const AudienceStateType = enumToGraphqlEnum({
  name: 'AudienceStateType',
  enumType: AudienceState,
});

const AudienceType = new GraphQLObjectType<Audience, GraphQLContext>({
  name: 'AudienceRule',
  description: 'An audience rule preset',
  fields: () => ({
    ...globalEntityId('Audience'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the template',
    },
    templates: {
      type: new GraphQLNonNull(new GraphQLList(TemplateType)),
      description: 'Templates using this audience',
      resolve: async (audience, _, { loaders }) =>
        loaders.templatesOfAudienceLoader.load(audience.id),
    },
    editedAt: {
      type: GraphQLDateTime,
      resolve: (audience) => audience.editedAt ?? audience.updatedAt,
    },
    editedBy: {
      type: UserType,
      resolve: (audience, _, { loaders }) =>
        audience.editedByUserId
          ? loaders.userLoader.load(audience.editedByUserId)
          : null,
    },
    state: {
      type: AudienceStateType,
      resolve: async (audience) => {
        const ta = await TemplateAudience.findOne({
          where: {
            audienceEntityId: audience.entityId,
          },
          attributes: ['id'],
        });

        return !!ta ? AudienceState.active : AudienceState.inactive;
      },
    },
    targets: {
      type: TargetsType,
      resolve: async (audience) => {
        const autoLaunchRules = audience.autoLaunchRules;
        const templateTargets = audience.targets;

        const targets = {
          account: {
            type: autoLaunchRules[0].ruleType,
            groups:
              autoLaunchRules[0].ruleType === TargetingType.attributeRules
                ? autoLaunchRules.map((autoLaunchRule) => ({
                    rules: autoLaunchRule.rules.map((rule) => ({
                      ...rule,
                      value: getRuleValue(rule),
                    })),
                  }))
                : undefined,
          },
          accountUser: {
            type: templateTargets[0].targetType,
            groups:
              templateTargets[0].targetType === TargetingType.attributeRules
                ? templateTargets.map((templateTarget) => ({
                    rules: templateTarget.rules.map((rule) => ({
                      ...rule,
                      value: getRuleValue(rule),
                    })),
                  }))
                : undefined,
          },
        };

        return targets;
      },
    },
  }),
});

export default AudienceType;
