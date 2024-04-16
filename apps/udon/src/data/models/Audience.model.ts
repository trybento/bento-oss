import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

import { Organization } from './Organization.model';

import { EntityId, CreatedAt, UpdatedAt, DeletedAt } from './columns';
import { AutolaunchRulesData, AutolaunchTargetsData } from 'bento-common/types';
import { AttributeRule } from 'src/interactions/targeting/types';
import { User } from './User.model';

@Table({ schema: 'core', tableName: 'audiences', paranoid: true })
export class Audience extends Model<
  InferAttributes<Audience>,
  InferCreationAttributes<Audience, { omit: 'updatedAt' | 'createdAt' }>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(false)
  @Column({ field: 'name', type: DataType.TEXT })
  readonly name!: string;

  @AllowNull(false)
  @Column({ field: 'auto_launch_rules', type: DataType.JSONB })
  readonly autoLaunchRules!: AutolaunchRulesData<AttributeRule>[];

  @AllowNull(false)
  @Column({ field: 'targets', type: DataType.JSONB })
  readonly targets!: AutolaunchTargetsData<AttributeRule>[];

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(true)
  @Column({
    field: 'edited_at',
    type: DataType.DATE,
  })
  readonly editedAt?: CreationOptional<Date>;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'edited_by_user_id', type: DataType.INTEGER })
  readonly editedByUserId?: CreationOptional<number>;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  declare deletedAt?: CreationOptional<Date | null>;

  // ASSOCIATIONS
  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;

  @BelongsTo(() => User, 'edited_by_user_id')
  readonly editedByUser?: NonAttribute<User>;
}
