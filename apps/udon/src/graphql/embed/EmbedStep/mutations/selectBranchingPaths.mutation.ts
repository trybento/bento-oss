import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Op } from 'sequelize';
import { GuideTypeEnum } from 'bento-common/types';

import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import { EntityId } from 'src/graphql/helpers/types';
import selectBranchingPath, {
  SelectBranchingPathArgs,
} from 'src/interactions/branching/selectBranchingPath';
import {
  triggerAvailableGuidesChangedForAccountUsers,
  triggerGuideBaseChangedForSteps,
  triggerGuideChangedForSteps,
  triggerStepAutoCompleteInteractionsChangedForGuides,
} from 'src/data/eventUtils';
import detachPromise from 'src/utils/detachPromise';
import { invalidateLaunchingCacheForOrgAsync } from 'src/interactions/caching/identifyChecksCache';
import { Template } from 'src/data/models/Template.model';
import { makeLogger } from 'src/jobsBull/logger';

const logger = makeLogger('selectBranchingPath.mutation');

export default generateEmbedMutation<unknown, SelectBranchingPathArgs>({
  name: 'selectBranchingPath',
  description: 'set attributes on a user or account',
  inputFields: {
    branchingKey: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Set of branching paths to reference',
    },
    choiceKeys: {
      type: GraphQLList(GraphQLNonNull(GraphQLString)),
      description: 'keys for paths to take',
    },
    choiceLabels: {
      type: GraphQLList(GraphQLNonNull(GraphQLString)),
      description: 'user-facing labels for the chosen paths',
    },
    stepEntityId: {
      type: EntityId,
      description: 'The associated branching step',
    },
    shouldCompleteStep: {
      type: GraphQLNonNull(GraphQLBoolean),
    },
    branchingMultiple: {
      type: GraphQLBoolean,
      deprecationReason:
        'Not in use. Scheduled to be removed after March 1, 2024',
    },
  },
  outputFields: {},
  mutateAndGetPayload: async (args, { account, accountUser, organization }) => {
    if (!args.stepEntityId) return { errors: 'Step entityId not provided' };

    try {
      const { guidesAddedOrLaunched, step, launchedGuides } =
        await selectBranchingPath(args, {
          account,
          accountUser,
          organization,
        });

      if (guidesAddedOrLaunched) {
        triggerAvailableGuidesChangedForAccountUsers([accountUser]);
      }

      if (step) {
        triggerGuideChangedForSteps([step]);
        triggerGuideBaseChangedForSteps([step]);
        triggerStepAutoCompleteInteractionsChangedForGuides([step.guide]);
      }

      detachPromise(async () => {
        const hasLaunchedAnAccountTemplate = await Template.findOne({
          attributes: ['type'],
          where: {
            id: {
              [Op.in]: launchedGuides.map((g) => g.createdFromTemplateId!),
            },
            type: GuideTypeEnum.account,
          },
        }).then((template) => !!template);

        if (hasLaunchedAnAccountTemplate) {
          invalidateLaunchingCacheForOrgAsync(
            organization,
            'selectBranchingPaths'
          );
        }
      }, '[selectBranchingPath] invalidate launching cache for org');
    } catch (e: any) {
      logger.error(`Failed to select a branching path: ${e.msg}`, e);

      return { errors: [e.msg || 'Could not select branch'] };
    }
  },
});
