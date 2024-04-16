import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

import { Organization } from './Organization.model';
import { Template } from './Template.model';
import { Module } from './Module.model';
import { BranchingEntityType } from 'bento-common/types';
import { StepPrototype } from './StepPrototype.model';

export enum BranchingPathType {
  Create = 'create',
}

export type BranchingPathRule = {
  attribute: string;
  attributeLevel: 'account' | 'account_user';
  ruleType: 'lte' | 'lt' | 'eq' | 'gt' | 'gte';
  valueType: 'text' | 'number' | 'boolean' | 'date';
  value: string | number | boolean;
};

/**
 * Represents each choice that a user can make when branching from a Step.
 * Contains all the branching information needed to present the options to the admin/user.
 */
@Table({ schema: 'core', tableName: 'branching_paths' })
export class BranchingPath extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  /**
   * Which "branching" action this branching path should perform when the user selects it.
   */
  @AllowNull(false)
  @EnumColumn('action_type', BranchingPathType)
  readonly actionType!: BranchingPathType.Create;

  /**
   * Which type of branching this path should take the user to (i.e. guide or module).
   * According to this type we will then provider either a `templateId` or `moduleId`.
   */
  @AllowNull(false)
  @EnumColumn('entity_type', BranchingEntityType)
  readonly entityType!: BranchingEntityType;

  /**
   * The unique identifier for this path.
   * This is currently made of open text provided by the Admin as the human friendly label for this choice.
   */
  @AllowNull(false)
  @Column({ type: DataType.TEXT, field: 'choice_key' })
  readonly choiceKey!: string;

  /**
   * Which step prototype (of branching type) originates this path.
   * References the entity id of the branching Step Prototype instance.
   */
  @AllowNull(false)
  @Column({
    type: DataType.UUIDV4,
    field: 'branching_key',
    comment: 'Maps to step_prototypes.entity_id',
  })
  readonly branchingKey!: string;

  /**
   * Which template this path should take the user to, in case the `entityType` is `guide`.
   */
  @ForeignKey(() => Template)
  @AllowNull(true)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId?: number;

  /**
   * Which module this path should take the user to, in case the `entityType` is `module`.
   */
  @ForeignKey(() => Module)
  @AllowNull(true)
  @Column({ field: 'module_id', type: DataType.INTEGER })
  readonly moduleId?: number;

  /**
   * The order in which this path should be presented to the user.
   */
  @AllowNull(false)
  @Default(0)
  @Column({ field: 'order_index', type: DataType.INTEGER })
  readonly orderIndex!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => Template)
  readonly template!: Template;

  @BelongsTo(() => Module)
  readonly module!: Module;

  @BelongsTo(() => StepPrototype, {
    foreignKey: 'entityId',
    targetKey: 'branchingKey',
  })
  readonly stepPrototype?: StepPrototype;
}
