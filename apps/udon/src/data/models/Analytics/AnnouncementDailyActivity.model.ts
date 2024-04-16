import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  DefaultScope,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { Organization } from '../Organization.model';
import { Template } from '../Template.model';

/** Dict by GuideBaseStepCta eId */
export type CtaUsageData = Record<string, { text: string; count: number }>;

/**
 * Cached data for announcement performance by day by template
 *
 * Updated by the hourly job updateAnnouncementData
 */
@DefaultScope(() => ({
  attributes: {
    exclude: ['id'],
  },
}))
@Table({
  schema: 'analytics',
  tableName: 'announcement_daily_activity',
  timestamps: false,
})
export class AnnouncementDailyActivity extends Model {
  @Column({ type: DataType.DATE })
  readonly date!: Date;

  @AllowNull(false)
  @ForeignKey(() => Template)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @AllowNull(false)
  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @Column({ field: 'cta_activity', type: DataType.JSONB })
  readonly ctaActivity!: CtaUsageData;

  @AllowNull(false)
  @Default(0)
  @Column({ field: 'saved_for_later', type: DataType.INTEGER })
  readonly savedForLater!: number;

  @AllowNull(false)
  @Default(0)
  @Column({ field: 'dismissed', type: DataType.INTEGER })
  readonly dismissed!: number;

  @AllowNull(false)
  @Default(0)
  @Column({ field: 'viewed', type: DataType.INTEGER })
  readonly viewed!: number;

  // Associations
  @BelongsTo(() => Template)
  readonly template?: Template;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
