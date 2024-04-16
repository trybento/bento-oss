import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Organization } from './Organization.model';

@Table({ schema: 'core', tableName: 'organization_hosts' })
export class OrganizationHost extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(false)
  @Column({ field: 'hostname', type: DataType.TEXT })
  readonly hostname!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
