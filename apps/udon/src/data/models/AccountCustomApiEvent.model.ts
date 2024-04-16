import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Account } from './Account.model';

@Table({ schema: 'core', tableName: 'account_custom_api_events' })
export class AccountCustomApiEvent extends Model<
  InferAttributes<AccountCustomApiEvent>,
  InferCreationAttributes<AccountCustomApiEvent>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  declare entityId: CreationOptional<string>;

  @AllowNull(false)
  @ForeignKey(() => Account)
  @Column({ field: 'account_entity_id', type: DataType.UUIDV4 })
  readonly accountEntityId!: string;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: string;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  // Associations
  @BelongsTo(() => Account, { targetKey: 'entityId' })
  readonly account!: CreationOptional<Account>;
}
