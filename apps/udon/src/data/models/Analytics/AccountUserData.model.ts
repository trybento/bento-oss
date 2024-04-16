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

import { AccountUser } from '../AccountUser.model';
import { CreatedAt, UpdatedAt, EntityId } from '../columns';
import { Organization } from '../Organization.model';
import { Step } from '../Step.model';

/**
 * Cached data for account user stats
 *
 * Updated by the recurring job updateAccountUserData
 */
@Table({ schema: 'analytics', tableName: 'account_user_data' })
export class AccountUserData extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(true)
  @Default(0)
  @Column({ field: 'steps_viewed', type: DataType.INTEGER })
  readonly stepsViewed!: number;

  @AllowNull(true)
  @Default(0)
  @Column({ field: 'steps_completed', type: DataType.INTEGER })
  readonly stepsCompleted!: number;

  @AllowNull(true)
  @ForeignKey(() => Step)
  @Column({ field: 'current_step_id', type: DataType.INTEGER })
  readonly currentStepId!: number;

  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId!: number;

  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(true)
  @Column({ field: 'step_last_seen', type: DataType.DATE })
  readonly stepLastSeen?: Date;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @AllowNull(true)
  @Column({ field: 'last_active_in_app', type: DataType.DATE })
  readonly lastActiveInApp?: Date;

  // Associations
  @BelongsTo(() => AccountUser)
  readonly accountUser?: AccountUser;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
