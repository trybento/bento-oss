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
import { BentoApiKeyType } from 'bento-common/types/integrations';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Organization } from './Organization.model';

/**
 * @todo: Rename to be more generic
 *
 * Integration keys we generate so other services can communicate with us
 */

@Table({ schema: 'core', tableName: 'segment_api_keys' })
export class SegmentApiKey extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.TEXT })
  readonly key!: string;

  @Default(true)
  @Column({ field: 'are_track_events_enabled', type: DataType.BOOLEAN })
  readonly areTrackEventsEnabled!: boolean;

  @Default(true)
  @Column({ field: 'are_group_events_enabled', type: DataType.BOOLEAN })
  readonly areGroupEventsEnabled!: boolean;

  @Default(true)
  @Column({ field: 'are_identify_events_enabled', type: DataType.BOOLEAN })
  readonly areIdentifyEventsEnabled!: boolean;

  @AllowNull(true)
  @Column({ field: 'integrated_at', type: DataType.DATE })
  readonly integratedAt?: Date;

  @AllowNull(true)
  @Column({ field: 'last_error_at', type: DataType.DATE })
  readonly lastErrorAt?: Date;

  @AllowNull(false)
  @EnumColumn('type', BentoApiKeyType)
  readonly type!: BentoApiKeyType;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS
  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}

export { BentoApiKeyType } from 'bento-common/types/integrations';
