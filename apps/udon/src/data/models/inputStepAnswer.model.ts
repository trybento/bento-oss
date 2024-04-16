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
import { Organization } from './Organization.model';
import { Step } from './Step.model';
import { AccountUser } from './AccountUser.model';
import { InputStepBase } from 'src/data/models/inputStepBase.model';

@Table({ schema: 'core', tableName: 'input_step_answers' })
export class InputStepAnswer extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => InputStepBase)
  @AllowNull(true)
  @Column({ field: 'input_step_base_id', type: DataType.INTEGER })
  readonly inputStepBaseId!: number | null;

  @ForeignKey(() => Step)
  @AllowNull(true)
  @Column({ field: 'step_id', type: DataType.INTEGER })
  readonly stepId!: number | null;

  @ForeignKey(() => AccountUser)
  @AllowNull(false)
  @Column({ field: 'answered_by_account_user_id', type: DataType.INTEGER })
  readonly answeredByAccountUserId!: number;

  @AllowNull(true)
  @Column({ field: 'answer', type: DataType.TEXT })
  readonly answer!: string | null;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => InputStepBase)
  readonly inputStepBase?: InputStepBase;

  @BelongsTo(() => Step)
  readonly step?: Step;

  @BelongsTo(() => AccountUser)
  readonly accountUser!: AccountUser;
}
