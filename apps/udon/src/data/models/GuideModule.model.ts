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
  HasMany,
  ForeignKey,
  Model,
  Table,
  Scopes,
} from 'sequelize-typescript';

import { Guide } from './Guide.model';
import { GuideModuleBase } from './GuideModuleBase.model';
import { Module } from './Module.model';
import { Organization } from './Organization.model';
import { Step } from './Step.model';
import { EntityId, CreatedAt, UpdatedAt, DeletedAt } from './columns';

export enum GuideModuleModelScope {
  withBase = 'withGuideModuleBase',
  withModule = 'withModule',
  byOrderIndex = 'byOrderIndex',
  withSteps = 'withSteps',
}

export type GuideModuleWithBase<T = GuideModule, B = GuideModuleBase> = T & {
  createdFromGuideModuleBase: B;
};

export type GuideModuleWithModule<T = GuideModule, M = Module> = T & {
  createdFromModule: M;
};

@Scopes(() => ({
  [GuideModuleModelScope.byOrderIndex]: {
    include: [
      {
        required: true,
        model: GuideModuleBase,
        order: [['orderIndex', 'ASC']],
      },
    ],
  },
  /**
   * Fetches the GuideModuleBase associated with the GuideModule.
   * To be used with {@link GuideModuleWithBase}
   */
  [GuideModuleModelScope.withBase]: {
    include: [
      {
        required: true,
        model: GuideModuleBase,
        order: [['orderIndex', 'ASC']],
      },
    ],
  },
  /**
   * Fetches the Module associated with the GuideModule.
   * To be used with {@link GuideModuleWithModule}
   */
  [GuideModuleModelScope.withModule]: {
    include: [
      {
        required: true,
        model: Module,
      },
    ],
  },
  [GuideModuleModelScope.withSteps]: () => ({
    include: [Step.scope('byOrderIndex')],
  }),
}))
@Table({
  schema: 'core',
  tableName: 'guide_modules',
  paranoid: true,
  indexes: [
    {
      name: 'core_guide_modules_guide_id_created_from_module_id_key',
      unique: true,
      fields: ['guide_id', 'created_from_module_id'],
    },
  ],
})
/**
 * Represents a module at the Guide level.
 */
export class GuideModule extends Model<
  InferAttributes<GuideModule>,
  InferCreationAttributes<
    GuideModule,
    { omit: 'createdAt' | 'updatedAt' | 'deletedAt' }
  >
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  /** @deprecated use it from guideModuleBase or Module instead */
  readonly name?: CreationOptional<string | null>;

  /**
   * Keeps the order index of the module in the guide.
   *
   * NOTE: Since GuideModuleBase will keep records at the "account" level, those can't be trusted
   * to lookup the order index of the module in the guide, otherwise could lead to inconsistency due to
   * Step Groups branching.
   */
  @AllowNull(false)
  @Column({ field: 'order_index', type: DataType.INTEGER })
  readonly orderIndex!: CreationOptional<number>;

  @ForeignKey(() => Guide)
  @AllowNull(true)
  @Column({ field: 'guide_id', type: DataType.INTEGER })
  readonly guideId!: number;

  @ForeignKey(() => GuideModuleBase)
  @AllowNull(false)
  @Column({
    field: 'created_from_guide_module_base_id',
    type: DataType.INTEGER,
  })
  readonly createdFromGuideModuleBaseId?: number;

  @ForeignKey(() => Module)
  @AllowNull(true)
  @Column({ field: 'created_from_module_id', type: DataType.INTEGER })
  readonly createdFromModuleId?: number;

  @AllowNull(true)
  @Column({ field: 'completed_at', type: DataType.DATE })
  readonly completedAt?: CreationOptional<Date | null>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @DeletedAt
  declare deletedAt?: Date;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @BelongsTo(() => Guide)
  readonly guide!: NonAttribute<Guide>;

  @BelongsTo(() => GuideModuleBase)
  readonly createdFromGuideModuleBase?: NonAttribute<GuideModuleBase>;

  @BelongsTo(() => Module)
  readonly createdFromModule?: NonAttribute<Module>;

  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;

  @HasMany(() => Step)
  readonly steps!: NonAttribute<Step[]>;
}
