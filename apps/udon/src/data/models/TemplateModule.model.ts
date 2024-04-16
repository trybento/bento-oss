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

import { Template } from './Template.model';
import { Module } from './Module.model';
import { Organization } from './Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { ModuleStepPrototype } from './ModuleStepPrototype.model';

@Scopes(() => ({
  byOrderIndex: { order: [['orderIndex', 'ASC']] },
  withModule: (includeStepPrototypes: boolean) => ({
    subQuery: false,
    include: [
      {
        model: includeStepPrototypes
          ? Module.scope('withModuleStepPrototypes')
          : Module,
        as: 'module',
      },
    ],
  }),
}))
@Table({
  schema: 'core',
  tableName: 'templates_modules',
  indexes: [
    {
      name: 'core_tenplate_modules_template_id_module_id_key',
      unique: true,
      fields: ['template_id', 'module_id'],
    },
  ],
})
export class TemplateModule extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ field: 'order_index', type: DataType.INTEGER })
  readonly orderIndex!: number;

  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @ForeignKey(() => Module)
  @AllowNull(false)
  @Column({ field: 'module_id', type: DataType.INTEGER })
  readonly moduleId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS

  @BelongsTo(() => Template)
  readonly template!: Template;

  @BelongsTo(() => Module)
  readonly module!: Module;

  @HasMany(() => ModuleStepPrototype, {
    sourceKey: 'moduleId',
    foreignKey: 'moduleId',
  })
  readonly moduleStepPrototypes?: ModuleStepPrototype[];

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
