import { BulkCreateOptions, CreateOptions } from 'sequelize';
import {
  AllowNull,
  BeforeBulkCreate,
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import promises from 'src/utils/promises';
import { EnumColumn } from 'bento-common/utils/sequelize';
import {
  ContextTagType,
  ContextTagAlignment,
  ContextTagTooltipAlignment,
} from 'bento-common/types/globalShoyuState';
import { VisualTagStyleSettings } from 'bento-common/types';

import { CreatedAt, EntityId, UpdatedAt } from './columns';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Organization } from './Organization.model';
import { Template } from './Template.model';
import ModelUniqueConstraintError from 'src/errors/ModelUniqueConstraintError';
import { StepTaggedElement } from './StepTaggedElement.model';

@Table({ schema: 'core', tableName: 'step_prototype_tagged_elements' })
export class StepPrototypeTaggedElement extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => StepPrototype)
  @AllowNull(true)
  @Column({ field: 'step_prototype_id', type: DataType.INTEGER })
  readonly stepPrototypeId!: number | null;

  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @AllowNull(false)
  @Column({ field: 'url', type: DataType.TEXT })
  readonly url!: string;

  @AllowNull(false)
  @Column({ field: 'wildcard_url', type: DataType.TEXT })
  readonly wildcardUrl!: string;

  @AllowNull(false)
  @Column({ field: 'element_selector', type: DataType.TEXT })
  readonly elementSelector!: string;

  @AllowNull(true)
  @Column({ field: 'element_text', type: DataType.TEXT })
  readonly elementText?: string;

  @AllowNull(true)
  @Column({ field: 'element_html', type: DataType.TEXT })
  readonly elementHtml?: string;

  @AllowNull(false)
  @EnumColumn('type', ContextTagType)
  readonly type!: ContextTagType;

  @AllowNull(false)
  @EnumColumn('alignment', ContextTagAlignment)
  readonly alignment!: ContextTagAlignment;

  @AllowNull(false)
  @Column({ field: 'x_offset', type: DataType.INTEGER })
  readonly xOffset!: number;

  @AllowNull(false)
  @Column({ field: 'y_offset', type: DataType.INTEGER })
  readonly yOffset!: number;

  @AllowNull(false)
  @EnumColumn('tooltip_alignment', ContextTagType)
  readonly tooltipAlignment!: ContextTagTooltipAlignment;

  @AllowNull(false)
  @Column({ field: 'relative_to_text', type: DataType.BOOLEAN })
  readonly relativeToText!: boolean;

  @AllowNull(true)
  @Column({ field: 'style', type: DataType.JSONB })
  readonly style?: VisualTagStyleSettings;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations

  @BelongsTo(() => StepPrototype)
  readonly stepPrototype!: StepPrototype | null;

  @BelongsTo(() => Template)
  readonly template!: Template;

  @HasMany(() => StepTaggedElement)
  readonly stepTaggedElements!: StepTaggedElement[];

  // Hooks

  /**
   * Allows only a single instance of a tag per Template or Step,
   * since we shouldn't allow having multiple.
   *
   * WARNING: This is currently limited to only `create` and `bulkCreate` methods,
   * so you shouldn't use `upsert` unless another hook is created.
   */
  @BeforeCreate
  @BeforeBulkCreate
  static async preventDuplicates(
    instances: StepPrototypeTaggedElement | StepPrototypeTaggedElement[],
    options: CreateOptions | BulkCreateOptions
  ) {
    // when set to handle duplicates we shouldn't perform this checks, otherwise
    // we run the risk of negating an operation that should have succedded without
    // any side effects
    if (
      options.ignoreDuplicates ||
      (options as BulkCreateOptions).updateOnDuplicate
    ) {
      return;
    }

    if (!Array.isArray(instances)) {
      instances = [instances];
    }

    await promises.map(
      instances,
      async (instance) => {
        const conflicting = {
          organizationId: instance.organizationId,
          templateId: instance.templateId,
          stepPrototypeId: instance.stepPrototypeId || null,
        };

        const existingCount = await StepPrototypeTaggedElement.count({
          where: { ...conflicting },
        });

        if (existingCount) {
          throw new ModelUniqueConstraintError(
            instance.stepPrototypeId ? 'Step prototype tag' : 'Template tag',
            StepPrototypeTaggedElement.name,
            conflicting
          );
        }
      },
      {
        concurrency: 3,
      }
    );
  }
}
