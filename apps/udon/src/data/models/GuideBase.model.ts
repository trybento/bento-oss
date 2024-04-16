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
  Op,
  Includeable,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { GuideBaseState } from 'bento-common/types';

import { EntityId, CreatedAt, UpdatedAt, DeletedAt } from './columns';
import { Account } from './Account.model';
import { Organization } from './Organization.model';
import { Template } from './Template.model';
import { GuideModuleBase } from './GuideModuleBase.model';
import { User } from './User.model';
import { Guide } from './Guide.model';
import { GuideData } from './Analytics/GuideData.model';

/** @todo add other scopes as values */
export enum GuideBaseScope {
  /** Method for returning a guide with the associated template */
  withTemplate = 'withTemplate',
}

@Scopes(() => ({
  notObsolete: { where: { obsoletedAt: { [Op.is]: null } } },
  activated: { where: { activatedAt: { [Op.lte]: Sequelize.fn('NOW') } } },
  active: { where: { state: GuideBaseState.active } },
  forAccount: (accountId) => ({ where: { accountId } }),
  fromTemplate: (createdFromTemplateId) => ({
    where: { createdFromTemplateId },
  }),
  receivesPropagation: { where: { isModifiedFromTemplate: false } },
  /** @todo unit test scope logic, potentially create shared helper */
  withTemplate: (includeOptions: Exclude<Includeable, string> = {}) => ({
    include: [
      {
        model: Template,
        ...includeOptions,
      },
    ],
  }),
}))
@Table({ schema: 'core', tableName: 'guide_bases', paranoid: true })
export class GuideBase extends Model<
  InferAttributes<GuideBase>,
  InferCreationAttributes<GuideBase>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @ForeignKey(() => Account)
  @AllowNull(false)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  readonly accountId!: number;

  @ForeignKey(() => Template)
  @AllowNull(true)
  @Column({ field: 'created_from_template_id', type: DataType.INTEGER })
  readonly createdFromTemplateId?: CreationOptional<number | null>;

  @ForeignKey(() => Template)
  @AllowNull(true)
  @Column({ field: 'created_from_split_test_id', type: DataType.INTEGER })
  readonly createdFromSplitTestId?: CreationOptional<number>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(false)
  @EnumColumn('state', GuideBaseState)
  readonly state!: GuideBaseState;

  @AllowNull(true)
  @Column({ field: 'activated_at', type: DataType.DATE })
  readonly activatedAt?: CreationOptional<Date | null>;

  @AllowNull(true)
  @Column({ field: 'obsoleted_at', type: DataType.DATE })
  readonly obsoletedAt?: CreationOptional<Date | null>;

  @Column({
    field: 'is_modified_from_template',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  readonly isModifiedFromTemplate!: CreationOptional<boolean>;

  @Column({
    field: 'was_autolaunched',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  readonly wasAutoLaunched!: CreationOptional<boolean>;

  @AllowNull(true)
  @Default(false)
  @Comment(
    'If set to TRUE, forces this guide base to be excluded when evaluating user-level targeting rules. Mostly used to prevent branching/destination guides incorrectly launching to unintended users.'
  )
  @Column({
    field: 'exclude_from_user_targeting',
    type: DataType.BOOLEAN,
  })
  readonly excludeFromUserTargeting?: CreationOptional<boolean>;

  @Comment('Indicates whether the guide base is currently being reset')
  @AllowNull(true)
  @Column({
    field: 'is_resetting',
    type: DataType.BOOLEAN,
  })
  readonly isResetting?: CreationOptional<boolean | null>;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: CreationOptional<Date | null>;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'created_by_user_id', type: DataType.INTEGER })
  readonly createdByUserId?: CreationOptional<number>;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'updated_by_user_id', type: DataType.INTEGER })
  readonly updatedByUserId?: CreationOptional<number>;

  // Associations
  @BelongsTo(() => Account)
  readonly account!: CreationOptional<Account>;

  @BelongsTo(() => Organization)
  readonly organization!: CreationOptional<Organization>;

  @BelongsTo(() => Template)
  readonly createdFromTemplate?: CreationOptional<Template>;

  @HasMany(() => GuideModuleBase)
  readonly guideModuleBases!: CreationOptional<GuideModuleBase[]>;

  @BelongsTo(() => User)
  readonly createdByUser!: CreationOptional<User>;

  @BelongsTo(() => User)
  readonly updatedByUser!: CreationOptional<User>;

  @HasMany(() => Guide)
  readonly guides!: CreationOptional<Guide[]>;

  @HasOne(() => GuideData)
  readonly guideData?: CreationOptional<GuideData>;
}
