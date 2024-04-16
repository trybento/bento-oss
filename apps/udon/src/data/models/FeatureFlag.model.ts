import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { EntityId, CreatedAt, UpdatedAt } from './columns';

@Table({ schema: 'core', tableName: 'feature_flags' })
export class FeatureFlag extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  readonly name!: string;

  @AllowNull(false)
  @Column({ field: 'enabled_for_all', type: DataType.BOOLEAN })
  readonly enabledForAll!: Boolean;

  @AllowNull(false)
  @Column({ field: 'enabled_for_new_orgs', type: DataType.BOOLEAN })
  readonly enabledForNewOrgs!: Boolean;

  @AllowNull(false)
  @Column({ field: 'send_to_admin', type: DataType.BOOLEAN })
  readonly sendToAdmin!: Boolean;

  @AllowNull(false)
  @Column({ field: 'send_to_embeddable', type: DataType.BOOLEAN })
  readonly sendToEmbeddable!: Boolean;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
