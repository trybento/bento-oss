import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { AccountUser } from '../AccountUser.model';
import { CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';

@Table({ schema: 'analytics', tableName: 'account_user_events' })
export class AccountUserEvent extends Model {
  readonly id!: number;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: string;

  @Column({ field: 'location', type: DataType.TEXT })
  readonly location!: string;

  @Column({ field: 'data', type: DataType.JSONB })
  readonly data!: object;

  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_entity_id', type: DataType.UUIDV4 })
  readonly accountUserEntityId!: string;

  @ForeignKey(() => Organization)
  @Column({ field: 'organization_entity_id', type: DataType.UUIDV4 })
  readonly organizationEntityId!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => AccountUser)
  readonly accountUser?: AccountUser;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
