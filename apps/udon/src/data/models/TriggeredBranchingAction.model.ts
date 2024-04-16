import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { AccountUser } from './AccountUser.model';
import { Guide } from './Guide.model';
import { GuideModule } from './GuideModule.model';
import { GuideModuleBase } from './GuideModuleBase.model';
import { Organization } from './Organization.model';
import { Step } from './Step.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

/**
 * Legacy branching item.
 * Remaining because of historical references that may or may not need to be migrated.
 * Used in propagation order preserve methods
 *
 * @deprecated use `TriggeredBranchingPath` instead
 */
@Table({ schema: 'core', tableName: 'triggered_branching_actions' })
export class TriggeredBranchingAction extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Guide)
  @AllowNull(true)
  @Column({ field: 'created_guide_id', type: DataType.INTEGER })
  readonly createdGuideId?: number;

  @ForeignKey(() => GuideModule)
  @AllowNull(true)
  @Column({ field: 'created_guide_module_id', type: DataType.INTEGER })
  readonly createdGuideModuleId?: number;

  @ForeignKey(() => GuideModuleBase)
  @AllowNull(true)
  @Column({ field: 'created_guide_module_base_id', type: DataType.INTEGER })
  readonly createdGuideModuleBaseId?: number;

  @ForeignKey(() => AccountUser)
  @AllowNull(true)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId!: number;

  @ForeignKey(() => Guide)
  @AllowNull(true)
  @Column({ field: 'triggered_from_guide_id', type: DataType.INTEGER })
  readonly triggeredFromGuideId?: number;

  @ForeignKey(() => Step)
  @AllowNull(true)
  @Column({ field: 'triggered_from_step_id', type: DataType.INTEGER })
  readonly triggeredFromStepId?: number;

  @AllowNull(true)
  @Column({ field: 'triggered_from_slate_node_id', type: DataType.UUID })
  readonly triggeredFromSlateNodeId?: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS
  @BelongsTo(() => Guide)
  readonly createdGuide?: Guide;

  @BelongsTo(() => Guide)
  readonly triggeredFromGuide?: Guide;

  @BelongsTo(() => AccountUser)
  readonly accountUser?: AccountUser;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
