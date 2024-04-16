import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { GuideBase } from './GuideBase.model';
import { GuideStepBase } from './GuideStepBase.model';
import { Module } from './Module.model';
import { Organization } from './Organization.model';
import { User } from './User.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';

export enum GuideModuleBaseModelScope {
  withModule = 'withModule',
  withStepBases = 'withStepBases',
  byOrderIndex = 'byOrderIndex',
}

export type GuideModuleBaseWithModule<T = GuideModuleBase, M = Module> = T & {
  createdFromModule: M;
};

export type GuideModuleBaseWithStepBases<
  T = GuideModuleBase,
  S = GuideStepBase
> = T & {
  guideStepBases: S;
};

@Scopes(() => ({
  /**
   * Fetched the module associated with the GuideModuleBase.
   * To be used with {@link GuideModuleBaseWithModule}
   */
  [GuideModuleBaseModelScope.withModule]: () => ({
    include: [
      {
        required: true,
        model: Module,
      },
    ],
  }),
  [GuideModuleBaseModelScope.withStepBases]: () => ({
    include: [GuideStepBase.scope('byOrderIndex')],
  }),
  [GuideModuleBaseModelScope.byOrderIndex]: { order: [['orderIndex', 'ASC']] },
}))
@Table({
  schema: 'core',
  tableName: 'guide_module_bases',
  indexes: [
    {
      name: 'core_guide_module_bases_guide_base_id_created_from_module_id_key',
      unique: true,
      fields: ['guide_base_id', 'created_from_module_id'],
    },
  ],
})
/**
 * Represents a module at the GuideBase level.
 */
export class GuideModuleBase extends Model<
  InferAttributes<GuideModuleBase>,
  InferCreationAttributes<GuideModuleBase, { omit: 'createdAt' | 'updatedAt' }>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  /**
   * The name of the module, in case modified at the guide-base level.
   * Otherwise, the name should be retrieved from the Module.
   */
  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  readonly name?: CreationOptional<string | null>;

  @AllowNull(false)
  @Column({ field: 'order_index', type: DataType.INTEGER })
  readonly orderIndex!: number;

  @ForeignKey(() => GuideBase)
  @AllowNull(true)
  @Column({ field: 'guide_base_id', type: DataType.INTEGER })
  readonly guideBaseId!: number;

  @ForeignKey(() => Module)
  @AllowNull(true)
  @Column({ field: 'created_from_module_id', type: DataType.INTEGER })
  readonly createdFromModuleId?: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @AllowNull(true)
  @Column({ field: 'added_dynamically_at', type: DataType.DATE })
  readonly addedDynamicallyAt?: Date | null;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'created_by_user_id', type: DataType.INTEGER })
  readonly createdByUserId?: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'updated_by_user_id', type: DataType.INTEGER })
  readonly updatedByUserId?: number;

  /**
   * Prevent the module being auto added to new spawning guides
   */
  @Column({
    field: 'should_only_add_to_new_guides_dynamically',
    type: DataType.BOOLEAN,
  })
  readonly shouldOnlyAddToNewGuidesDynamically?: boolean;

  @BelongsTo(() => GuideBase)
  readonly guideBase!: NonAttribute<GuideBase>;

  @BelongsTo(() => Module)
  readonly createdFromModule?: NonAttribute<Module>;

  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;

  @HasMany(() => GuideStepBase)
  readonly guideStepBases!: NonAttribute<GuideStepBase[]>;

  @BelongsTo(() => User)
  readonly createdByUser!: NonAttribute<User>;

  @BelongsTo(() => User)
  readonly updatedByUser!: NonAttribute<User>;
}
