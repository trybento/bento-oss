import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  Scopes,
  Comment,
} from 'sequelize-typescript';
import { DynamicAttributes } from 'bento-common/types';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

import { Guide } from './Guide.model';
import { GuideBase } from './GuideBase.model';
import { Organization } from './Organization.model';
import { User } from './User.model';
import { AccountUser } from './AccountUser.model';
import { Op } from 'sequelize';

@Scopes(() => ({
  notArchived: { where: { deletedAt: null } },
  notBlocked: { where: { blockedAt: null } },
  blocked: { where: { blockedAt: { [Op.not]: null } } },
  withAccountUsers: (externalIds?: string[]) => ({
    include: [
      {
        model: AccountUser,
        ...(externalIds ? { where: { entityId: externalIds } } : {}),
      },
    ],
  }),
}))
@Table({ schema: 'core', tableName: 'accounts' })
export class Account extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  readonly name!: string;

  @AllowNull(true)
  @Column({ field: 'external_id', type: DataType.TEXT })
  readonly externalId?: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'primary_organization_user_id', type: DataType.INTEGER })
  readonly primaryOrganizationUserId?: number;

  @AllowNull(true)
  @Column({ field: 'created_in_organization_at', type: DataType.DATE })
  readonly createdInOrganizationAt?: Date;

  @Column({ field: 'attributes', type: DataType.JSONB })
  readonly attributes!: DynamicAttributes;

  @Comment('Indicates whether the template is currently being reset')
  @AllowNull(true)
  @Column({
    field: 'is_resetting',
    type: DataType.BOOLEAN,
  })
  readonly isResetting?: boolean;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  /**
   * NOTE: to reduce database load, this field will only be updated once
   * in a 30-minute window. It is therefore not a 100% accurate indication
   * of activity!
   */
  @AllowNull(true)
  @Column({
    field: 'last_active_at',
    type: DataType.DATE,
    comment: 'Last time a user was active in this account',
  })
  readonly lastActiveAt?: Date;

  @AllowNull(true)
  @Column({ field: 'deleted_at', type: DataType.DATE })
  readonly deletedAt?: Date;

  @AllowNull(true)
  @Column({ field: 'blocked_at', type: DataType.DATE })
  readonly blockedAt?: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => User)
  readonly primaryOrganizationUser?: User;

  @HasMany(() => Guide)
  readonly guides!: Guide[];

  @HasMany(() => GuideBase)
  readonly guideBases!: GuideBase[];

  @HasMany(() => AccountUser)
  readonly accountUsers!: AccountUser[];
}
