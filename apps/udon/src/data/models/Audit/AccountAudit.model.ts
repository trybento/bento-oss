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
import { EntityId, CreatedAt, UpdatedAt } from '../columns';
import { User } from '../User.model';
import { Organization } from '../Organization.model';
import { AuditData } from './common';
import { AuditEvent } from 'src/utils/auditContext';
import { Account } from '../Account.model';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({ schema: 'audit', tableName: 'account_audit' })
export class AccountAudit extends Model<
  InferAttributes<AccountAudit>,
  InferCreationAttributes<AccountAudit>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: AuditEvent;

  @ForeignKey(() => Account)
  @AllowNull(false)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  readonly accountId!: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  readonly userId?: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @Column({ field: 'data', type: DataType.JSONB })
  readonly data?: AuditData;

  @AllowNull(false)
  @Column({ field: 'context_id', type: DataType.TEXT })
  readonly contextId!: string;

  @AllowNull(true)
  @Default(false)
  @Column({ field: 'is_system', type: DataType.BOOLEAN })
  readonly isSystem?: boolean;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: CreationOptional<Organization>;

  @BelongsTo(() => Account)
  readonly account!: CreationOptional<Account>;

  @BelongsTo(() => User)
  readonly user!: CreationOptional<User>;
}
