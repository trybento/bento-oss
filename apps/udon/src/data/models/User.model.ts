import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { EntityId, CreatedAt, UpdatedAt, DeletedAt } from './columns';
import { UserStatus } from './types';
import { Organization } from './Organization.model';

@Scopes(() => ({
  active: { where: { status: UserStatus.active } },
}))
@Table({ schema: 'core', tableName: 'users', paranoid: true })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(false)
  @Default(UserStatus.active)
  @EnumColumn(UserStatus)
  readonly status!: CreationOptional<UserStatus>;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  readonly email!: string;

  @Column({ field: 'full_name', type: DataType.TEXT })
  readonly fullName?: CreationOptional<string>;

  /**
   * @deprecated no one except Emily seem to be using this, can be removed
   */
  @Column({ field: 'avatar_file_name', type: DataType.TEXT })
  readonly avatarFileName?: CreationOptional<string>;

  @AllowNull(true)
  @Column({ field: 'phone_number', type: DataType.TEXT })
  readonly phoneNumber?: CreationOptional<string>;

  @AllowNull(false)
  @Default(false)
  @Column({ field: 'is_superadmin', type: DataType.BOOLEAN })
  readonly isSuperadmin!: CreationOptional<boolean>;

  @AllowNull(true)
  @Column({ field: 'sessions_valid_from', type: DataType.DATE })
  readonly sessionsValidFrom?: Date | null;

  /** Extra random data we need to save about the user */
  @Column({ field: 'extra', type: DataType.JSONB })
  readonly extra!: CreationOptional<Record<string, any>>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: CreationOptional<Date | null>;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: CreationOptional<Organization>;
}
