import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { EntityId, CreatedAt, UpdatedAt } from '../columns';

/** Dump for one-off reports */
@Table({ schema: 'debug', tableName: 'report_dumps' })
export class ReportDump extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  readonly title!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  readonly content!: string;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  readonly json?: object;
}
