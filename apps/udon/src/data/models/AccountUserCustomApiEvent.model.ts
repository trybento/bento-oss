import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { AccountUser } from './AccountUser.model';

@Table({ schema: 'core', tableName: 'account_user_custom_api_events' })
export class AccountUserCustomApiEvent extends Model<
  InferAttributes<AccountUserCustomApiEvent>,
  InferCreationAttributes<AccountUserCustomApiEvent>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_entity_id', type: DataType.UUIDV4 })
  readonly accountUserEntityId!: string;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: string;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  // Associations
  @BelongsTo(() => AccountUser, { targetKey: 'entityId' })
  readonly accountUser!: CreationOptional<AccountUser>;
}
