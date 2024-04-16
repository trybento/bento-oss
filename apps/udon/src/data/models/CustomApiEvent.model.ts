import { EnumColumn } from 'bento-common/utils/sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataSource } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

export enum CustomApiEventType {
  /** Custom events */
  Event = 'event',
  /** Properties of a custom event */
  EventProperty = 'event-property',
}

export type CustomApiEventProperties = {
  stepPrototypeId?: number;
};

export type EventDebugInformation = {
  payload: any;
  triggeredByAccountUserId?: number;
  autoCompletedStepIds?: number[];
};
@Table({ schema: 'core', tableName: 'custom_api_events' })
export class CustomApiEvent extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ field: 'name', type: DataType.TEXT })
  readonly name!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(false)
  @EnumColumn('type', CustomApiEventType)
  readonly type!: CustomApiEventType;

  @AllowNull(true)
  @Column({ field: 'last_seen', type: DataType.DATE })
  readonly lastSeen?: Date;

  @AllowNull(true)
  @Column({ field: 'debug_information', type: DataType.JSONB })
  readonly debugInformation?: EventDebugInformation;

  @EnumColumn('source', DataSource)
  readonly source?: DataSource;

  @Column({ field: 'properties', type: DataType.JSONB })
  readonly properties!: CustomApiEventProperties;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
