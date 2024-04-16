import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ValueDataAggregatePayload } from 'src/interactions/reporting/generateValueDataAggregate';

import { CreatedAt, UpdatedAt } from '../columns';

@Table({ schema: 'analytics', tableName: 'value_data_aggregate' })
export class ValueDataAggregate extends Model {
  readonly id!: number;

  @Column({ field: 'data', type: DataType.JSONB })
  readonly data!: ValueDataAggregatePayload;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
