import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLContext } from 'src/graphql/types';

export type BranchingQuestion = {
  id: string;
  question: string;
  // The entity_id of a step_prototype. This is used in targeting rules.
  branchingKey: string;
  choices: BranchingQuestionChoice[];
};

export type BranchingQuestionChoice = {
  // id is the entityId of the BranchingPath.
  id: string;
  choiceKey: string;
  label: string;
};

const BranchingQuestionChoiceType = new GraphQLObjectType<
  BranchingQuestionChoice,
  GraphQLContext
>({
  name: 'BranchingQuestionChoice',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    choiceKey: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const BranchingQuestionType = new GraphQLObjectType<
  BranchingQuestion,
  GraphQLContext
>({
  name: 'BranchingQuestion',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    question: { type: new GraphQLNonNull(GraphQLString) },
    branchingKey: { type: new GraphQLNonNull(GraphQLString) },
    choices: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(BranchingQuestionChoiceType))
      ),
    },
  },
});
