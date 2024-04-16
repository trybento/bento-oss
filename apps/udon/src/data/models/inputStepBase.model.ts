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
import { Organization } from 'src/data/models/Organization.model';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';

@Table({ schema: 'core', tableName: 'input_step_bases' })
export class InputStepBase extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => GuideStepBase)
  @AllowNull(false)
  @Column({ field: 'guide_step_base_id', type: DataType.INTEGER })
  readonly guideStepBaseId!: number;

  @ForeignKey(() => InputStepPrototype)
  @AllowNull(true)
  @Column({
    field: 'created_from_input_step_prototype_id',
    type: DataType.INTEGER,
  })
  readonly createdFromInputStepPrototypeId?: number;

  @AllowNull(true)
  @Column({ field: 'label', type: DataType.TEXT })
  readonly label!: string;

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

  @BelongsTo(() => GuideStepBase)
  readonly guideStepBase!: GuideStepBase;

  @BelongsTo(() => InputStepPrototype)
  readonly createdFromInputStepPrototype?: InputStepPrototype;
}
