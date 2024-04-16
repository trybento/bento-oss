import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Scopes,
} from 'sequelize-typescript';
import { InferAttributes, Op } from 'sequelize';

import { EntityId, CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';
import NpsSurvey from './NpsSurvey.model';
import NpsSurveyInstance from './NpsSurveyInstance.model';
import { Account } from '../Account.model';
import { AccountUser } from '../AccountUser.model';

export type NpsParticipantCreationAttributes = {
  entityId?: string; // upserting-related
  organizationId: number;
  npsSurveyInstanceId: number;
  accountId: number;
  accountUserId: number;
};

/**
 * Determines the default values for not nullable fields.
 * Useful to create new instances based on input that can be partial.
 */
export const defaultValues: Partial<
  Record<keyof InferAttributes<NpsParticipant>, any>
> = {};

@Scopes(() => ({
  incomplete: {
    where: {
      dismissedAt: null,
      answeredAt: null,
    },
  },
  withInstance: {
    include: [
      {
        model: NpsSurveyInstance,
        required: true,
      },
    ],
  },
  fromInstance: (instanceIds: number | number[]) => ({
    where: {
      npsSurveyInstanceId: {
        [Op.in]: instanceIds,
      },
    },
  }),
  withInstanceAndSurvey: {
    include: [
      {
        model: NpsSurveyInstance,
        required: true,
        include: [
          {
            model: NpsSurvey,
            required: true,
          },
        ],
      },
    ],
  },
}))
@Table({ schema: 'core', tableName: 'nps_participants' })
export default class NpsParticipant extends Model<
  InferAttributes<NpsParticipant>,
  NpsParticipantCreationAttributes
> {
  readonly id!: number;

  @EntityId
  declare readonly entityId: string;

  @AllowNull(false)
  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  declare readonly organizationId: number;

  @AllowNull(true)
  @ForeignKey(() => NpsSurveyInstance)
  @Column({ field: 'nps_survey_instance_id', type: DataType.INTEGER })
  declare readonly npsSurveyInstanceId: number | null;

  @AllowNull(true)
  @ForeignKey(() => Account)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  declare readonly accountId: number | null;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  declare readonly accountUserId: number;

  @AllowNull(true)
  @Column({
    field: 'answer',
    type: DataType.INTEGER,
    comment: 'Answer to the NPS question (score)',
  })
  declare answer: number;

  @AllowNull(true)
  @Column({
    field: 'fup_answer',
    type: DataType.TEXT,
    comment: 'Answer to the follow-up question',
  })
  declare fupAnswer: string | null;

  @AllowNull(true)
  @Column({
    field: 'answered_at',
    type: DataType.DATE,
    comment: 'Moment when this got answered',
  })
  declare answeredAt: Date | null;

  @AllowNull(true)
  @Column({
    field: 'dismissed_at',
    type: DataType.DATE,
    comment: 'Moment when this got dismissed',
  })
  declare dismissedAt: Date | null;

  @AllowNull(true)
  @Column({
    field: 'first_seen_at',
    type: DataType.DATE,
    comment: 'Moment when this was seen for the first time',
  })
  declare firstSeenAt: Date;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations

  /** Which org this belongs to. */
  @BelongsTo(() => Organization)
  declare readonly organization: Organization;

  /**
   * Which survey instance this belongs to.
   * Can be `null` if the survey instance got removed from the database.
   **/
  @BelongsTo(() => NpsSurveyInstance)
  declare readonly instance: NpsSurveyInstance | null;

  /**
   * Which account this participant belongs to.
   * Can be `null` if the account got removed from the database.
   **/
  @BelongsTo(() => Account)
  declare readonly account: Account | null;

  /** Which account user this belongs to */
  @BelongsTo(() => AccountUser)
  declare readonly accountUser: AccountUser;
}
