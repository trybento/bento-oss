import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';

/* Organized by how the email would be */
export type ValueDataPayload = {
  /* Block 1: Raw counts */
  guidesLaunched?: number;
  stepsCompleted?: number;
  uniqueUsersLaunchedTo?: number;
  useCases?: number;
  /* Block 2: Announcements/EmptyStates */
  announcementsLaunched?: number;
  uniqueUsersSeenAnnouncements?: number;
  emptyStatesLaunched?: number;
  uniqueUsersSeenEmptyStates?: number;
  /* Block 3: Times to complete */
  averageGuideCompletionTimeInDays?: number;
  /* Block 4: Dropoffs */
  dropOffStep?: {
    name: string;
    templateEntityId: string;
    percentComplete: number;
  };
  /* Block 5: Engaged customers */
  mostEngagedCustomer?: {
    name: string;
    entityId: string;
    numEvents: number;
  }[];
  /* Block 6: Content */
  guideWithLowWordCount?: {
    name: string;
    entityId: string;
  };
};

@Table({ schema: 'analytics', tableName: 'value_data' })
export class ValueData extends Model {
  readonly id!: number;

  @Column({ field: 'data', type: DataType.JSONB })
  readonly data!: ValueDataPayload;

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
