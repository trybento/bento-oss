import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { AttributeType, DataSource, TargetValueType } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { CustomAttributeValue } from './CustomAttributeValue.model';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

@Table({ schema: 'core', tableName: 'custom_attributes' })
export class CustomAttribute extends Model<
  InferAttributes<CustomAttribute>,
  InferCreationAttributes<CustomAttribute, { omit: 'createdAt' | 'updatedAt' }>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(false)
  @Column({ field: 'name', type: DataType.TEXT })
  readonly name!: string;

  @AllowNull(false)
  @EnumColumn('value_type', TargetValueType)
  readonly valueType!: TargetValueType;

  @AllowNull(true)
  @EnumColumn('type', AttributeType)
  readonly type?: CreationOptional<AttributeType>;

  @EnumColumn('source', DataSource)
  readonly source?: CreationOptional<DataSource>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;

  @HasMany(() => CustomAttributeValue)
  readonly customAttributeValues!: NonAttribute<CustomAttributeValue[]>;
}
