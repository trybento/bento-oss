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

import { EntityId, CreatedAt, UpdatedAt } from '../columns';

import { AccountUser } from '../AccountUser.model';
import { Guide } from '../Guide.model';
import { Organization } from '../Organization.model';
import { Step } from '../Step.model';

@Table({ schema: 'analytics', tableName: 'events' })
export class Event extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: Events | InternalTrackEvents;

  @Column({ field: 'data', type: DataType.JSONB })
  readonly data!: object;

  @ForeignKey(() => AccountUser)
  @AllowNull(true)
  @Column({ field: 'account_user_entity_id', type: DataType.UUIDV4 })
  readonly accountUserEntityId!: string;

  @ForeignKey(() => Step)
  @AllowNull(true)
  @Column({ field: 'step_entity_id', type: DataType.UUIDV4 })
  readonly stepEntityId?: string;

  @ForeignKey(() => Guide)
  @AllowNull(true)
  @Column({ field: 'guide_entity_id', type: DataType.UUIDV4 })
  readonly guideEntityId?: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_entity_id', type: DataType.UUIDV4 })
  readonly organizationEntityId!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => AccountUser)
  readonly accountUser?: AccountUser;

  @BelongsTo(() => Guide)
  readonly guide?: Guide;

  @BelongsTo(() => Step)
  readonly step?: Step;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
