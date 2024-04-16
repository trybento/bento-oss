import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { EntityId, CreatedAt, UpdatedAt } from './columns';

import { FeatureFlag } from './FeatureFlag.model';
import { Organization } from './Organization.model';

@Table({ schema: 'core', tableName: 'feature_flag_enabled' })
export class FeatureFlagEnabled extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Unique
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => FeatureFlag)
  @AllowNull(false)
  @Unique
  @Column({ field: 'feature_flag_id', type: DataType.INTEGER })
  readonly featureFlagId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization?: Organization;

  @BelongsTo(() => FeatureFlag)
  readonly featureFlag?: FeatureFlag;
}
