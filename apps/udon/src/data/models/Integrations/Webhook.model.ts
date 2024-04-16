import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';

import { EntityId, CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';
import { EventHookType, WebhookType } from 'bento-common/types';
import { User } from '../User.model';

export enum WebhookState {
  Active = 'active',
  Inactive = 'inactive',
}

@Table({ schema: 'core', tableName: 'webhooks' })
export class Webhook extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @EnumColumn('event_type', EventHookType)
  readonly eventType!: EventHookType;

  @Column({ type: DataType.TEXT, field: 'secret_key' })
  readonly secretKey!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT, field: 'webhook_url' })
  readonly webhookUrl!: string;

  @Column({ type: DataType.TEXT, field: 'last_error' })
  readonly lastError!: string;

  @AllowNull(false)
  @Default(WebhookState.Active)
  @EnumColumn('state', WebhookState)
  readonly state!: WebhookState;

  @AllowNull(false)
  @Default(WebhookType.standard)
  @EnumColumn('webhook_type', WebhookType)
  readonly webhookType!: WebhookType;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'created_by_user_id', type: DataType.INTEGER })
  readonly createdByUserId!: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'updated_by_user_id', type: DataType.INTEGER })
  readonly updatedByUserId!: number;

  // ASSOCIATIONS
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => User)
  readonly createdByUser!: User;

  @BelongsTo(() => User)
  readonly updatedByUser!: User;
}
