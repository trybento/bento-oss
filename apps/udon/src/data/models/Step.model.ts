import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  DataType,
  ForeignKey,
  Model,
  Table,
  HasMany,
  Scopes,
} from 'sequelize-typescript';
import {
  CreationAttributes,
  CreationOptional,
  Includeable,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { AtLeast, StepType } from 'bento-common/types';
import { SlateBodyElement } from 'bento-common/types/slate';
import { BranchingFormFactor } from 'bento-common/types/globalShoyuState';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { deprecatedSetter } from './common';
import { AccountUser } from './AccountUser.model';
import { User } from './User.model';
import { Guide } from './Guide.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { GuideStepBase } from './GuideStepBase.model';
import {
  StepPrototype,
  StepPrototypeModelScope,
  StepPrototypeWithBranchingFields,
} from './StepPrototype.model';
import { Organization } from './Organization.model';
import { BranchingBranch, InputType } from './types';
import { sequelizeBulkUpsert } from '../sequelizeUtils';

export enum StepCompletedByType {
  Auto = 'auto',
  User = 'user',
  AccountUser = 'account_user',
}

export enum StepModelScope {
  withPrototype = 'withPrototype',
  withBase = 'withGuideStepBase',
  withPrototypeBranchingInfo = 'withPrototypeBranchingInfo',
}

export type StepWithPrototypeBranchingInfo<T = Step> = T & {
  createdFromStepPrototype: StepPrototypeWithBranchingFields;
};

export type StepWithBase<T = Step> = T & {
  createdFromGuideStepBase: GuideStepBase;
};

export type StepWithPrototype<T = Step> = T & {
  createdFromStepPrototype: StepPrototype;
};

@Scopes(() => ({
  byOrderIndex: { order: [['orderIndex', 'ASC']] },
  /**
   * Returns the StepPrototype from which this Step was created.
   * To be used with {@link StepWithPrototype}
   */
  [StepModelScope.withPrototype]: (
    includeOptions: Exclude<Includeable, string> = {}
  ) => ({
    include: [
      {
        required: true,
        model: StepPrototype,
        ...includeOptions,
      },
    ],
  }),
  /**
   * Returns the GuideStepBase from which this Step was created.
   * To be used with {@link StepWithBase}
   */
  [StepModelScope.withBase]: (
    includeOptions: Exclude<Includeable, string> = {}
  ) => ({
    include: [
      {
        required: true,
        model: GuideStepBase,
        ...includeOptions,
      },
    ],
  }),
  /**
   * Returns the Step with the associated prototype, including name and all branching fields.
   * To be used with {@link StepWithPrototypeBranchingInfo}
   */
  [StepModelScope.withPrototypeBranchingInfo]: () => ({
    include: [
      {
        model: StepPrototype.scope(StepPrototypeModelScope.withBranchingFields),
        required: true,
      },
    ],
  }),
}))
@Table({
  schema: 'core',
  tableName: 'steps',
})
export class Step extends Model<
  InferAttributes<Step>,
  InferCreationAttributes<Step, { omit: 'createdAt' | 'updatedAt' }>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(true)
  @Column({ type: DataType.TEXT, set: deprecatedSetter('Step', 'name') })
  /** @deprecated use it from guideStepBase instead */
  readonly name?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({ type: DataType.TEXT, set: deprecatedSetter('Step', 'body') })
  /** @deprecated use it from guideStepBase instead */
  readonly body?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({
    field: 'body_slate',
    type: DataType.JSONB,
    set: deprecatedSetter('Step', 'body_slate'),
  })
  /** @deprecated use it from guideStepBase instead */
  readonly bodySlate?: CreationOptional<SlateBodyElement[] | null>;

  // TODO: Deprecate this
  @AllowNull(false)
  @Default(false)
  @Column({ field: 'is_complete', type: DataType.BOOLEAN })
  readonly isComplete!: CreationOptional<boolean>;

  @AllowNull(true)
  @Column({ field: 'completed_at', type: DataType.DATE })
  readonly completedAt?: CreationOptional<Date | null>;

  @AllowNull(true)
  @EnumColumn('completed_by_type', StepCompletedByType)
  readonly completedByType?: CreationOptional<StepCompletedByType | null>;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Column({ field: 'completed_by_user_id', type: DataType.INTEGER })
  readonly completedByUserId?: CreationOptional<number | null>;

  @AllowNull(true)
  @ForeignKey(() => AccountUser)
  @Column({ field: 'completed_by_account_user_id', type: DataType.INTEGER })
  readonly completedByAccountUserId?: CreationOptional<number | null>;

  @AllowNull(true)
  @EnumColumn('input_type', InputType, {
    set: deprecatedSetter('Step', 'inputType'),
  })
  /** @deprecated use it from guideStepBase instead */
  readonly inputType?: CreationOptional<InputType | null>;

  @AllowNull(true)
  @EnumColumn('step_type', StepType, {
    set: deprecatedSetter('Step', 'stepType'),
  })
  /** @deprecated use it from guideStepBase instead */
  readonly stepType?: CreationOptional<StepType | null>;

  @AllowNull(true)
  @Column({
    field: 'dismiss_label',
    type: DataType.TEXT,
    set: deprecatedSetter('Step', 'dismissLabel'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly dismissLabel?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({
    field: 'branching_question',
    type: DataType.TEXT,
    set: deprecatedSetter('Step', 'branchingQuestion'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly branchingQuestion?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({
    field: 'branching_multiple',
    type: DataType.BOOLEAN,

    set: deprecatedSetter('Step', 'branchingMultiple'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly branchingMultiple?: CreationOptional<boolean | null>;

  @AllowNull(true)
  @Column({
    field: 'branching_dismiss_disabled',
    type: DataType.BOOLEAN,
    set: deprecatedSetter('Step', 'branchingDismissDisabled'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly branchingDismissDisabled?: CreationOptional<boolean | null>;

  @AllowNull(true)
  @Column({
    field: 'branching_key',
    type: DataType.TEXT,
    set: deprecatedSetter('Step', 'branchingKey'),
  })
  /** @deprecated use StepPrototype.entityId instead */
  readonly branchingKey?: CreationOptional<string | null>;

  /**
   * Stores the branching choices for the step, including the selection indicator.
   *
   * WARNING: Can't be removed until we migrate the data to the new format.
   *
   * @todo confirm empty paths are recorded as branchingPaths or triggeredBranchingPaths
   * @todo verify/migrate branchingChoices to triggeredBranchingPaths
   *
   * @deprecated should be removed/changed very soon
   */
  @AllowNull(true)
  @Column({ field: 'branching_choices', type: DataType.JSONB })
  readonly branchingChoices?: CreationOptional<BranchingBranch[] | null>;

  @AllowNull(true)
  @EnumColumn('branching_form_factor', BranchingFormFactor, {
    set: deprecatedSetter('Step', 'branchingFormFactor'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly branchingFormFactor?: CreationOptional<BranchingFormFactor | null>;

  @AllowNull(true)
  @Column({ field: 'notified_at', type: DataType.DATE })
  readonly notifiedAt?: Date;

  @AllowNull(true)
  @Column({
    field: 'order_index',
    type: DataType.INTEGER,
    set: deprecatedSetter('Step', 'orderIndex'),
  })
  /** @deprecated use it from guideStepBase instead */
  readonly orderIndex?: CreationOptional<number | null>;

  @AllowNull(true)
  @Column({
    field: 'manual_completion_disabled',
    type: DataType.BOOLEAN,
    set: deprecatedSetter('Step', 'manualCompletionDisabled'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly manualCompletionDisabled?: CreationOptional<boolean | null>;

  @ForeignKey(() => Guide)
  @AllowNull(false)
  @Column({ field: 'guide_id', type: DataType.INTEGER })
  readonly guideId!: number;

  @ForeignKey(() => GuideModule)
  @AllowNull(true)
  @Column({ field: 'guide_module_id', type: DataType.INTEGER })
  readonly guideModuleId!: number;

  @ForeignKey(() => GuideStepBase)
  @AllowNull(false)
  @Column({ field: 'created_from_guide_step_base_id', type: DataType.INTEGER })
  readonly createdFromGuideStepBaseId!: number;

  /**
   * WARNING: In the DB, this column will be SET NULL when cascading if the stepPrototype (aka SP)
   * ever gets deleted. On the other hand, we're just assuming that will never happen
   * since today we're not deleting the SPs for cases where the link between a SP<->Module is broken
   * (e.g. deleting prototype and not propagating changes), therefore it should be relatively "safe"
   * to rely on that.
   */
  @ForeignKey(() => StepPrototype)
  @AllowNull(false)
  @Column({ field: 'created_from_step_prototype_id', type: DataType.INTEGER })
  readonly createdFromStepPrototypeId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  declare readonly createdAt: Date;

  @UpdatedAt
  declare readonly updatedAt: Date;

  // Associations
  @BelongsTo(() => Guide)
  readonly guide!: NonAttribute<Guide>;

  @BelongsTo(() => GuideModule)
  readonly guideModule?: NonAttribute<GuideModule>;

  @BelongsTo(() => GuideStepBase)
  readonly createdFromGuideStepBase!: NonAttribute<GuideStepBase>;

  @BelongsTo(() => StepPrototype)
  readonly createdFromStepPrototype!: NonAttribute<StepPrototype>;

  @BelongsTo(() => User)
  readonly completedByUser?: NonAttribute<User>;

  @BelongsTo(() => AccountUser)
  readonly completedByAccountUser?: NonAttribute<AccountUser>;

  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;

  @HasMany(() => StepAutoCompleteInteraction)
  readonly autoCompleteInteractions?: NonAttribute<
    StepAutoCompleteInteraction[]
  >;

  // Methods

  /**
   * Marks the current step as incomplete.
   * Resets all completion data, including date and user.
   *
   * @returns promise the updated Step
   */
  markAsIncomplete = () => {
    return this.update({
      isComplete: false,
      completedAt: null,
      completedByType: null,
      completedByUserId: null,
      completedByAccountUserId: null,
    });
  };
}

/**
 * Helper method to carry over data from GuideStepBase to Step.
 *
 * @todo extract to centralize all propagation helpers
 */
export const attrsFromGuideStepBase = (
  guideStepBase: GuideStepBase,
  extraProps: AtLeast<CreationAttributes<Step>, 'guideId' | 'guideModuleId'>
): CreationAttributes<Step> => {
  return {
    organizationId: guideStepBase.organizationId,
    createdFromGuideStepBaseId: guideStepBase.id,
    createdFromStepPrototypeId: guideStepBase.createdFromStepPrototypeId!,
    ...extraProps,
  };
};

export const bulkUpsertStep = async (
  upsertData: Array<CreationAttributes<Step>>
) => {
  return sequelizeBulkUpsert(Step, upsertData, {
    concurrency: 3,
    upsertOpts: {
      returning: true,
      conflictFields: ['guideId', 'createdFromStepPrototypeId'],
    },
  });
};
