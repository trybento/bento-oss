import { Includeable } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { AccountUserProperties, DynamicAttributes } from 'bento-common/types';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

import { Account } from './Account.model';
import { Organization } from './Organization.model';
import { GuideParticipant } from './GuideParticipant.model';

export enum AccountUserModelScope {
  withAccount = 'withAccount',
}

export type AccountUserWithAccount<AU = AccountUser, A = Account> = AU & {
  account: A;
};

@Scopes(() => ({
  /**
   * Returns the account associated with the account user.
   * for use with {@link AccountUserWithAccount}
   */
  [AccountUserModelScope.withAccount]: (
    includeOptions: Exclude<Includeable, string> = {}
  ) => ({
    include: [
      {
        model: Account,
        required: true,
        ...includeOptions,
      },
    ],
  }),
}))
@Table({ schema: 'core', tableName: 'account_users' })
export class AccountUser extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ field: 'external_id', type: DataType.TEXT })
  readonly externalId!: string;

  @Column({ field: 'email', type: DataType.TEXT })
  readonly email?: string;

  @Column({ field: 'full_name', type: DataType.TEXT })
  readonly fullName?: string;

  @ForeignKey(() => Account)
  @AllowNull(false)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  readonly accountId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(true)
  @Column({ field: 'created_in_organization_at', type: DataType.DATE })
  readonly createdInOrganizationAt?: Date;

  @Column({ field: 'attributes', type: DataType.JSONB })
  readonly attributes!: DynamicAttributes;

  @AllowNull(false)
  @Column({ field: 'internal', type: DataType.BOOLEAN, defaultValue: false })
  readonly internal!: boolean;

  @AllowNull(false)
  @Default({ onboardedSidebar: false })
  @Column({
    field: 'properties',
    type: DataType.JSONB,
    comment:
      'Additional user-based properties that will determine in-app behavior',
  })
  readonly properties!: AccountUserProperties;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => Account)
  readonly account!: Account;

  @HasMany(() => GuideParticipant)
  readonly guideParticipants!: GuideParticipant[];
}
