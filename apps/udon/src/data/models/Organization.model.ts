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
import { literal, Op } from 'sequelize';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { OrgOptions, OrgState } from 'bento-common/types';
import { OrgPlan } from 'bento-common/types/accounts';
import { DEFAULT_ALLOTTED_GUIDES } from 'bento-common/utils/constants';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Account } from './Account.model';
import { OrganizationSettings } from './OrganizationSettings.model';
import { User } from './User.model';
import { OrganizationHost } from './OrganizationHost.model';
import { OrganizationData } from './Analytics/OrganizationData.model';
import { ValueData } from './Analytics/ValueData.model';

export enum OrganizationModelScope {
  active = 'active',
  inactive = 'inactive',
  withAccounts = 'withAccounts',
  withAccountsAndUsers = 'withAccountsAndUsers',
}

@Scopes(() => ({
  [OrganizationModelScope.active]: {
    where: { state: { [Op.ne]: OrgState.Inactive } },
  },
  [OrganizationModelScope.inactive]: { where: { state: OrgState.Inactive } },
  [OrganizationModelScope.withAccounts]: { include: [Account] },
  [OrganizationModelScope.withAccountsAndUsers]: (
    accountExternalIds: string[],
    accountUserExternalIds: string[]
  ) => ({
    include: [
      {
        model: Account.scope([
          'notArchived',
          { method: ['withAccountUsers', accountUserExternalIds] },
        ]),
        required: true,
        where: { externalId: accountExternalIds },
      },
    ],
  }),
}))
@Table({ schema: 'core', tableName: 'organizations' })
export class Organization extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  readonly name?: string;

  @AllowNull(false)
  @Column({ field: 'slug', type: DataType.TEXT })
  readonly slug!: string;

  @AllowNull(true)
  @Column({ field: 'domain', type: DataType.TEXT })
  readonly domain?: string;

  @AllowNull(false)
  @Default(OrgState.Active)
  @EnumColumn('state', OrgState)
  readonly state!: OrgState;

  @AllowNull(true)
  @Column({
    field: 'trial_started_at',
    type: DataType.DATE,
  })
  readonly trialStartedAt?: Date;

  @AllowNull(true)
  @Column({
    field: 'trial_ended_at',
    type: DataType.DATE,
  })
  readonly trialEndedAt?: Date;

  @AllowNull(true)
  @Column({
    field: 'allotted_guides',
    type: DataType.INTEGER,
  })
  readonly allottedGuides!: number;

  @AllowNull(true)
  @Default(false)
  @Column({ field: 'control_syncing', type: DataType.BOOLEAN })
  readonly controlSyncing?: boolean;

  @AllowNull(true)
  @Default({ allottedGuides: DEFAULT_ALLOTTED_GUIDES })
  @Column({ field: 'options', type: DataType.JSONB })
  readonly options!: OrgOptions;

  @AllowNull(true)
  @Column({ field: 'last_step_gpt_usage_at', type: DataType.DATE })
  readonly lastStepGptUsageAt?: Date;

  @AllowNull(true)
  @Column({ field: 'temp_active_guide_entity_id', type: DataType.TEXT })
  readonly TEMPactiveGuideEntityId?: string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'owned_by_user_id', type: DataType.INTEGER })
  readonly ownedByUserId?: number;

  @AllowNull(false)
  @Default(literal('uuid_generate_v1mc()'))
  @Column({ field: 'launching_cache_key', type: DataType.TEXT })
  readonly launchingCacheKey!: string;

  @AllowNull(true)
  @Column({
    field: 'delete_at',
    type: DataType.DATE,
  })
  readonly deleteAt?: Date;

  @Comment('What level of plan the org is on, correlating with $$$ paid')
  @AllowNull(false)
  @Default(OrgPlan.starter)
  @EnumColumn('plan', OrgPlan)
  readonly plan!: OrgPlan;

  // ASSOCIATIONS
  @HasMany(() => Account)
  readonly accounts!: Account[];

  @HasOne(() => OrganizationSettings)
  readonly organizationSettings!: OrganizationSettings;

  @HasOne(() => OrganizationData)
  readonly organizationData!: OrganizationData;

  @BelongsTo(() => User)
  readonly ownedByUser?: User;

  @HasMany(() => OrganizationHost)
  readonly hostnames!: OrganizationHost[];

  @HasOne(() => ValueData)
  readonly valueData?: ValueData;
}
