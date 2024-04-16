import {
  AllowNull,
  BeforeCreate,
  BelongsTo,
  BelongsToMany,
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
  Op,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import { EnumColumn } from 'bento-common/utils/sequelize';
import {
  Theme,
  GuideFormFactor,
  GuideDesignType,
  GuidePageTargetingType,
  FormFactorStyle,
  GuideTypeEnum,
  NotificationSettings,
  GuideExpirationCriteria,
  TemplateState,
} from 'bento-common/types';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';
import {
  isAnnouncementGuide,
  isInlineGuide,
  isSidebarGuide,
} from 'bento-common/utils/formFactor';
import { isCardTheme } from 'bento-common/data/helpers';

import { EntityId, CreatedAt, UpdatedAt, DeletedAt } from './columns';
import { Module } from './Module.model';
import { Organization } from './Organization.model';
import { TemplateModule } from './TemplateModule.model';
import { User } from './User.model';
import { guideDesignTypeGetter, guideDesignTypeSetter } from './common';
import { GuideBase } from './GuideBase.model';
import { TemplateAudience } from './TemplateAudience.model';
import { TemplateAutoLaunchRule } from './TemplateAutoLaunchRule.model';
import { TemplateTarget } from './TemplateTarget.model';
import { TemplateSplitTarget } from './TemplateSplitTarget.model';
import OrganizationInlineEmbed from './OrganizationInlineEmbed.model';

@Scopes(() => ({
  withTemplateModules: () => ({
    include: [
      {
        model: TemplateModule.scope('byOrderIndex'),
        include: [Module],
      },
    ],
  }),
  withModules: { include: [Module] },
  notArchived: { where: { archivedAt: { [Op.is]: null } } },
  contentTemplates: {
    where: {
      type: {
        [Op.ne]: GuideTypeEnum.splitTest,
      },
    },
  },
  splitTestTemplates: {
    where: {
      type: GuideTypeEnum.splitTest,
    },
  },
  excludeTemplates: {
    where: {
      isTemplate: false,
    },
  },
  expirable: {
    where: {
      expireBasedOn: {
        // NOTE: Since `never` is never persisted, any value means this can expire
        [Op.not]: null,
      },
    },
  },
}))
@Table({
  schema: 'core',
  tableName: 'templates',
  paranoid: true,
  validate: {
    /**
     * Enforces the cards domain not allowing unsupported data values.
     */
    enforceCardsDomain(this: Template) {
      if (isCardTheme(this.theme)) {
        if (this.pageTargetingType !== GuidePageTargetingType.inline) {
          throw new Error(`Expected card page targeting type to be inline`);
        }
        if (!isInlineGuide(this.formFactor)) {
          throw new Error(`Expected card to be inline`);
        }
        if (!this.isSideQuest) {
          throw new Error(`Expected card to be a side quest`);
        }
      }
    },
  },
})
export class Template extends Model<
  InferAttributes<Template>,
  InferCreationAttributes<Template>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(false)
  @Default(TemplateState.draft)
  @EnumColumn('state', TemplateState)
  readonly state!: TemplateState;

  @Comment(
    'Indicates whether the template has been manually launched, meaning it has active manually launched guide bases'
  )
  @AllowNull(true)
  @Default(false)
  @Column({
    field: 'manually_launched',
    type: DataType.BOOLEAN,
  })
  declare manuallyLaunched?: CreationOptional<boolean | null>;

  @Comment('Means the public name, previously meant the private name')
  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  readonly name?: CreationOptional<string>;

  @Comment('Means the private name')
  @AllowNull(true)
  @Column({ field: 'private_name', type: DataType.TEXT })
  readonly privateName?: CreationOptional<string>;

  @Comment('Means the public name')
  @AllowNull(true)
  @Column({ field: 'display_title', type: DataType.TEXT })
  /**
   * NOTE: We will continue writting to this column until it gets effectively removed,
   * just to simplify a rollback process, if ever needed.
   *
   * @deprecated will be dropped in favor of `name` and `privateName`
   */
  readonly displayTitle?: CreationOptional<string>;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  readonly description?: CreationOptional<string>;

  @AllowNull(false)
  @EnumColumn('type', GuideTypeEnum)
  readonly type!: GuideTypeEnum;

  @AllowNull(true)
  @Column({
    field: 'auto_launch_for_accounts_created_after',
    type: DataType.DATE,
  })
  /** @deprecated not used */
  readonly autoLaunchForAccountsCreatedAfter?: CreationOptional<Date>;

  @AllowNull(true)
  @Column({
    field: 'auto_launch_for_account_users_created_after',
    type: DataType.DATE,
  })
  /** @deprecated not used */
  readonly autoLaunchForAccountUsersCreatedAfter?: CreationOptional<Date>;

  @Default(false)
  @Column({ field: 'auto_launch_for_all_accounts', type: DataType.BOOLEAN })
  /** @deprecated not used */
  readonly autoLaunchForAllAccounts!: CreationOptional<boolean>;

  @Default(DEFAULT_PRIORITY_RANKING)
  @Column({ field: 'priority_ranking', type: DataType.INTEGER })
  readonly priorityRanking!: CreationOptional<number>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @Default(false)
  @Column({ field: 'is_auto_launch_enabled', type: DataType.BOOLEAN })
  readonly isAutoLaunchEnabled!: CreationOptional<boolean>;

  @AllowNull(true)
  @Column({ field: 'enable_auto_launch_at', type: DataType.DATE })
  readonly enableAutoLaunchAt?: CreationOptional<Date | null>;

  @AllowNull(true)
  @Column({ field: 'disable_auto_launch_at', type: DataType.DATE })
  readonly disableAutoLaunchAt?: CreationOptional<Date | null>;

  @AllowNull(false)
  @Default(false)
  @Column({ field: 'is_side_quest', type: DataType.BOOLEAN })
  readonly isSideQuest!: CreationOptional<boolean>;

  @AllowNull(true)
  @Column({ field: 'is_cyoa', type: DataType.BOOLEAN })
  readonly isCyoa?: CreationOptional<boolean>;

  @AllowNull(false)
  @Default(GuideFormFactor.legacy)
  @EnumColumn('form_factor', GuideFormFactor)
  readonly formFactor!: CreationOptional<GuideFormFactor>;

  @AllowNull(true)
  @Column({ field: 'form_factor_style', type: DataType.JSONB })
  readonly formFactorStyle?: CreationOptional<FormFactorStyle | null>;

  @Column({
    type: DataType.VIRTUAL(DataType.ENUM(...Object.values(GuideDesignType))),
    get: guideDesignTypeGetter,
    set: guideDesignTypeSetter,
  })
  readonly designType!: CreationOptional<GuideDesignType>;

  @AllowNull(false)
  @EnumColumn('page_targeting_type', GuidePageTargetingType, {
    defaultValue: GuidePageTargetingType.anyPage,
  })
  readonly pageTargetingType!: CreationOptional<GuidePageTargetingType>;

  @AllowNull(true)
  @Column({ field: 'page_targeting_url', type: DataType.TEXT })
  readonly pageTargetingUrl?: CreationOptional<string>;

  @AllowNull(false)
  @Default(false)
  @Column({
    field: 'is_template',
    type: DataType.BOOLEAN,
  })
  readonly isTemplate!: CreationOptional<boolean>;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'created_by_user_id', type: DataType.INTEGER })
  readonly createdByUserId!: CreationOptional<number>;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'updated_by_user_id', type: DataType.INTEGER })
  /** @todo unify with editedByUserId, or vice versa. May be deprecated. */
  readonly updatedByUserId!: CreationOptional<number>;

  @AllowNull(true)
  @Column({
    field: 'edited_at',
    type: DataType.DATE,
  })
  readonly editedAt?: CreationOptional<Date>;

  /**
   * @todo consolidate editedByUserId with updatedByUserId. At the time
   * of writing, I decided not to do the consolidation as we effectively
   * set/determine these values differently throughout. We will need to
   * therefore run through each use case and adjust.
   */
  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'edited_by_user_id', type: DataType.INTEGER })
  readonly editedByUserId!: CreationOptional<number>;

  @AllowNull(true)
  @Column({
    field: 'last_used_at',
    type: DataType.DATE,
  })
  readonly lastUsedAt?: CreationOptional<Date>;

  @AllowNull(false)
  @Default(Theme.nested)
  @EnumColumn('theme', Theme)
  readonly theme!: CreationOptional<Theme>;

  @AllowNull(true)
  @Column({
    field: 'archived_at',
    type: DataType.DATE,
  })
  readonly archivedAt?: CreationOptional<Date | null>;

  @Comment(
    'Dates before Jan 2024 are backfilled and not accurate. This is to track if we should show new targeting UI.'
  )
  @AllowNull(true)
  @Column({
    field: 'targeting_set',
    type: DataType.DATE,
  })
  readonly targetingSet?: CreationOptional<Date | null>;

  /** If null, default settings: all enabled */
  @AllowNull(true)
  @Column({ field: 'notification_settings', type: DataType.JSONB })
  readonly notificationSettings?: CreationOptional<NotificationSettings>;

  @Comment(
    'Determines the criteria for automatically expiring a guide after certain time'
  )
  @AllowNull(true)
  @Column({
    field: 'expire_based_on',
    type: DataType.ENUM(...Object.values(GuideExpirationCriteria)),
    get: function (this: Template) {
      const rawValue = this.getDataValue('expireBasedOn');
      switch (rawValue) {
        case null:
          return GuideExpirationCriteria.never;

        default:
          return rawValue as GuideExpirationCriteria;
      }
    },
  })
  readonly expireBasedOn?: CreationOptional<GuideExpirationCriteria | null>;

  @Comment(
    'Determines in how many days the guide should be automatically expired'
  )
  @AllowNull(true)
  @Column({
    field: 'expire_after',
    type: DataType.INTEGER,
    set: function (value: number | null) {
      this.setDataValue('expireAfter', value === 0 ? null : value);
    },
  })
  readonly expireAfter!: CreationOptional<number | null>;

  @Comment('Indicates whether the template is currently being reset')
  @AllowNull(true)
  @Column({
    field: 'is_resetting',
    type: DataType.BOOLEAN,
  })
  readonly isResetting!: CreationOptional<boolean | null>;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: CreationOptional<Date>;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;

  @HasMany(() => TemplateModule)
  readonly templateModules!: NonAttribute<TemplateModule[]>;

  @BelongsToMany(() => Module, () => TemplateModule)
  readonly modules!: NonAttribute<Module[]>;

  @BelongsTo(() => User, 'created_by_user_id')
  readonly createdByUser!: NonAttribute<User>;

  @BelongsTo(() => User, 'updated_by_user_id')
  readonly updatedByUser!: NonAttribute<User>;

  @BelongsTo(() => User, 'edited_by_user_id')
  readonly editedByUser!: NonAttribute<User>;

  @HasMany(() => GuideBase)
  readonly guideBases!: NonAttribute<GuideBase[]>;

  @HasOne(() => OrganizationInlineEmbed)
  declare readonly inlineEmbed?: NonAttribute<OrganizationInlineEmbed>;

  @HasMany(() => TemplateAutoLaunchRule)
  readonly templateAutoLaunchRules!: NonAttribute<TemplateAutoLaunchRule[]>;

  @HasMany(() => TemplateTarget)
  readonly templateTargets!: NonAttribute<TemplateTarget[]>;

  @HasMany(() => TemplateAudience)
  readonly templateAudiences!: NonAttribute<TemplateAudience[]>;

  /** Targets that a split testing template points to */
  @HasMany(() => TemplateSplitTarget, {
    sourceKey: 'id',
    foreignKey: 'destinationTemplateId',
  })
  readonly splitTargets?: NonAttribute<TemplateSplitTarget[]>;

  /** Split testing targets that point to this guide as a target */
  @HasMany(() => TemplateSplitTarget, {
    sourceKey: 'id',
    foreignKey: 'sourceTemplateId',
  })
  readonly splitSources?: NonAttribute<TemplateSplitTarget[]>;

  // Hooks

  /**
   * Set guide expiry defaults according to the template form factor.
   *
   * NOTE: For announcements and sidebar contextual guides, we set guide expiryt to "never"
   * since those type of guides shouldn't ever expire.
   */
  @BeforeCreate
  static setExpirationDefaults(instance: Template) {
    if (
      // announcements and sidebar contextual guides shouldn't expire
      isAnnouncementGuide(instance.formFactor) ||
      (instance.isSideQuest && isSidebarGuide(instance.formFactor))
    ) {
      instance.setDataValue('expireBasedOn', GuideExpirationCriteria.never);
      instance.setDataValue('expireAfter', null);
    } else if (!instance.expireBasedOn && !instance.expireAfter) {
      instance.setDataValue('expireBasedOn', GuideExpirationCriteria.launch);
      instance.setDataValue('expireAfter', 60);
    }
  }
}
