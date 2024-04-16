import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { intersection, type } from 'superstruct';
import { NpsSurveyInput } from 'bento-common/types/netPromoterScore';
import { RankableObject, WithEntityId } from 'bento-common/types';
import { Uuid } from 'bento-common/validation/customRules';

import generateMutation from 'src/graphql/helpers/generateMutation';
import { EntityId } from 'src/graphql/helpers/types';
import {
  npsSurveyCreateOrUpdateSchema,
  priorityRankingsSetSchema,
} from 'src/interactions/netPromoterScore/helpers';
import upsertNpsSurvey from 'src/interactions/netPromoterScore/upsertNpsSurvey';
import { assertWithGraphqlError } from 'src/utils/validation';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NpsSurveyType from '../NpsSurvey.graphql';
import { npsSurveyInputFields } from '../helpers';
import { RankableObjectInputType } from 'src/graphql/RankableObject/helpers';
import { setPriorityRanking } from 'src/interactions/setPriorityRankings';

export type EditNpsSurveyMutationArgs = {
  npsSurveyData: WithEntityId<NpsSurveyInput>;
  priorityRankings: RankableObject[];
};

type ReturnType = {
  npsSurvey: NpsSurvey;
};

const editNpsSurveySchema = intersection([
  type({
    entityId: Uuid,
  }),
  npsSurveyCreateOrUpdateSchema,
]);

export default generateMutation<unknown, EditNpsSurveyMutationArgs>({
  name: 'EditNpsSurvey',
  description: 'Edit an existing NPS Survey',
  inputFields: {
    npsSurveyData: {
      type: new GraphQLInputObjectType({
        name: 'NpsSurveyDataType',
        fields: {
          entityId: {
            type: new GraphQLNonNull(EntityId),
            description: 'Entity Id of the target NPS survey',
          },
          ...npsSurveyInputFields,
        },
      }),
    },
    priorityRankings: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(RankableObjectInputType))
      ),
    },
  },
  outputFields: {
    npsSurvey: {
      type: NpsSurveyType,
    },
  },
  mutateAndGetPayload: async (
    args,
    { organization, user }
  ): Promise<ReturnType> => {
    // Validate NPS survey data.
    assertWithGraphqlError(args.npsSurveyData, editNpsSurveySchema);

    // Validate priority rankings.
    assertWithGraphqlError(args, priorityRankingsSetSchema);

    const { entityId, ...npsSurveyInput } = args.npsSurveyData;

    const [npsSurvey] = await upsertNpsSurvey({
      organization,
      input: npsSurveyInput,
      entityId,
    });

    await setPriorityRanking({
      targets: args.priorityRankings,
      organizationId: organization.id,
      user,
    });

    return { npsSurvey };
  },
});
