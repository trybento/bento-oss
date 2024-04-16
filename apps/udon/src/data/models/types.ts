import { BranchingStyle } from 'bento-common/types';

export enum AccountStatus {
  active = 'active',
  archived = 'archived',
}

/**
 * @deprecated shouldn't we just use `TargetValueType` instead?
 */
export enum AttributeValueType {
  Number = 'number',
  Text = 'text',
  Boolean = 'boolean',
  Date = 'date',
}

export enum AllowedEmbedType {
  inline = 'inline',
  sidebar = 'sidebar',
}

export enum AuthType {
  email = 'email',
  google = 'google',
}

export enum UserStatus {
  active = 'active',
  unverified = 'unverified',
  disabled = 'disabled',
  invited = 'invited',
}

export enum InputType {
  File = 'file',
  Text = 'text',
  Select = 'select',
}

export type BranchingBranch = {
  /**
   * The key for this branch.
   * NOTE: For the embed, we transform `choiceKey` into `key` at the graphql resolver.
   */
  choiceKey: string;
  /** The label for this branch. */
  label: string;
  /**
   * Indicates if this branch is currently selected
   * @deprecated infer it from triggered branching paths instead
   */
  selected?: boolean;
  /** Style, if any */
  style?: BranchingStyle;
};

/**
 * Branching branches with an indicator of whether they had been selected.
 * This is meant to be used within the end-user context only.
 */
export type SelectableBranchingBranch = BranchingBranch & {
  /** Whether this branch has been selected */
  selected: boolean;
};
