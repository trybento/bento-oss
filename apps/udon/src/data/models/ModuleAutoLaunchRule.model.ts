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
import { Template } from './Template.model';
import { Organization } from './Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Module } from './Module.model';
import { AttributeRule } from 'src/interactions/targeting/types';

enum LaunchState {
  active = 'active',
  inactive = 'inactive',
}

@Table({ schema: 'core', tableName: 'module_auto_launch_rules' })
export class ModuleAutoLaunchRule extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Module)
  @AllowNull(false)
  @Column({ field: 'module_id', type: DataType.INTEGER })
  readonly moduleId!: number;

  @Column({ field: 'rules', type: DataType.JSONB })
  readonly rules!: AttributeRule[];

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'target_template_id', type: DataType.INTEGER })
  readonly targetTemplateId!: number;

  @AllowNull(false)
  @Default(LaunchState.active)
  @EnumColumn('state', LaunchState)
  readonly state!: LaunchState;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS
  @BelongsTo(() => Module)
  readonly module!: Module;

  @BelongsTo(() => Template)
  readonly targetTemplate!: Template;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
