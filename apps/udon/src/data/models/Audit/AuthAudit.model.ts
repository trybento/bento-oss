import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Validate,
  Comment,
  BeforeUpdate,
} from 'sequelize-typescript';
import { $enum } from 'ts-enum-util';

import { EntityId, CreatedAt, UpdatedAt } from '../columns';
import { User } from '../User.model';
import { Organization } from '../Organization.model';

export enum AuthAuditEvent {
  logIn = 'login',
  fetchOrganizations = 'fetch_organizations',
  setOrganization = 'set_organization',
  forgotPassword = 'forgot_password',
  resetPassword = 'reset_password',
  sendResetPasswordEmail = 'send_reset_password_email',
  userInvited = 'user_invited',
  userAcceptedInvite = 'user_accepted_invite',
}

export enum AuthAuditEventOutcome {
  /** When the event/action succeeded */
  success = 'success',
  /** When the event/action failed */
  failure = 'failure',
  /** When its not possible or appropriate to determine an outcome */
  unknown = 'unknown',
}

@Table({ schema: 'audit', tableName: 'auth_audit' })
export class AuthAudit extends Model {
  readonly id!: number;

  @BeforeUpdate
  static failUpdateAttempts(_instance: AuthAudit) {
    throw new Error(`An AuthAudit log cannot be updated`);
  }

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Validate({
    isIn: {
      args: [$enum(AuthAuditEvent).getValues()],
      msg: 'Invalid event name',
    },
  })
  @Column({
    field: 'event_name',
    type: DataType.TEXT,
    comment: 'The event/action that happened and caused this log',
  })
  readonly eventName!: AuthAuditEvent;

  @AllowNull(false)
  @Validate({
    isIn: {
      args: [$enum(AuthAuditEventOutcome).getValues()],
      msg: 'Invalid outcome',
    },
  })
  @Column({
    field: 'outcome',
    type: DataType.TEXT,
    comment: 'The event/action outcome (i.e. success or failure)',
  })
  readonly outcome!: AuthAuditEventOutcome;

  @AllowNull(true)
  @Column({
    field: 'request_id',
    type: DataType.INET,
    comment: 'The ID of the request that generated this log',
  })
  readonly requestId?: string;

  @AllowNull(true)
  @Column({
    field: 'request_ip',
    type: DataType.INET,
    comment:
      'The IP address associated with the request that generated this log',
  })
  readonly requestIp?: string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({
    field: 'user_id',
    type: DataType.INTEGER,
    comment: 'The user id associated with this log, if exists',
  })
  readonly userId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(true)
  @Column({
    field: 'organization_id',
    type: DataType.INTEGER,
    comment: 'The organization associated with this log, if exists',
  })
  readonly organizationId!: number;

  @Column({
    field: 'meta',
    type: DataType.JSONB,
    comment:
      'Metadata of the execution context assoicated with the reqeust (i.e. features enabled)',
  })
  readonly meta?: Record<string, any>;

  @Column({
    field: 'payload',
    type: DataType.JSONB,
    comment:
      'The payload (sometimes partial) associated with the request, if exists',
  })
  readonly payload?: Record<string, any>;

  @Comment('The data when the event happened and resulted in this log')
  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization?: Organization;

  @BelongsTo(() => User)
  readonly user?: User;
}
