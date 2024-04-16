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
import { CreatedAt, UpdatedAt, EntityId } from '../columns';

import { Organization } from '../Organization.model';
import { AttributeType } from 'bento-common/types';

export enum DataUsageType {
  attribute = 'attribute',
  event = 'event',
}

type IdList = number[];

/**
 * Cached data for announcement performance by day by template
 *
 * Updated by the daily job runDataUsageCache
 */
@Table({ schema: 'analytics', tableName: 'data_usage' })
export class DataUsage extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @Column({ field: 'name', type: DataType.TEXT })
  readonly name!: string;

  @EnumColumn('type', DataUsageType)
  readonly type!: DataUsageType;

  @EnumColumn('scope', AttributeType)
  readonly scope!: AttributeType;

  /** Ids of step prototypes */
  @Column({ field: 'autocompletes', type: DataType.JSONB })
  readonly autocompletes!: IdList;

  /** Ids of guide bases */
  @Column({ field: 'autolaunches', type: DataType.JSONB })
  readonly autolaunches!: IdList;

  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
