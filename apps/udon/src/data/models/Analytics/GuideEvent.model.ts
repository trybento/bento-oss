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
import { User } from '../User.model';
import { Guide } from '../Guide.model';

@Table({ schema: 'analytics', tableName: 'guide_events' })
export class GuideEvent extends Model {
  readonly id!: number;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: InternalTrackEvents | Events;

  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_entity_id', type: DataType.UUIDV4 })
  readonly accountUserEntityId!: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_entity_id', type: DataType.UUIDV4 })
  readonly userEntityId?: string;

  @ForeignKey(() => Guide)
  @Column({ field: 'guide_entity_id', type: DataType.UUIDV4 })
  readonly guideEntityId?: string;

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

  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => Guide)
  readonly guide!: Guide;
}
