import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

import { Account } from './Account.model';
import { AccountUser } from './AccountUser.model';
import { Organization } from './Organization.model';

@Table({ schema: 'core', tableName: 'account_audit_logs' })
export class AccountAuditLog extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ field: 'change_event', type: DataType.JSONB })
  readonly changeEvent!: object;

  @ForeignKey(() => Account)
  @AllowNull(false)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  readonly accountId!: number;

  @ForeignKey(() => AccountUser)
  @AllowNull(true)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => Account)
  readonly account!: Account;

  @BelongsTo(() => AccountUser)
  readonly accountUser!: AccountUser;
}
