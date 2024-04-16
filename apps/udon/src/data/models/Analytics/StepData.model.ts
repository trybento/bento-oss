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

import { CreatedAt, UpdatedAt, EntityId } from '../columns';
import { Organization } from '../Organization.model';
import { StepPrototype } from '../StepPrototype.model';
import { Template } from '../Template.model';

/**
 * Cached data for step prototype performance
 *
 * Updated by the hourly job updateStepData
 *
 * Other data aggregation tables are often based on guide base level
 *   However, the largest pool of steps and guide step bases at this time
 *   is only by around a factor of 4x. as such, aggregating by
 *   the guide step base level does not provide that much benefit.
 *
 * We need to store data on each combo of step and template, otherwise if a step
 *   is reused across templates, we can't isolate the numbers
 */
@Table({
  schema: 'analytics',
  tableName: 'step_data',
  indexes: [
    {
      name: 'step_data_unique',
      unique: true,
      fields: ['step_prototype_id', 'template_id', 'organization_id'],
    },
  ],
})
export class StepData extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @ForeignKey(() => StepPrototype)
  @Column({ field: 'step_prototype_id', type: DataType.INTEGER })
  readonly stepPrototypeId!: number;

  @AllowNull(false)
  @ForeignKey(() => Template)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @AllowNull(false)
  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  /** @todo consistent naming */
  @AllowNull(true)
  @Default(0)
  @Column({ field: 'associated_steps', type: DataType.INTEGER })
  readonly associatedSteps?: number;

  @AllowNull(true)
  @Default(0)
  @Column({ field: 'completed_steps', type: DataType.INTEGER })
  readonly completedSteps?: number;

  @AllowNull(true)
  @Default(0)
  @Column({ field: 'viewed_steps', type: DataType.INTEGER })
  readonly viewedSteps?: number;

  @AllowNull(true)
  @Default(0)
  @Column({ field: 'steps_in_viewed_guides', type: DataType.INTEGER })
  readonly stepsInViewedGuides?: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => StepPrototype)
  readonly stepPrototype?: StepPrototype;

  @BelongsTo(() => Template)
  readonly template?: Template;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
