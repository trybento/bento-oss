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
import { InferAttributes, Op, Sequelize } from 'sequelize';
import { $enum } from 'ts-enum-util';
import { formatISO } from 'date-fns';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';
import {
  NpsEndingType,
  NpsFollowUpQuestionSettings,
  NpsFollowUpQuestionType,
  NpsFormFactor,
  NpsFormFactorStyle,
  NpsPageTargetingType,
  NpsStartingType,
  NpsSurveyInput,
  NpsSurveyState,
  NpsSurveyTargets,
} from 'bento-common/types/netPromoterScore';
import { EnumColumn } from 'bento-common/utils/sequelize';

import { commonImmutableFields } from '../common';
import { EntityId, CreatedAt, UpdatedAt, DeletedAt } from '../columns';
import { Organization } from '../Organization.model';
import NpsSurveyInstance from './NpsSurveyInstance.model';
import { GroupCondition, TargetingType } from 'src/../../common/types';

export type NpsSurveyCreationAttributes = Omit<
  NpsSurveyInput,
  'pageTargeting'
> & {
  entityId?: string;
  organizationId: number;
  pageTargetingType?: NpsPageTargetingType;
  pageTargetingUrl?: string | null;
};

/**
 * Determines the default values for not nullable fields.
 * Useful to create new instances based on input that can be partial.
 */
export const defaultValues: Partial<
  Record<keyof InferAttributes<NpsSurvey>, any>
> = {
  name: () => `${formatISO(new Date(), { representation: 'date' })} - NPS`,
  question: 'How likely are you to recommend us?',
  formFactor: NpsFormFactor.banner,
  fupType: NpsFollowUpQuestionType.none,
  startingType: NpsStartingType.manual,
  endingType: NpsEndingType.manual,
  priorityRanking: DEFAULT_PRIORITY_RANKING,
  pageTargetingType: NpsPageTargetingType.anyPage,
  targets: {
    account: {
      type: TargetingType.all,
      rules: [],
      grouping: GroupCondition.all,
    },
    accountUser: {
      type: TargetingType.all,
      rules: [],
      grouping: GroupCondition.all,
    },
  },
};

/**
 * Determines which fields are immutable.
 */
export const immutableFields = commonImmutableFields;

@Scopes(() => ({
  launched: {
    where: {
      launchedAt: {
        [Op.not]: null,
      },
    },
  },
  notLaunched: {
    where: {
      launchedAt: {
        [Op.is]: null,
      },
    },
  },
  launchable: {
    where: {
      launchedAt: {
        [Op.not]: null,
      },
      deletedAt: {
        [Op.is]: null,
      },
      startingType: NpsStartingType.dateBased,
      startAt: {
        [Op.lte]: Sequelize.fn('NOW'),
      },
    },
  },
  expirable: {
    where: {
      launchedAt: {
        [Op.not]: null,
      },
      deletedAt: {
        [Op.is]: null,
      },
      endingType: NpsEndingType.dateBased,
      endAt: {
        [Op.lte]: Sequelize.fn('NOW'),
      },
    },
  },
  fromOrganization: (id: number | number[]) => ({
    where: {
      organizationId: id,
    },
  }),
  withActiveInstance: () => ({
    include: [
      {
        model: NpsSurveyInstance.scope('active'),
        limit: 1,
      },
    ],
  }),
}))
@Table({ schema: 'core', tableName: 'nps_surveys', paranoid: true })
export default class NpsSurvey extends Model<
  InferAttributes<NpsSurvey>,
  NpsSurveyCreationAttributes
