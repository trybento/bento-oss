import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { GuideModule } from './GuideModule.model';
import { GuideModuleBase } from './GuideModuleBase.model';
import { Organization } from './Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { ModuleAutoLaunchRule } from './ModuleAutoLaunchRule.model';

/** Record of a called branching path */
@Table({ schema: 'core', tableName: 'triggered_dynamic_modules' })
export class TriggeredDynamicModule extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => ModuleAutoLaunchRule)
  @AllowNull(true)
  @Column({ field: 'module_auto_launch_rule', type: DataType.INTEGER })
  readonly moduleAutoLaunchRuleId?: number;

  @ForeignKey(() => GuideModule)
  @AllowNull(true)
  @Column({ field: 'created_guide_module_id', type: DataType.INTEGER })
  readonly createdGuideModuleId?: number;

  @ForeignKey(() => GuideModuleBase)
  @AllowNull(true)
  @Column({ field: 'created_guide_module_base_id', type: DataType.INTEGER })
  readonly createdGuideModuleBaseId?: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS
  @BelongsTo(() => GuideModuleBase, {
    foreignKey: 'createdGuideModuleBaseId',
  })
  readonly createdGuideModuleBase!: GuideModuleBase;

  @BelongsTo(() => GuideModule, { foreignKey: 'createdGuideModuleId' })
  readonly createdGuideModule?: GuideModule;

  @BelongsTo(() => ModuleAutoLaunchRule)
  readonly moduleAutoLaunchRule?: ModuleAutoLaunchRule;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
