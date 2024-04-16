import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { Organization } from 'src/data/models/Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

export enum CustomAttributeValueIdentifierType {
  account = 'account',
  accountUser = 'account_user',
}

@Table({ schema: 'core', tableName: 'custom_attribute_values' })
export class CustomAttributeValue extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @Column({
    field: 'identifier_type',
    type: DataType.ENUM('account', 'account_user'),
  })
  /** @deprecated Unused. We rely on the custom attribute's type instead */
  readonly identifierType!: CustomAttributeValueIdentifierType;

  @ForeignKey(() => Account)
  @AllowNull(true)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  /** @deprecated Unused. Not sure of original intention */
  readonly accountId!: number;

  @ForeignKey(() => AccountUser)
  @AllowNull(true)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  /** @deprecated Unused. Not sure of original intention */
  readonly accountUserId?: number;

  @Column({ field: 'number_value', type: DataType.BIGINT })
  readonly numberValue?: number;

  @Column({ field: 'text_value', type: DataType.TEXT })
  readonly textValue?: string;

  @Column({ field: 'boolean_value', type: DataType.BOOLEAN })
  readonly booleanValue?: boolean;

  @Column({ field: 'date_value', type: DataType.DATE })
  readonly dateValue?: Date;

  @ForeignKey(() => CustomAttribute)
  @AllowNull(false)
  @Column({ field: 'custom_attribute_id', type: DataType.BIGINT })
  readonly customAttributeId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Account)
  readonly account!: Account;

  @BelongsTo(() => AccountUser)
  readonly accountUser?: AccountUser;

  @BelongsTo(() => CustomAttribute)
  readonly customAttribute!: CustomAttribute;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
