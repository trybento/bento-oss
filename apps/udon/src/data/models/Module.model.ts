import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { GuideFormFactor } from 'bento-common/types';
import { EnumColumn } from 'bento-common/utils/sequelize';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { ModuleStepPrototype } from './ModuleStepPrototype.model';
import { Organization } from './Organization.model';
import { StepPrototype } from './StepPrototype.model';
import { TemplateModule } from './TemplateModule.model';
import { User } from './User.model';
import { deprecatedSetter } from './common';

@Scopes(() => ({
  withModuleStepPrototypes: () => ({
    subQuery: false,
    include: [
      {
        model: ModuleStepPrototype.scope(['withStepPrototype', 'byOrderIndex']),
        as: 'moduleStepPrototypes',
      },
    ],
  }),
  withStepPrototypes: {
    include: [{ model: StepPrototype, order: [['orderIndex', 'ASC']] }],
  },
  /**
   * Fetches modules that are not part of any Templates.
   * Orphaned modules can be left behind when their usage is removed or their original template was removed.
   */
  orphan: {
    where: {
      '$templateModules.id$': {
        [Op.is]: null,
      },
    },
    include: [
      {
        model: TemplateModule,
        attributes: ['id'],
        required: false,
      },
    ],
  },
}))
/**
 * Represents a module at the Template level.
 */
@Table({ schema: 'core', tableName: 'modules' })
export class Module extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  readonly name?: string;

  @AllowNull(true)
  @Column({
    field: 'display_title',
    type: DataType.TEXT,
    set: deprecatedSetter('Module', 'displayTitle'),
  })
  /**
   * @deprecated use `name` instead
   * @todo remove after D+7
   */
  readonly displayTitle?: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  readonly description?: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(true)
  @Column({ field: 'is_cyoa', type: DataType.BOOLEAN })
  readonly isCyoa?: boolean;

  @AllowNull(true)
  @EnumColumn('created_from_form_factor', GuideFormFactor)
  readonly createdFromFormFactor?: GuideFormFactor;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'created_by_user_id', type: DataType.INTEGER })
  readonly createdByUserId!: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ field: 'updated_by_user_id', type: DataType.INTEGER })
  readonly updatedByUserId!: number;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsToMany(() => StepPrototype, () => ModuleStepPrototype)
  readonly stepPrototypes!: StepPrototype[];

  @HasMany(() => TemplateModule, {
    sourceKey: 'id',
    foreignKey: 'moduleId',
  })
  readonly templateModules?: TemplateModule[];

  @HasMany(() => ModuleStepPrototype)
  readonly moduleStepPrototypes!: ModuleStepPrototype[];

  @BelongsTo(() => User)
  readonly createdByUser!: User;

  @BelongsTo(() => User)
  readonly updatedByUser!: User;
}
