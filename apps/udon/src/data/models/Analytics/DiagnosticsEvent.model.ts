import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { DiagnosticEventNames } from 'bento-common/types';

import { CreatedAt, EntityId, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';

@Table({ schema: 'analytics', tableName: 'diagnostics_events' })
export default class DiagnosticsEvent extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @EnumColumn('event', DiagnosticEventNames)
  readonly event!: DiagnosticEventNames;

  @AllowNull(true)
  @Column({ field: 'payload', type: DataType.JSONB })
  readonly payload?: object;

  @AllowNull(false)
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
