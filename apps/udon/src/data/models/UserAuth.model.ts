import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { AuthType } from './types';
import { User } from './User.model';

@Table({ schema: 'core', tableName: 'user_auths' })
export default class UserAuth extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @AllowNull(false)
  @EnumColumn(AuthType)
  readonly type!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  readonly userId!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  readonly key!: string;

  // Associations
  @BelongsTo(() => User)
  readonly user!: User;
}
