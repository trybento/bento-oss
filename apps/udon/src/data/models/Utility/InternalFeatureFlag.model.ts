import { EnumColumn } from 'bento-common/utils/sequelize';
import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  Table,
} from 'sequelize-typescript';
import { EntityId, CreatedAt, UpdatedAt } from '../columns';

export enum InternalFeatureFlagStrategies {
  /** On for all, always */
  All = 'all',
  /** Activate by percentage chance */
  Percentage = 'percentage',
  /** Disable */
  None = 'none',
  /** Simple checks against an env variable */
  stringMatch = 'stringMatch',
  /** Match given string against a dict of percentage chance */
  rateDict = 'rateDict',
}

export type InternalFeatureFlagOptions = {
  percentage?: number;
  stringMatch?: { key: string; value: string | string[] };
  rateDict?: Record<string, number>;
};

@Table({ schema: 'core', tableName: 'internal_feature_flags' })
export class InternalFeatureFlag extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  readonly name?: string;

  @AllowNull(false)
  @Default(InternalFeatureFlagStrategies.All)
  @EnumColumn(InternalFeatureFlagStrategies)
  readonly strategy!: InternalFeatureFlagStrategies;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  readonly options?: InternalFeatureFlagOptions;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
