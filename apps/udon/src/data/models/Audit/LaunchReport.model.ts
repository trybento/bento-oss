import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { LaunchReportPayload } from 'bento-common/types/diagnostics';

import { Account } from '../Account.model';
import { AccountUser } from '../AccountUser.model';
import { EntityId, CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';
import { Template } from '../Template.model';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

/** Record of an Autolaunched guide deletion used to prevent re-autolaunching */
@Table({ schema: 'debug', tableName: 'launch_reports' })
export class LaunchReportLog extends Model<
  InferAttributes<LaunchReportLog>,
  InferCreationAttributes<LaunchReportLog>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  @ForeignKey(() => Account)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  readonly accountId?: CreationOptional<number>;

  @ForeignKey(() => Template)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId?: CreationOptional<number>;

  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId?: CreationOptional<number>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @Column({ field: 'report', type: DataType.JSONB })
  readonly report!: LaunchReportPayload;

  // Associations
  @BelongsTo(() => Account)
  readonly account?: CreationOptional<Account>;

  @BelongsTo(() => Template)
  readonly template?: CreationOptional<Template>;

  @BelongsTo(() => AccountUser)
  readonly accountUser?: CreationOptional<AccountUser>;

  @BelongsTo(() => Organization)
  readonly organization!: CreationOptional<Organization>;
}
