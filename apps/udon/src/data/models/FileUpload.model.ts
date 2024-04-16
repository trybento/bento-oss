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

import { AccountUser } from './AccountUser.model';
import { Organization } from './Organization.model';
import { Step } from './Step.model';

/**
 * @deprecated remove after D+7
 * @todo remove associated table separately
 */
@Table({ schema: 'core', tableName: 'file_uploads' })
export class FileUpload extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Step)
  @AllowNull(true)
  @Column({ field: 'step_id', type: DataType.INTEGER })
  readonly stepId!: number;

  @AllowNull(false)
  @Column({ field: 'filename', type: DataType.TEXT })
  readonly filename!: string;

  @AllowNull(false)
  @Column({ field: 'original_filename', type: DataType.TEXT })
  readonly originalFilename!: string;

  @AllowNull(true)
  @Column({ field: 'url', type: DataType.TEXT })
  readonly url?: string;

  @ForeignKey(() => AccountUser)
  @AllowNull(true)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId?: number;

  @AllowNull(true)
  @Column({ field: 'slate_node_id', type: DataType.TEXT })
  readonly slateNodeId?: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => AccountUser)
  readonly accountUser!: AccountUser;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
