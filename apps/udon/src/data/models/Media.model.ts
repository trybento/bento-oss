import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { MediaMeta, MediaType } from 'bento-common/types/media';
import { Organization } from './Organization.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';

export function mediaMetaGetter(this: Media): MediaMeta {
  return this.getDataValue('meta') || {};
}

export function mediaMetaSetter(
  this: Media,
  value: MediaMeta | null | undefined
) {
  this.setDataValue('meta', value || null);
}

@Table({
  schema: 'core',
  tableName: 'medias',
})
export default class Media extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(false)
  @EnumColumn('type', MediaType)
  readonly type!: MediaType;

  @AllowNull(false)
  @Column({ field: 'url', type: DataType.STRING })
  readonly url!: string;

  @AllowNull(true)
  @Column({
    field: 'meta',
    type: DataType.JSONB,
    get: mediaMetaGetter,
    set: mediaMetaSetter,
  })
  readonly meta!: MediaMeta;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
