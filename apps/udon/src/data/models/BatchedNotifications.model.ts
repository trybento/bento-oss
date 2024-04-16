import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Organization } from './Organization.model';

export enum BatchedNotificationType {
  /** Step notifications */
  Steps = 'steps',
  /** Broken video alerts */
  VideoAlert = 'video-alert',
}

@Table({ schema: 'core', tableName: 'batched_notifications' })
export class BatchedNotification<T> extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(false)
  @EnumColumn('notification_type', BatchedNotificationType)
  readonly notificationType?: BatchedNotificationType;

  @AllowNull(true)
  @Column({ field: 'recipient_email', type: DataType.TEXT })
  readonly recipientEmail?: string;

  @AllowNull(true)
  @Column({ field: 'recipient_entity_id', type: DataType.TEXT })
  readonly recipientEntityId?: string;

  @Column({ field: 'body_data', type: DataType.JSONB })
  readonly bodyData?: T;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
