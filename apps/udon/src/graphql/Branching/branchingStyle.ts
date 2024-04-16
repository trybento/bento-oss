import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql';

import { BranchingFormFactor } from 'bento-common/types/globalShoyuState';
import {
  BranchingCardStyle,
  CYOABackgroundImagePosition,
} from 'bento-common/types';
import {
  InputFieldConfigMap,
  FieldConfigMap,
} from 'bento-common/types/graphql';

import { EmbedContext, GraphQLContext } from '../types';
import {
  CYOABackgroundImagePositionEnumType,
  PossibleBranchingStyle,
} from './types';
import { BranchingBranch } from 'src/data/models/types';

/**
 * @todo move other branching types listed below to this folder:
 * - BranchingPath
 * - BranchingQuestion
 */

// Input types

const BranchingCardStyleInputFields: InputFieldConfigMap = {
  // will be ignored by the server, but may exist
  formFactor: {
    type: GraphQLString,
  },
  backgroundImageUrl: {
    type: GraphQLString,
  },
  backgroundImagePosition: {
    type: CYOABackgroundImagePositionEnumType,
  },
};

export const BranchingStyleInputType = new GraphQLInputObjectType({
  name: 'BranchingStyleInput',
  fields: {
    ...BranchingCardStyleInputFields,
  },
});

// Resolution types

const BaseBranchingStyleTypeFields: FieldConfigMap<
  BranchingCardStyle,
  EmbedContext | GraphQLContext
> = {
  formFactor: {
    type: GraphQLString,
    resolve: (style: any) => style.formFactor,
  },
};

const BranchingCardStyleType = new GraphQLObjectType<
  BranchingCardStyle,
  EmbedContext | GraphQLContext
>({
  name: 'BranchingCardStyle',
  fields: () => ({
    ...BaseBranchingStyleTypeFields,
    backgroundImageUrl: {
      type: GraphQLString,
    },
    backgroundImagePosition: {
      type: new GraphQLNonNull(CYOABackgroundImagePositionEnumType),
      resolve: (style, _args, _ctx) =>
        style?.backgroundImagePosition ||
        CYOABackgroundImagePosition.background,
    },
  }),
});

const BaseStyleType = new GraphQLObjectType<
  BranchingCardStyle,
  EmbedContext | GraphQLContext
>({
  name: 'BranchingBaseStyle',
  fields: () => ({
    ...BaseBranchingStyleTypeFields,
  }),
});

export const BranchingStyleUnionType = new GraphQLUnionType({
  name: 'BranchingStyle',
  types: [BaseStyleType, BranchingCardStyleType],
  resolveType: (
    style: PossibleBranchingStyle & { formFactor: BranchingFormFactor }
  ) => {
    switch (style.formFactor) {
      case BranchingFormFactor.cards:
        return BranchingCardStyleType;

      case BranchingFormFactor.dropdown:
      case null: // for non branching steps
        return BaseStyleType;

      default:
        throw new Error(
          `Cannot resolve style. Unknown form factor: ${style.formFactor}`
        );
    }
  },
});

export const BranchingStyleResolverField: GraphQLFieldConfig<
  any,
  EmbedContext | GraphQLContext
> = {
  description: 'Branching style based on the branching form factor',
  type: BranchingStyleUnionType,
  resolve: (
    source: BranchingBranch & {
      /**
       * Injected in the StepPrototype resolver to enable the underlying
       * resolvers to determine the branching style sub-type.
       **/
      formFactor?: BranchingFormFactor;
    }
  ) => {
    return {
      ...(source.style || {}),
      formFactor: source.formFactor || null,
    };
  },
};
