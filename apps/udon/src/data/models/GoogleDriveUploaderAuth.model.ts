import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

@Table({ schema: 'core', tableName: 'google_drive_uploader_auths' })
export class GoogleDriveUploaderAuth extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ field: 'external_id', type: DataType.TEXT })
  readonly externalId!: string;

  @AllowNull(false)
  @Column({ field: 'email', type: DataType.TEXT })
  readonly email!: string;

  @AllowNull(false)
  @Column({ field: 'access_token', type: DataType.TEXT })
  readonly accessToken!: string;

  @AllowNull(false)
  @Column({ field: 'refresh_token', type: DataType.TEXT })
  readonly refreshToken!: string;

  @AllowNull(false)
  @Column({ field: 'expires_at', type: DataType.DATE })
  readonly expiresAt!: Date;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
