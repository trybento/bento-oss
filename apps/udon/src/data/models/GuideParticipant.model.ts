import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import {
  Op,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { Guide } from './Guide.model';
import { AccountUser } from './AccountUser.model';
import { Organization } from './Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { TemplateTarget } from './TemplateTarget.model';

@Scopes(() => ({
  done: { where: { doneAt: { [Op.not]: null } } },
  saved: { where: { savedAt: { [Op.not]: null } } },
  notObsolete: { where: { obsoletedAt: { [Op.is]: null } } },
  viewed: { where: { firstViewedAt: { [Op.not]: null } } },
  notViewed: { where: { firstViewedAt: { [Op.is]: null } } },
  forAccountUser: (accountUserId) => ({ where: { accountUserId } }),
}))
@Table({ schema: 'core', tableName: 'guide_participants' })
export class GuideParticipant extends Model<
  InferAttributes<GuideParticipant>,
  InferCreationAttributes<GuideParticipant>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @ForeignKey(() => Guide)
  @AllowNull(false)
  @Column({ field: 'guide_id', type: DataType.INTEGER })
  readonly guideId!: number;

  @ForeignKey(() => AccountUser)
  @AllowNull(false)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId!: number;

  @ForeignKey(() => TemplateTarget)
  @AllowNull(true)
  @Column({ field: 'created_from_template_target_id', type: DataType.INTEGER })
  /** @deprecated not used anywhere and not reliable/useful since targets often recreated */
  readonly createdFromTemplateTargetId?: CreationOptional<number>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(true)
  @Column({ field: 'first_viewed_at', type: DataType.DATE })
  readonly firstViewedAt?: CreationOptional<Date | null>;

  @AllowNull(true)
  @Column({ field: 'done_at', type: DataType.DATE })
  readonly doneAt?: CreationOptional<Date | null>;

  @AllowNull(true)
  @Column({ field: 'saved_at', type: DataType.DATE })
  readonly savedAt?: CreationOptional<Date | null>;

  @AllowNull(true)
  @Column({ field: 'obsoleted_at', type: DataType.DATE })
  readonly obsoletedAt?: CreationOptional<Date | null>;

  @AllowNull(false)
  @Default(false)
  @Column({
    field: 'is_destination',
    type: DataType.BOOLEAN,
    comment:
      'Whether this participant was added due to this guide being launched from another',
  })
  readonly isDestination!: CreationOptional<boolean>;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  // ASSOCIATIONS
  @BelongsTo(() => Guide)
  readonly guide!: CreationOptional<Guide>;

  @BelongsTo(() => AccountUser)
  readonly accountUser!: CreationOptional<AccountUser>;

  @BelongsTo(() => TemplateTarget)
  readonly createdFromTemplateTarget?: CreationOptional<TemplateTarget>;

  @BelongsTo(() => Organization)
  readonly organization!: CreationOptional<Organization>;
}
