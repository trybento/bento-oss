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

import { User } from './User.model';
import { Organization } from './Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

@Table({ schema: 'core', tableName: 'users_organizations' })
export class UserOrganization extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  readonly userId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(false)
  @Default(false)
  @Column({ field: 'is_default', type: DataType.BOOLEAN })
  readonly isDefault!: boolean;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS
  @BelongsTo(() => User)
  readonly user!: User;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
