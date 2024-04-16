import { GraphQLNonNull, GraphQLString } from 'graphql';
import { GroupTargeting } from 'bento-common/types/targeting';
import { Audience } from 'src/data/models/Audience.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { TemplateTargetsInputType } from 'src/graphql/Template/mutations/setAutoLaunchRulesAndTargetsForTemplate';
import { targetingSegmentToLegacy } from 'src/interactions/targeting/targeting.helpers';
import AudienceType from '../Audience.graphql';
import { graphQlError } from 'src/graphql/utils';

type Args = {
  name: string;
  targets: GroupTargeting;
};

const MAX_AUDIENCES = 20;

export default generateMutation<unknown, Args>({
  name: 'SaveNewAudience',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    targets: {
      type: TemplateTargetsInputType,
    },
  },
  outputFields: {
    audience: { type: AudienceType },
  },
  mutateAndGetPayload: async (args, { organization, user }) => {
    const { name, targets } = args;

    const accountTargets = targetingSegmentToLegacy(
      targets.account,
      'ruleType'
    );

    const accountUserTargets = targetingSegmentToLegacy(
      targets.accountUser,
      'targetType'
    );

    const existingAudiences = await Audience.count({
      where: {
        organizationId: organization.id,
      },
    });

    if (existingAudiences >= MAX_AUDIENCES)
      return graphQlError('Audience limit exceeded');

    const newAudience = await Audience.create({
      organizationId: organization.id,
      name,
      autoLaunchRules: accountTargets,
      targets: accountUserTargets,
      editedAt: new Date(),
      editedByUserId: user.id,
    });

    return { audience: newAudience };
  },
});
