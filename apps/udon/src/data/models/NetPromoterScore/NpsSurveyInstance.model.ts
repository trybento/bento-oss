import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  Scopes,
  Validate,
  Default,
} from 'sequelize-typescript';
import { InferAttributes, NonAttribute, Op } from 'sequelize';
import { $enum } from 'ts-enum-util';
import { NpsSurveyInstanceState } from 'bento-common/types/netPromoterScore';
import { EnumColumn } from 'bento-common/utils/sequelize';

import { EntityId, CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';
import NpsSurvey from './NpsSurvey.model';
import NpsParticipant from './NpsParticipant.model';

export type NpsSurveyInstanceCreationAttributes = {
  entityId?: string; // upserting-related
  organizationId: number;
  createdFromNpsSurveyId: number;
  state: NpsSurveyInstanceState;
  startedAt: Date;
};

/**
 * Determines the default values for not nullable fields.
 * Useful to create new instances based on input that can be partial.
 */
export const defaultValues: Partial<
  Record<keyof InferAttributes<NpsSurveyInstance>, any>
> = {
  totalAnswers: 0,
};

@Scopes(() => ({
  active: () => ({
    where: {
      state: NpsSurveyInstanceState.active,
      startedAt: {
        [Op.lte]: Date.now(),
      },
    },
  }),
  expirable: {
    where: {
      endedAt: null,
      state: NpsSurveyInstanceState.active,
    },
    include: [
      {
        model: NpsSurvey.scope('expirable'),
        required: true,
      },
    ],
  },
  notActive: {
    where: {
      state: {
        [Op.ne]: NpsSurveyInstanceState.active,
      },
    },
  },
  withSurvey: {
    include: [
      {
        model: NpsSurvey,
        required: true,
      },
    ],
  },
  fromSurvey: (npsSurveyIds: number | number[]) => ({
    include: [
      {
        model: NpsSurvey,
        where: {
          id: {
            [Op.in]: npsSurveyIds,
          },
        },
        required: true,
      },
    ],
  }),
}))
@Table({ schema: 'core', tableName: 'nps_survey_instances' })
export default class NpsSurveyInstance extends Model<
  InferAttributes<NpsSurveyInstance>,
  NpsSurveyInstanceCreationAttributes
> {
  readonly id!: number;

  @EntityId
  declare readonly entityId: string;

  @AllowNull(false)
  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  declare readonly organizationId: number;

  @AllowNull(true)
  @ForeignKey(() => NpsSurvey)
  @Column({ field: 'created_from_nps_survey_id', type: DataType.INTEGER })
  declare readonly createdFromNpsSurveyId: number | null;

  @AllowNull(false)
  @Validate({
    isIn: {
      args: [$enum(NpsSurveyInstanceState).getValues()],
      msg: 'Invalid state',
    },
  })
  @EnumColumn('state', NpsSurveyInstanceState)
  declare state: NpsSurveyInstanceState;

  @AllowNull(false)
  @Default(defaultValues.totalAnswers)
  @Column({
    field: 'total_answers',
    type: DataType.INTEGER,
    comment: 'Total number of answers received',
  })
  declare totalAnswers: number;

  @AllowNull(false)
  @Column({
    field: 'started_at',
    type: DataType.DATE,
    comment: 'Moment when this survey actually started launching',
  })
  declare startedAt: Date;

  @AllowNull(true)
  @Column({
    field: 'ended_at',
    type: DataType.DATE,
    comment:
      'Moment when this survey stopped launching by reaching finished/terminated state',
  })
  declare endedAt: Date | null;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations

  @BelongsTo(() => Organization)
  declare readonly organization: Organization;

  /**
   * Which NPS Survey this instance belongs to.
   * Can be `null` if the survey got removed from the database.
   **/
  @BelongsTo(() => NpsSurvey)
  declare readonly survey?: NpsSurvey | null;

  @HasMany(() => NpsParticipant)
  declare readonly participants?: NonAttribute<NpsParticipant[]>;
}
