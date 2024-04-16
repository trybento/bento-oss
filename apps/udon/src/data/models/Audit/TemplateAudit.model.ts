import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { EntityId, CreatedAt, UpdatedAt } from '../columns';

import { User } from '../User.model';
import { Organization } from '../Organization.model';
import { Template } from '../Template.model';
import { AuditData } from './common';
import { AuditEvent } from 'src/utils/auditContext';

@Table({ schema: 'audit', tableName: 'template_audit' })
export class TemplateAudit extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ field: 'event_name', type: DataType.TEXT })
  readonly eventName!: AuditEvent;

  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  readonly userId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @Column({ field: 'data', type: DataType.JSONB })
  readonly data?: AuditData;

  @AllowNull(false)
  @Column({ field: 'context_id', type: DataType.TEXT })
  readonly contextId!: string;

  @AllowNull(true)
  @Default(false)
  @Column({ field: 'is_system', type: DataType.BOOLEAN })
  readonly isSystem?: boolean;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => Template)
  readonly template!: Template;

  @BelongsTo(() => User)
  readonly user!: User;
}
