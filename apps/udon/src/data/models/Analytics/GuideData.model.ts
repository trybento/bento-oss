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

import { CreatedAt, UpdatedAt, EntityId } from '../columns';
import { GuideBase } from '../GuideBase.model';
import { Organization } from '../Organization.model';

/**
 * Cached data for guide base performance
 *
 * Updated by the hourly job updateGuideData
 */
@Table({ schema: 'analytics', tableName: 'guide_data' })
export class GuideData extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(true)
  @ForeignKey(() => GuideBase)
  @Column({ field: 'guide_base_id', type: DataType.INTEGER })
  readonly guideBaseId!: number;

  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  /** Number of click events as opposed to users clicked. To deprecate */
  @AllowNull(true)
  @Default(0)
  @Column({ field: 'ctas_clicked', type: DataType.INTEGER })
  readonly ctasClicked?: number;

  @AllowNull(true)
  @Default(0)
  @Column({ field: 'users_completed_a_step', type: DataType.INTEGER })
  readonly usersCompletedAStep?: number;

  /** Raw view count without the "mix in" of including completes/skips */
  @AllowNull(true)
  @Default(0)
  @Column({ field: 'participants_who_viewed', type: DataType.INTEGER })
  readonly participantsWhoViewed?: number;

  /** Doctored number that includes step interactions without actual seen */
  @AllowNull(true)
  @Default(0)
  @Column({ field: 'users_viewed_a_step', type: DataType.INTEGER })
  readonly usersViewedAStep?: number;

  @AllowNull(true)
  @Default(0)
  @Column({ field: 'users_skipped_a_step', type: DataType.INTEGER })
  readonly usersSkippedAStep?: number;

  /** Includes branching steps */
  @AllowNull(true)
  @Default(0)
  @Column({ field: 'completed_steps', type: DataType.INTEGER })
  readonly stepsCompleted?: number;

  @AllowNull(true)
  @Default(0)
  @Column({ field: 'saved_for_later', type: DataType.INTEGER })
  readonly savedForLater?: number;

  @AllowNull(true)
  @Column({ field: 'avg_steps_viewed', type: DataType.INTEGER })
  readonly avgStepsViewed?: number;

  /** Does not include branching */
  @AllowNull(true)
  @Column({ field: 'avg_steps_completed', type: DataType.INTEGER })
  readonly avgStepsCompleted?: number;

  @AllowNull(true)
  @Column({ field: 'avg_progress', type: DataType.INTEGER })
  readonly avgProgress?: number;

  /** The number of guides that have logged a view */
  @AllowNull(true)
  @Column({ field: 'guides_viewed', type: DataType.INTEGER })
  readonly guidesViewed?: number;

  @AllowNull(true)
  @Column({ field: 'users_clicked_cta', type: DataType.INTEGER })
  readonly usersClickedCta?: number;

  @AllowNull(true)
  @Column({ field: 'users_answered', type: DataType.INTEGER })
  readonly usersAnswered?: number;

  @AllowNull(true)
  @Column({ field: 'guides_completed', type: DataType.INTEGER })
  readonly guidesCompleted?: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => GuideBase)
  readonly guideBase?: GuideBase;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
