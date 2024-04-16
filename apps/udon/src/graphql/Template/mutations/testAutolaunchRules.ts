import { GraphQLInt, GraphQLString } from 'graphql';
import { Template } from 'src/data/models/Template.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import getTemplateAutoLaunchAudience from 'src/interactions/targeting/getTemplateAutoLaunchAudience';
import { TemplateTargetsInputType } from './setAutoLaunchRulesAndTargetsForTemplate';

export default generateMutation({
  name: 'TestAutolaunchRules',
  inputFields: {
    targets: {
      type: TemplateTargetsInputType,
    },
    templateEntityId: {
      type: GraphQLString,
    },
  },
  outputFields: {
    accountUsers: {
      type: GraphQLInt,
    },
    accounts: {
      type: GraphQLInt,
    },
  },
  mutateAndGetPayload: async (args, { organization }) => {
    const { targets, templateEntityId } = args;

    const template =
      (templateEntityId &&
        (await Template.findOne({
          where: {
            entityId: templateEntityId,
          },
        }))) ||
      undefined;

    if (!template && templateEntityId)
      return {
        accountUsers: 0,
        accounts: 0,
      };

    return await getTemplateAutoLaunchAudience({
      organization,
      template,
      targets,
    });
  },
});
