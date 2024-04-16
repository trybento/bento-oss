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

import { StepPrototype } from './StepPrototype.model';
import { Module } from './Module.model';
import { Organization } from './Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { TemplateModule } from './TemplateModule.model';

@Scopes(() => ({
  withStepPrototype: { include: [StepPrototype] },
  byOrderIndex: { order: [['orderIndex', 'ASC']] },
}))
@Table({ schema: 'core', tableName: 'modules_step_prototypes' })
export class ModuleStepPrototype extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ field: 'order_index', type: DataType.INTEGER })
  readonly orderIndex!: number;

  @ForeignKey(() => Module)
  @AllowNull(false)
  @Column({ field: 'module_id', type: DataType.INTEGER })
  readonly moduleId?: number;

  @ForeignKey(() => StepPrototype)
  @AllowNull(false)
  @Column({ field: 'step_prototype_id', type: DataType.INTEGER })
  readonly stepPrototypeId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS

  @BelongsTo(() => Module)
  readonly createdFromModule?: Module;

  @HasMany(() => TemplateModule, {
    sourceKey: 'moduleId',
    foreignKey: 'moduleId',
  })
  readonly templateModules?: TemplateModule[];

  @BelongsTo(() => StepPrototype)
  readonly stepPrototype!: StepPrototype;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
