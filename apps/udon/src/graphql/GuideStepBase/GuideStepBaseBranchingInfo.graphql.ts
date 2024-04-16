import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import AccountUserType from '../AccountUser/AccountUser.graphql';

export const GuideStepBaseBranchingInfo = new GraphQLObjectType({
  name: 'GuideStepBaseBranchingInfo',
  fields: () => ({
    choiceLabel: {
      type: GraphQLString,
    },
    choiceKey: {
      type: GraphQLString,
    },
    usersSelected: {
      type: new GraphQLNonNull(new GraphQLList(AccountUserType)),
    },
  }),
});
