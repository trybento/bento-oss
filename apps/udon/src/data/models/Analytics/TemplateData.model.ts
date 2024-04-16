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

import { CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';
import { Template } from '../Template.model';
import { TemplateGuideAnalytics } from './CapturedGuideAnalytics.model';

/**
 * Used for "locking" stats to keep a record of the numbers at a certain time
 */
@Table({ schema: 'analytics', tableName: 'template_data' })
export class TemplateData extends Model {
  readonly id!: number;

  @Default({})
  @Column({ field: 'stats', type: DataType.JSONB })
  readonly stats!: TemplateGuideAnalytics;

  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

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
