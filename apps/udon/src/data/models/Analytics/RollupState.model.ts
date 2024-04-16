import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  Table,
} from 'sequelize-typescript';
import { RollupTypeEnum } from 'src/jobsBull/jobs/rollupTasks/rollup.constants';

import { CreatedAt, UpdatedAt } from '../columns';

@Table({ schema: 'analytics', tableName: 'rollup_states' })
export class RollupState extends Model {
  readonly id!: number;

  @AllowNull(false)
  @Column({ field: 'rollup_name', type: DataType.TEXT, unique: true })
  readonly rollupName!: RollupTypeEnum;

  @AllowNull(false)
  @Column({ field: 'last_run', type: DataType.DATE })
  readonly lastRun!: Date;

  @AllowNull(false)
  @Default(true)
  @Column({ field: 'enabled', type: DataType.BOOLEAN })
  readonly enabled!: boolean;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
