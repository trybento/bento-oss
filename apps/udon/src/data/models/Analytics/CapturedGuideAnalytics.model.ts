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

/** @todo relate it to GuideData type somehow */
export type TemplateGuideAnalytics = {
  completedAStep: number;
  usersSeenGuide: number;
  percentCompleted: number;
  inputStepAnswersCount: number;
  guidesViewed: number;
  usersAnswered: number;

  /* Announcement and inline contextual only */
  usersDismissed: number;
  usersClickedCta: number;
  ctaClickCount: number /* @todo deprecate */;
  usersSavedForLater: number;

  /* Account guide */
  guidesWithCompletedStep: number;
  percentGuidesCompleted: number;
  averageStepsCompleted: number;
  averageStepsCompletedForEngaged: number;
  accountsSeen?: number | null;
};

/**
 * Used for "locking" stats to keep a record of the numbers at a certain time
 */
@Table({ schema: 'analytics', tableName: 'captured_guide_analytics' })
export class CapturedGuideAnalytics extends Model {
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
