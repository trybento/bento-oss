import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EntityId, CreatedAt, UpdatedAt } from '../columns';
import { User } from '../User.model';
import { Organization } from '../Organization.model';
import { AuditData } from './common';
import { AuditEvent } from 'src/utils/auditContext';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { GuideBase } from '../GuideBase.model';

@Table({ schema: 'audit', tableName: 'guide_base_audit' })
export class GuideBaseAudit extends Model<
  InferAttributes<GuideBaseAudit>,
  InferCreationAttributes<GuideBaseAudit>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: AuditEvent;

  @ForeignKey(() => GuideBase)
  @AllowNull(false)
  @Column({ field: 'guide_base_id', type: DataType.INTEGER })
  readonly guideBaseId!: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  readonly userId?: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @Column({ field: 'data', type: DataType.JSONB })
  readonly data?: AuditData;

  @AllowNull(false)
  @Column({ field: 'context_id', type: DataType.TEXT })
  readonly contextId!: string;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: CreationOptional<Organization>;

  @BelongsTo(() => GuideBase)
  readonly guideBase!: CreationOptional<GuideBase>;

  @BelongsTo(() => User)
  readonly user!: CreationOptional<User>;
}
