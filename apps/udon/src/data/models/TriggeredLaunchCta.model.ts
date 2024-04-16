import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Organization } from './Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Step } from './Step.model';
import { AccountUser } from './AccountUser.model';
import { Guide } from './Guide.model';
import { GuideBaseStepCta } from './GuideBaseStepCta.model';

@Table({ schema: 'core', tableName: 'triggered_launch_ctas' })
export class TriggeredLaunchCta extends Model<
  InferAttributes<TriggeredLaunchCta>,
  InferCreationAttributes<
    TriggeredLaunchCta,
    { omit: 'createdAt' | 'updatedAt' }
  >
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @ForeignKey(() => Guide)
  @AllowNull(false)
  @Column({ field: 'created_guide_id', type: DataType.INTEGER })
  readonly createdGuideId!: number;

  @ForeignKey(() => Step)
  @AllowNull(false)
  @Column({ field: 'triggered_from_step_id', type: DataType.INTEGER })
  readonly triggeredFromStepId!: number;

  @ForeignKey(() => Guide)
  @AllowNull(false)
  @Column({ field: 'triggered_from_guide_id', type: DataType.INTEGER })
  readonly triggeredFromGuideId!: number;

  /** Allowed to be nullable since CTAs are less "stable" and we still want to know the trigger if changed */
  @ForeignKey(() => GuideBaseStepCta)
  @AllowNull(true)
  @Column({ field: 'triggered_from_guide_base_cta_id', type: DataType.INTEGER })
  readonly triggeredFromGuideBaseCtaId?: number;

  @ForeignKey(() => AccountUser)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId?: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS
  @BelongsTo(() => Guide)
  readonly createdGuide?: NonAttribute<Guide>;

  @BelongsTo(() => Step)
  readonly createdFromStep?: NonAttribute<Step>;

  @BelongsTo(() => GuideBaseStepCta)
  readonly createdFromGuideBaseCta?: NonAttribute<GuideBaseStepCta>;

  @BelongsTo(() => Organization)
  readonly organization?: NonAttribute<Organization>;
}
