import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { SelectedModelAttrs, StepType } from 'bento-common/types';
import { AutoCompleteInteractionCompletableType } from 'bento-common/types/stepAutoComplete';
import { MediaReferenceType } from 'bento-common/types/media';
import { SlateBodyElement } from 'bento-common/types/slate';
import { BranchingFormFactor } from 'bento-common/types/globalShoyuState';

import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';
import { ModuleStepPrototype } from './ModuleStepPrototype.model';
import { Organization } from './Organization.model';
import { User } from './User.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { StepPrototypeCta } from './StepPrototypeCta.model';
import { InputStepPrototype } from './InputStepPrototype.model';
import { BranchingPath } from './BranchingPath.model';
import { BranchingBranch, InputType } from './types';
import AutoCompleteInteraction from './AutoCompleteInteraction.model';
import MediaReference from './MediaReference.model';
import { isBranchingStep } from 'src/utils/stepHelpers';

export type StepPrototypeWithBranchingFields = SelectedModelAttrs<
  StepPrototype,
  | 'name'
  | 'entityId'
  | 'stepType'
  | 'branchingQuestion'
  | 'branchingMultiple'
  | 'branchingDismissDisabled'
  | 'branchingChoices'
  | 'branchingFormFactor'
>;

export enum StepPrototypeModelScope {
  /** Includes name and all branching fields */
  withBranchingFields = 'withBranchingFields',
  /** Includes the `ModuleStepPrototype` association */
  withModuleStepPrototype = 'withModuleStepPrototype',
  /** Includes the `BranchingField` association with all fields */
  withBranchingPaths = 'withBranchingPaths',
}

@Scopes(() => ({
  [StepPrototypeModelScope.withModuleStepPrototype]: (required?: boolean) => ({
    include: [{ model: ModuleStepPrototype, required }],
  }),
  [StepPrototypeModelScope.withBranchingPaths]: { include: [BranchingPath] },
  /**
   * Returns the name and all branching fields for the StepPrototype.
   * for use with {@link StepPrototypeWithBranchingFields}
   */
  [StepPrototypeModelScope.withBranchingFields]: {
    attributes: [
      'name',
      'entityId', // (also known as `branchingKey`)
      'stepType',
      'branchingQuestion',
      'branchingMultiple',
      'branchingDismissDisabled',
      'branchingChoices',
      'branchingFormFactor',
    ],
  },
}))
@Table({ schema: 'core', tableName: 'step_prototypes' })
export class StepPrototype extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  readonly name!: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  readonly body?: string;

  @AllowNull(true)
  @Column({ field: 'body_slate', type: DataType.JSONB })
  readonly bodySlate?: SlateBodyElement[];

  @AllowNull(true)
  @EnumColumn('input_type', InputType)
  readonly inputType!: InputType;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(false)
  @EnumColumn('step_type', StepType)
  readonly stepType!: StepType;

  @AllowNull(true)
  @Column({ field: 'dismiss_label', type: DataType.TEXT })
  readonly dismissLabel?: string;

  @AllowNull(true)
  @Column({ field: 'branching_question', type: DataType.TEXT })
  readonly branchingQuestion?: string;

  @AllowNull(true)
  @Default(false)
  @Column({ field: 'branching_multiple', type: DataType.BOOLEAN })
  readonly branchingMultiple?: boolean;

  @AllowNull(true)
  @Default(false)
  @Column({ field: 'branching_dismiss_disabled', type: DataType.BOOLEAN })
  readonly branchingDismissDisabled?: boolean;

  /**
   * This has been rendered unnecessary after removing the `branching_key`
   * field from underlying step instances and was previously used to directly
   * reference the branching key present in the branching_paths table.
   *
   * @deprecated in favor of the `entity_id` column
   * @remove remove after D+14
   */
  @AllowNull(true)
  @Column({
    field: 'branching_key',
    type: DataType.VIRTUAL(DataType.UUID),
    get: function (this: StepPrototype) {
      if (isBranchingStep(this.stepType)) {
        return this.getDataValue('entityId');
      }
      return null;
    },
  })
  readonly branchingKey?: string;

  @AllowNull(true)
  @Column({ field: 'branching_choices', type: DataType.JSONB })
  readonly branchingChoices?: BranchingBranch[];

  @EnumColumn('branching_form_factor', BranchingFormFactor)
  readonly branchingFormFactor!: BranchingFormFactor;

  @AllowNull(true)
  @Column({ field: 'manual_completion_disabled', type: DataType.BOOLEAN })
  readonly manualCompletionDisabled?: boolean;

  @AllowNull(true)
  @Column({ field: 'snappy_at', type: DataType.DATE })
  readonly snappyAt?: Date;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'created_by_user_id', type: DataType.INTEGER })
  readonly createdByUserId!: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'updated_by_user_id', type: DataType.INTEGER })
  readonly updatedByUserId!: number;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => User)
  readonly createdByUser!: User;

  @BelongsTo(() => User)
  readonly updatedByUser!: User;

  @HasMany(() => StepPrototypeCta)
  readonly ctas!: StepPrototypeCta[];

  @HasMany(() => ModuleStepPrototype, { foreignKey: 'stepPrototypeId' })
  readonly moduleStepPrototypes!: ModuleStepPrototype[];

  @HasMany(() => StepPrototypeAutoCompleteInteraction, {
    foreignKey: 'stepPrototypeId',
  })
  /** @deprecated start using `newAutoCompleteInteractions` where possible */
  readonly autoCompleteInteractions?: StepPrototypeAutoCompleteInteraction[];

  @HasMany(() => InputStepPrototype)
  readonly inputs!: InputStepPrototype[];

  @HasMany(() => BranchingPath, {
    sourceKey: 'entityId',
    foreignKey: 'branchingKey',
  })
  readonly branchingPaths?: BranchingPath[];

  @HasMany(() => AutoCompleteInteraction, {
    foreignKey: 'completableId',
    constraints: false,
    scope: {
      completableType: AutoCompleteInteractionCompletableType.stepPrototype,
    },
  })
  readonly newAutoCompleteInteractions?: AutoCompleteInteraction[];

  @HasMany(() => MediaReference, {
    foreignKey: 'referenceId',
    constraints: false,
    scope: {
      referenceType: MediaReferenceType.stepPrototype,
    },
  })
  readonly mediaReferences?: MediaReference[];
}
