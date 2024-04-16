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
import { Organization } from './Organization.model';
import { Step } from './Step.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

@Table({ schema: 'core', tableName: 'step_participants' })
export class StepParticipant extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Step)
  @AllowNull(false)
  @Column({ field: 'step_id', type: DataType.INTEGER })
  readonly stepId!: number;

  @ForeignKey(() => AccountUser)
  @AllowNull(false)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(true)
  @Column({ field: 'view_count', type: DataType.INTEGER })
  readonly viewCount!: number;

  @AllowNull(true)
  @Column({ field: 'first_viewed_at', type: DataType.DATE })
  readonly firstViewedAt?: Date;

  @AllowNull(true)
  @Column({ field: 'skipped_at', type: DataType.DATE })
  readonly skippedAt?: Date;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS
  @BelongsTo(() => Step)
  readonly step!: Step;

  @BelongsTo(() => AccountUser)
  readonly accountUser!: AccountUser;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
