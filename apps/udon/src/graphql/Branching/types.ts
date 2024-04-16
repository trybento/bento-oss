import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { CYOABackgroundImagePosition } from 'bento-common/types';
import { BranchingFormFactor } from 'bento-common/types/globalShoyuState';

/**
 * Should contain all possible properties of all
 * branching style types supported, and is used internally on graphql
 * resolvers to know which options might be available.
 */
export type PossibleBranchingStyle = {
  formFactor?: BranchingFormFactor;
  backgroundImageUrl?: string;
  backgroundImagePosition?: CYOABackgroundImagePosition;
};

export const CYOABackgroundImagePositionEnumType = enumToGraphqlEnum({
  name: 'CYOABackgroundImagePosition',
  enumType: CYOABackgroundImagePosition,
});
