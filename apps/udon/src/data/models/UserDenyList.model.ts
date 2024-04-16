import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { EntityId, CreatedAt, UpdatedAt } from './columns';

@Table({ schema: 'core', tableName: 'user_deny_list' })
export class UserDenyList extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  readonly text!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
