import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { AccountUser } from '../AccountUser.model';
import { Organization } from '../Organization.model';

@Table({
  schema: 'analytics',
  tableName: 'account_user_daily_log',
  timestamps: false,
})
export class AccountUserDailyLog extends Model {
  readonly id!: number;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId!: number;

  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @Column({ type: DataType.DATE })
  readonly date!: Date;

  // Associations
  @BelongsTo(() => AccountUser)
  readonly accountUser?: AccountUser;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
