import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { EntityId, CreatedAt, UpdatedAt } from '../columns';

export type QueuedCleanupType = 'cleanup';

export type QueuedCleanupPayload =
  | { type: 'guideRollups'; guideIds: number[] }
  | { type: 'stepEvents'; stepEntityIds: string[] }
  | { type: 'guideEvents'; guideEntityIds: string[] }
  | { type: 'events-guide'; guideEntityIds: string[] }
  | { type: 'events-step'; stepEntityIds: string[] }
  | { type?: never };

@Table({ schema: 'core', tableName: 'queued_cleanups' })
export class QueuedCleanup extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ type: DataType.JSONB })
  readonly payload!: QueuedCleanupPayload;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
