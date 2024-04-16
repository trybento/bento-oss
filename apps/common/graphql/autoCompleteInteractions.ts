import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql';

import { enumToGraphqlEnum } from '../utils/graphql';
import {
  AutoCompleteInteractionType,
  StepAutoCompleteInteraction,
} from '../types/stepAutoComplete';
import { FieldConfigMap } from '../types/graphql';

const AutoCompleteInteractionTypeType = enumToGraphqlEnum({
  name: 'AutoCompleteInteractionType',
  enumType: AutoCompleteInteractionType,
});

/**
 * This should contain all the common properties between
 * every interaction type and always be available.
 */
const CommonTypeFields: FieldConfigMap<
  { interactionType: AutoCompleteInteractionType },
  unknown
> = {
  interactionType: {
    type: AutoCompleteInteractionTypeType,
  },
};

const CommonFields = {
  interactionType: {
    type: new GraphQLNonNull(AutoCompleteInteractionTypeType),
  },
};

const GuideCompletionFields = {
  templateEntityId: {
    type: GraphQLString,
  },
};

const OnGuideCompletionType = new GraphQLObjectType({
  name: 'OnGuideCompletion',
  fields: {
    ...CommonTypeFields,
    templateEntityId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

export const AutoCompleteInteractionUnionType = new GraphQLUnionType({
  name: 'AutoCompleteInteraction',
  types: [
    OnGuideCompletionType,
    // add more
  ],
  resolveType: (autoCompleteInteraction: StepAutoCompleteInteraction) => {
    switch (autoCompleteInteraction.interactionType) {
      case AutoCompleteInteractionType.guideCompletion:
        return OnGuideCompletionType;
    }
  },
});

export const AutoCompleteInteractionInputType = new GraphQLInputObjectType({
  name: 'AutoCompleteInteractionInput',
  fields: {
    ...CommonFields,
    ...GuideCompletionFields,
  },
});
