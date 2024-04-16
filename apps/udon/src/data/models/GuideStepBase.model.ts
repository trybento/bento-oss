import {
  CreationAttributes,
  CreationOptional,
  Includeable,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { AtLeast, StepType } from 'bento-common/types';
import { SlateBodyElement } from 'bento-common/types/slate';
import { BranchingFormFactor } from 'bento-common/types/globalShoyuState';

import { GuideBase } from './GuideBase.model';
import { GuideModuleBase } from './GuideModuleBase.model';
import {
  StepPrototype,
  StepPrototypeModelScope,
  StepPrototypeWithBranchingFields,
} from './StepPrototype.model';
import { Organization } from './Organization.model';
import { User } from './User.model';
import { EntityId, CreatedAt, UpdatedAt, DeletedAt } from './columns';
import { GuideBaseStepCta } from './GuideBaseStepCta.model';
import { GuideBaseStepAutoCompleteInteraction } from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { BranchingBranch } from './types';
import { deprecatedSetter } from './common';
import { sequelizeBulkUpsert } from '../sequelizeUtils';

export type GuideStepBaseWithPrototypeWithBranchingInfo<T = GuideStepBase> =
  T & {
    createdFromStepPrototype: StepPrototypeWithBranchingFields;
  };

export enum GuideBaseStepModelScope {
  byOrderIndex = 'byOrderIndex',
  withPrototypeBranchingInfo = 'withPrototypeBranchingInfo',
  withCtas = 'withCtas',
}

export type GuideStepBaseWithCtas<T = GuideStepBase> = T & {
  ctas: GuideBaseStepCta[];
};

@Scopes(() => ({
  [GuideBaseStepModelScope.byOrderIndex]: { order: [['orderIndex', 'ASC']] },
  [GuideBaseStepModelScope.withPrototypeBranchingInfo]: () => ({
    include: [
      {
        model: StepPrototype.scope(StepPrototypeModelScope.withBranchingFields),
        required: true,
      },
    ],
  }),
  [GuideBaseStepModelScope.withCtas]: (
    includeOptions: Exclude<Includeable, string> = {}
  ) => ({
    include: [
      {
        model: GuideBaseStepCta,
        ...includeOptions,
      },
    ],
  }),
}))
@Table({
  schema: 'core',
  tableName: 'guide_step_bases',
  indexes: [
    {
      name: 'core_gsb_guide_id_created_from_step_prototype_id_key',
      unique: true,
      fields: ['guide_base_id', 'created_from_step_prototype_id'],
    },
  ],
  paranoid: true,
})
export class GuideStepBase extends Model<
  InferAttributes<GuideStepBase>,
  InferCreationAttributes<GuideStepBase, { omit: 'createdAt' | 'updatedAt' }>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  readonly name?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  readonly body?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({ field: 'body_slate', type: DataType.JSONB })
  readonly bodySlate?: CreationOptional<SlateBodyElement[] | null>;

  @AllowNull(false)
  @Column({ field: 'order_index', type: DataType.INTEGER })
  readonly orderIndex!: number;

  @AllowNull(true)
  @EnumColumn('step_type', StepType, {
    set: deprecatedSetter('Step', 'stepType'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly stepType?: CreationOptional<StepType | null>;

  @ForeignKey(() => GuideBase)
  @AllowNull(false)
  @Column({ field: 'guide_base_id', type: DataType.INTEGER })
  readonly guideBaseId!: number;

  @ForeignKey(() => GuideModuleBase)
  @AllowNull(true)
  @Column({ field: 'guide_module_base_id', type: DataType.INTEGER })
  readonly guideModuleBaseId!: number;

  @ForeignKey(() => StepPrototype)
  @AllowNull(true)
  @Column({ field: 'created_from_step_prototype_id', type: DataType.INTEGER })
  readonly createdFromStepPrototypeId?: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

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
    set: deprecatedSetter('GuideStepBase', 'branchingQuestion'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly branchingQuestion?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({
    field: 'branching_multiple',
    type: DataType.BOOLEAN,

    set: deprecatedSetter('GuideStepBase', 'branchingMultiple'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly branchingMultiple?: CreationOptional<boolean | null>;

  @AllowNull(true)
  @Column({
    field: 'branching_dismiss_disabled',
    type: DataType.BOOLEAN,
    set: deprecatedSetter('GuideStepBase', 'branchingDismissDisabled'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly branchingDismissDisabled?: CreationOptional<boolean | null>;

  @AllowNull(true)
  @Column({
    field: 'branching_key',
    type: DataType.TEXT,
    set: deprecatedSetter('GuideStepBase', 'branchingKey'),
  })
  /** @deprecated use StepPrototype.entityId instead */
  readonly branchingKey?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({ field: 'branching_choices', type: DataType.JSONB })
  /** @deprecated use it from StepPrototype instead */
  readonly branchingChoices?: CreationOptional<BranchingBranch[] | null>;

  @AllowNull(true)
  @EnumColumn('branching_form_factor', BranchingFormFactor, {
    set: deprecatedSetter('GuideStepBase', 'branchingFormFactor'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly branchingFormFactor?: CreationOptional<BranchingFormFactor | null>;

  @AllowNull(true)
  @Column({
    field: 'manual_completion_disabled',
    type: DataType.BOOLEAN,
    set: deprecatedSetter('GuideStepBase', 'manualCompletionDisabled'),
  })
  /** @deprecated use it from StepPrototype instead */
  readonly manualCompletionDisabled?: CreationOptional<boolean | null>;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  declare deletedAt?: CreationOptional<Date | null>;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'created_by_user_id', type: DataType.INTEGER })
  readonly createdByUserId!: CreationOptional<number | null>;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'updated_by_user_id', type: DataType.INTEGER })
  readonly updatedByUserId!: CreationOptional<number | null>;

  // Associations
  @BelongsTo(() => GuideBase)
  readonly guideBase!: NonAttribute<GuideBase>;

  @BelongsTo(() => GuideModuleBase)
  readonly guideModuleBase?: NonAttribute<GuideModuleBase>;

  @BelongsTo(() => StepPrototype)
  readonly createdFromStepPrototype?: NonAttribute<StepPrototype>;

  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;

  @BelongsTo(() => User)
  readonly createdByUser!: NonAttribute<User>;

  @BelongsTo(() => User)
  readonly updatedByUser!: NonAttribute<User>;

  @HasMany(() => GuideBaseStepCta)
  readonly ctas?: NonAttribute<GuideBaseStepCta[]>;

  @HasMany(() => GuideBaseStepAutoCompleteInteraction)
  readonly autoCompleteInteractions?: NonAttribute<
    GuideBaseStepAutoCompleteInteraction[]
  >;

  @HasMany(() => InputStepBase)
  readonly inputs!: NonAttribute<InputStepBase[]>;
}

/**
 * Helper method to carry over data from StepPrototype to GuideStepBase.
 *
 * @todo extract to centralize all propagation helpers
 */
export const attrsFromStepPrototype = (
  stepPrototype: StepPrototype,
  extraProps: AtLeast<
    CreationAttributes<GuideStepBase>,
    'guideBaseId' | 'guideModuleBaseId' | 'orderIndex'
  >
): CreationAttributes<GuideStepBase> => ({
  organizationId: stepPrototype.organizationId,
  createdFromStepPrototypeId: stepPrototype.id,
  ...extraProps,
});

/**
 * Sequelize does not yet support bulkCreate with conflictFields.
 * By default it will include entityId within the unique constraint, which isn't what we want
 * So until Sequelize fixes this we have to do upserts individually.
 */
export const bulkUpsertGuideStepBase = async (
  upsertData: Array<CreationAttributes<GuideStepBase>>
): Promise<GuideStepBase[]> => {
  return sequelizeBulkUpsert(GuideStepBase, upsertData, {
    concurrency: 3,
    upsertOpts: {
      returning: true,
      conflictFields: ['guideBaseId', 'createdFromStepPrototypeId'],
    },
  });
};
