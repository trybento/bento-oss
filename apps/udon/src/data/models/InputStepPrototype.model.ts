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
import { StepInputFieldSettings, StepInputFieldType } from 'bento-common/types';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Organization } from './Organization.model';
import { StepPrototype } from './StepPrototype.model';

@Table({ schema: 'core', tableName: 'input_step_prototypes' })
export class InputStepPrototype extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => StepPrototype)
  @AllowNull(false)
  @Column({ field: 'step_prototype_id', type: DataType.INTEGER })
  readonly stepPrototypeId!: number;

  @AllowNull(true)
  @Column({ field: 'label', type: DataType.TEXT })
  readonly label?: string;

  @AllowNull(false)
  @EnumColumn('type', StepInputFieldType)
  readonly type!: StepInputFieldType;

  @AllowNull(true)
  @Column({ field: 'settings', type: DataType.JSONB })
  readonly settings?: StepInputFieldSettings;

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

  @BelongsTo(() => StepPrototype)
  readonly stepPrototype!: StepPrototype;
}
