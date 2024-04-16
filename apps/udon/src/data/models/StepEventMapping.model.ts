import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Organization } from './Organization.model';
import { StepPrototype } from './StepPrototype.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';

/**
 * This should be migrated over to the new data model in the near future.
 * @deprecated use `AutoCompleteInteraction` instead
 */
@Table({ schema: 'core', tableName: 'step_event_mappings' })
export class StepEventMapping extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: string;

  @AllowNull(false)
  @ForeignKey(() => StepPrototype)
  @Column({ field: 'step_prototype_id', type: DataType.INTEGER })
  readonly stepPrototypeId!: number;

  @AllowNull(false)
  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @AllowNull(false)
  @Column({ field: 'complete_for_whole_account', type: DataType.BOOLEAN })
  readonly completeForWholeAccount!: boolean;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => StepPrototype)
  readonly stepPrototype!: StepPrototype;
}
