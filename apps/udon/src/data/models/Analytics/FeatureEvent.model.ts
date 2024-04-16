import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

import { Events, InternalTrackEvents } from 'bento-common/types';

import { AccountUser } from '../AccountUser.model';
import { CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';
import { User } from '../User.model';

@Table({
  schema: 'analytics',
  tableName: 'feature_events',
  comment:
    'Events pertaining to feature usage which we want to track for BI or validation',
})
export class FeatureEvent extends Model<
  InferAttributes<FeatureEvent>,
  InferCreationAttributes<FeatureEvent, { omit: 'createdAt' | 'updatedAt' }>
> {
  readonly id!: CreationOptional<number>;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: InternalTrackEvents | Events;

  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_entity_id', type: DataType.UUIDV4 })
  readonly accountUserEntityId!: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column({ field: 'user_entity_id', type: DataType.UUIDV4 })
  readonly userEntityId?: CreationOptional<string>;

  @ForeignKey(() => Organization)
  @Column({ field: 'organization_entity_id', type: DataType.UUIDV4 })
  readonly organizationEntityId!: string;

  @Column({ field: 'data', type: DataType.JSONB })
  readonly data?: object;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => AccountUser)
  readonly accountUser?: NonAttribute<AccountUser>;

  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;
}
