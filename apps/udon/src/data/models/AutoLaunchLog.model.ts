import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EntityId, CreatedAt, UpdatedAt } from './columns';

import { Account } from './Account.model';
import { Organization } from './Organization.model';
import { Template } from './Template.model';
import { GuideBase } from './GuideBase.model';

export type MatchedRule = {
  ruleType: string;
  rules?: any[];
};

/** Record of an Autolaunched guide deletion used to prevent re-autolaunching */
@Table({ schema: 'core', tableName: 'auto_launch_log' })
export class AutoLaunchLog extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @ForeignKey(() => Account)
  @AllowNull(false)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  readonly accountId!: number;

  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => GuideBase)
  @AllowNull(true)
  @Column({ field: 'created_guide_base_id', type: DataType.INTEGER })
  readonly createdGuideBaseId!: number;

  @Column({ field: 'matched_rules', type: DataType.JSONB })
  readonly matchedRules!: MatchedRule[];

  // Associations
  @BelongsTo(() => Account)
  readonly account!: Account;

  @BelongsTo(() => Template)
  readonly template!: Template;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => GuideBase)
  readonly guideBase!: GuideBase;
}
