import {
  AllowNull,
  BelongsTo,
  Column,
  Comment,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  Includeable,
  InferCreationAttributes,
  Op,
  Sequelize,
  NonAttribute,
} from 'sequelize';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { GuideCompletionState, GuideState } from 'bento-common/types';

import { EntityId, CreatedAt, UpdatedAt, DeletedAt } from './columns';
import { Account } from './Account.model';
import { GuideBase } from './GuideBase.model';
import { GuideModule } from './GuideModule.model';
import { Organization } from './Organization.model';
import { Step } from './Step.model';
import { Template } from './Template.model';
import { GuideParticipant } from './GuideParticipant.model';
import { TriggeredBranchingPath } from './TriggeredBranchingPath.model';
import OrganizationInlineEmbed from './OrganizationInlineEmbed.model';
import { TriggeredLaunchCta } from './TriggeredLaunchCta.model';

export enum GuideScope {
  /** Checks guide state, and source guideBase/template states */
  active = 'active',
  /** LaunchedAt is a time before now */
  launched = 'launched',
  /** Include template that guide was created from */
  withTemplate = 'withTemplate',
}

@Scopes(() => ({
  [GuideScope.launched]: {
    where: { launchedAt: { [Op.lte]: Sequelize.fn('NOW') } },
  },
  complete: { where: { completedAt: { [Op.not]: null } } },
  done: { where: { doneAt: { [Op.not]: null } } },
  incomplete: { where: { completionState: GuideCompletionState.incomplete } },
  [GuideScope.active]: () => ({
    where: {
      state: {
        [Op.notIn]: [GuideState.draft, GuideState.expired],
      },
      createdFromTemplateId: {
        [Op.not]: null,
      },
      createdFromGuideBaseId: {
        [Op.not]: null,
      },
    },
    include: [
      {
        model: GuideBase.scope('notObsolete'),
        required: true,
        attributes: [],
        include: [
          {
            model: Template.scope('notArchived'),
            required: true,
            attributes: [],
          },
        ],
      },
    ],
  }),
  ofActiveOrganization: () => ({
    include: [
      {
        model: Organization.scope('active'),
        required: true,
      },
    ],
  }),
  ofExpirableTemplate: () => ({
    include: [
      {
        model: Template.scope('expirable'),
        required: true,
      },
    ],
  }),
  hasNoParticipants: {
    include: [
      {
        model: GuideParticipant,
        required: false,
        where: { id: { [Op.is]: null } },
      },
    ],
  },
  [GuideScope.withTemplate]: (
    includeOptions: Exclude<Includeable, string> = {}
  ) => ({
    include: [
      {
        model: Template,
        ...includeOptions,
      },
    ],
  }),
}))
@Table({ schema: 'core', tableName: 'guides', paranoid: true })
export class Guide extends Model<
  InferAttributes<Guide>,
  InferCreationAttributes<Guide>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(false)
  @EnumColumn('state', GuideState)
  readonly state!: GuideState;

  @AllowNull(true)
  @Default(GuideCompletionState.incomplete)
  @EnumColumn('completion_state', GuideCompletionState)
  readonly completionState?: CreationOptional<GuideCompletionState>;

  @AllowNull(true)
  @Column({ field: 'launched_at', type: DataType.DATE })
  readonly launchedAt?: CreationOptional<Date | null>;

  @AllowNull(true)
  @Column({ field: 'completed_at', type: DataType.DATE })
  readonly completedAt?: CreationOptional<Date | null>;

  @AllowNull(true)
  @Column({ field: 'done_at', type: DataType.DATE })
  readonly doneAt?: CreationOptional<Date | null>;

  @AllowNull(true)
  @Column({ field: 'last_active_at', type: DataType.DATE })
  readonly lastActiveAt?: CreationOptional<Date | null>;

  @ForeignKey(() => Account)
  @AllowNull(false)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  readonly accountId!: number;

  @ForeignKey(() => GuideBase)
  @AllowNull(true)
  @Column({ field: 'created_from_guide_base_id', type: DataType.INTEGER })
  readonly createdFromGuideBaseId!: number;

  /** @todo solve for possibly being null when looking up references */
  @ForeignKey(() => Template)
  @AllowNull(true)
  @Column({ field: 'created_from_template_id', type: DataType.INTEGER })
  readonly createdFromTemplateId?: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  /**
   * NOTE: This field alone shouldn't be trusted to determine if the guide expired since
   * it is possible for a guide to have a expireAt date in the past but still not be expired
   * (e.g. the guide was completed before the expiration date).
   */
  @Comment('When this guide needs to be considered expired')
  @AllowNull(true)
  @Column({ field: 'expire_at', type: DataType.DATE })
  readonly expireAt?: CreationOptional<Date | null>;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: CreationOptional<Date | null>;

  // Associations
  @BelongsTo(() => Account)
  readonly account!: NonAttribute<Account>;

  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;

  @BelongsTo(() => GuideBase)
  readonly createdFromGuideBase?: NonAttribute<GuideBase>;

  @BelongsTo(() => Template)
  readonly createdFromTemplate?: NonAttribute<Template>;

  @HasMany(() => GuideModule)
  readonly guideModules!: NonAttribute<GuideModule[]>;

  @HasMany(() => Step)
  readonly steps!: NonAttribute<Step[]>;

  @HasMany(() => GuideParticipant)
  readonly guideParticipants!: NonAttribute<GuideParticipant[]>;

  @HasOne(() => TriggeredBranchingPath, {
    foreignKey: 'createdGuideId',
  })
  readonly createdFromBranchingPath?: NonAttribute<TriggeredBranchingPath>;

  @HasOne(() => TriggeredLaunchCta, {
    foreignKey: 'createdGuideId',
  })
  readonly createdFromLaunchCta?: NonAttribute<TriggeredLaunchCta>;

  @HasMany(() => TriggeredBranchingPath, {
    foreignKey: 'triggeredFromGuideId',
  })
  readonly triggeredBranchingPaths?: NonAttribute<TriggeredBranchingPath>;

  @BelongsTo(() => OrganizationInlineEmbed, {
    foreignKey: 'createdFromTemplateId',
    targetKey: 'templateId',
  })
  readonly inlineEmbed?: NonAttribute<OrganizationInlineEmbed>;
}

export const isGuideFinished = (guide: Guide | undefined | null): boolean =>
  !!guide?.completedAt || !!guide?.doneAt;
