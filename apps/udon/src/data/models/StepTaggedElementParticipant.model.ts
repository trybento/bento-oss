import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { AccountUser } from './AccountUser.model';
import { Organization } from './Organization.model';
import { StepTaggedElement } from './StepTaggedElement.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';

@Table({ schema: 'core', tableName: 'step_tagged_element_participants' })
export class StepTaggedElementParticipant extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => StepTaggedElement)
  @AllowNull(false)
  @Column({ field: 'step_tagged_element_id', type: DataType.INTEGER })
  readonly stepTaggedElementId!: number;

  @ForeignKey(() => AccountUser)
  @AllowNull(false)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(true)
  @Column({ field: 'dismissed_at', type: DataType.DATE })
  readonly dismissedAt?: Date;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations

  @BelongsTo(() => StepTaggedElement)
  readonly stepTaggedElement!: StepTaggedElement;

  @BelongsTo(() => AccountUser)
  readonly accountUser!: AccountUser;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