> {
  readonly id!: number;

  @EntityId
  declare readonly entityId: string;

  @AllowNull(false)
  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  declare readonly organizationId: number;

  @AllowNull(false)
  @Default(defaultValues.name)
  @Column({ type: DataType.TEXT })
  declare name: string;

  @AllowNull(false)
  @Default(defaultValues.formFactor)
  @Validate({
    isIn: {
      args: [$enum(NpsFormFactor).getValues()],
      msg: 'Invalid form factor',
    },
  })
  @EnumColumn('form_factor', NpsFormFactor)
  declare formFactor: NpsFormFactor;

  @AllowNull(true)
  @Column({
    field: 'form_factor_style',
    type: DataType.JSONB,
    comment: 'Presentation styles based on the form factor',
    get: function formFactorStyleGetter(this: NpsSurvey): NpsFormFactorStyle {
      return this.getDataValue('formFactorStyle') || {};
    },
  })
  declare formFactorStyle: NpsFormFactorStyle;

  @AllowNull(false)
  @Default(defaultValues.question)
  @Column({
    field: 'question',
    type: DataType.TEXT,
    comment: 'The question to be asked',
  })
  declare question: string;

  @AllowNull(false)
  @Default(defaultValues.fupType)
  @Validate({
    isIn: {
      args: [$enum(NpsFollowUpQuestionType).getValues()],
      msg: 'Invalid follow-up question-type',
    },
  })
  @EnumColumn('fup_type', NpsFollowUpQuestionType, {
    comment: 'Follow-up question-type',
  })
  declare fupType: NpsFollowUpQuestionType;

  @AllowNull(true)
  @Column({
    field: 'fup_settings',
    type: DataType.JSONB,
    comment: 'Follow-up settings based on the choosen question-type',
    get: function fupSettingsGetter(
      this: NpsSurvey
    ): NpsFollowUpQuestionSettings {
      return this.getDataValue('fupSettings') || {};
    },
  })
  declare fupSettings: NpsFollowUpQuestionSettings;

  @AllowNull(false)
  @Default(defaultValues.startingType)
  @Validate({
    isIn: {
      args: [$enum(NpsStartingType).getValues()],
      msg: 'Invalid starting-type',
    },
  })
  @EnumColumn('starting_type', NpsStartingType, {
    comment: 'Determines the "starting" criteria for the NPS survey',
  })
  declare startingType: NpsStartingType;

  @AllowNull(true)
  @Column({
    field: 'start_at',
    type: DataType.DATE,
    comment:
      'Determines when the NPS survey should start launching to end-users',
  })
  declare startAt: Date | null;

  @AllowNull(false)
  @Default(defaultValues.endingType)
  @Validate({
    isIn: {
      args: [$enum(NpsEndingType).getValues()],
      msg: 'Invalid ending-type',
    },
  })
  @EnumColumn('ending_type', NpsEndingType, {
    comment: 'Determines the "ending" criteria for the NPS survey',
  })
  declare endingType: NpsEndingType;

  @AllowNull(true)
  @Column({
    field: 'end_at',
    type: DataType.DATE,
    comment:
      'Determines when the NPS survey should stop launching to end-users',
  })
  declare endAt: Date | null;

  @AllowNull(true)
  @Column({
    field: 'end_after_total_answers',
    type: DataType.INTEGER,
    comment: 'Determines after how many answers the NPS survey should be ended',
  })
  declare endAfterTotalAnswers: number | null;

  @AllowNull(false)
  @Default(defaultValues.priorityRanking)
  @Column({
    field: 'priority_ranking',
    type: DataType.INTEGER,
    comment: 'Priority ranking amongst Guides and NPS surveys',
  })
  declare priorityRanking: number;

  @AllowNull(false)
  @Default(defaultValues.targets)
  @Column({ field: 'targets', type: DataType.JSONB })
  declare readonly targets: NpsSurveyTargets;

  @AllowNull(false)
  @Default(defaultValues.pageTargetingType)
  @Validate({
    isIn: {
      args: [$enum(NpsPageTargetingType).getValues()],
      msg: 'Invalid page targeting type',
    },
  })
  @EnumColumn('page_targeting_type', NpsPageTargetingType, {
    comment: 'Determines the location targeting type',
  })
  declare pageTargetingType: NpsPageTargetingType;

  @AllowNull(true)
  @Column({
    field: 'page_targeting_url',
    type: DataType.TEXT,
    comment:
      'Determines the location targeting url when targeting is set to a specific page',
  })
  declare pageTargetingUrl: string | null;

  @AllowNull(false)
  @Default(NpsSurveyState.draft)
  @EnumColumn('state', NpsSurveyState)
  declare readonly state: NpsSurveyState;

  @AllowNull(true)
  @Column({
    field: 'launched_at',
    type: DataType.DATE,
    comment: 'Moment when this survey was launched',
  })
  declare launchedAt: Date | null;

  @AllowNull(true)
  @Column({
    field: 'repeat_interval',
    type: DataType.INTEGER,
    comment: 'How many days before this survey launches again',
  })
  declare repeatInterval: number | null;

  @DeletedAt
  declare deletedAt: Date;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations

  @BelongsTo(() => Organization)
  declare readonly organization: Organization;

  @HasMany(() => NpsSurveyInstance)
  declare readonly instances: NpsSurveyInstance[];
}
