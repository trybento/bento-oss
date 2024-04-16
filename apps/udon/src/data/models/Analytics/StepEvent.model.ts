import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Events, InternalTrackEvents } from 'bento-common/types';

import { AccountUser } from '../AccountUser.model';
import { CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';
import { Step } from '../Step.model';
import { User } from '../User.model';

@Table({ schema: 'analytics', tableName: 'step_events' })
export class StepEvent extends Model {
  readonly id!: number;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: InternalTrackEvents | Events;

  @Column({ field: 'location', type: DataType.TEXT })
  readonly location!: string;

  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_entity_id', type: DataType.UUIDV4 })
  readonly accountUserEntityId!: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_entity_id', type: DataType.UUIDV4 })
  readonly userEntityId?: string;

  @ForeignKey(() => Step)
  @AllowNull(false)
  @Column({ field: 'step_entity_id', type: DataType.UUIDV4 })
  readonly stepEntityId?: string;

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
  readonly accountUser?: AccountUser;

  @BelongsTo(() => Step)
  readonly step?: Step;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
