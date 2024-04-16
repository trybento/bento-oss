import { BulkCreateOptions, CreateOptions, Op } from 'sequelize';
import {
  AllowNull,
  BeforeBulkCreate,
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import promises from 'src/utils/promises';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { VisualTagStyleSettings } from 'bento-common/types';
import {
  ContextTagType,
  ContextTagAlignment,
  ContextTagTooltipAlignment,
} from 'bento-common/types/globalShoyuState';

import { UpdatedAt, CreatedAt, EntityId } from './columns';
import { Step } from 'src/data/models/Step.model';
import { Guide } from './Guide.model';
import { Organization } from './Organization.model';
import ModelUniqueConstraintError from 'src/errors/ModelUniqueConstraintError';
import { GuideBase } from './GuideBase.model';
import { GuideStepBase } from './GuideStepBase.model';
import { StepPrototypeTaggedElement } from './StepPrototypeTaggedElement.model';

@Scopes(() => ({
  /**
   * Filter-out non-active tags, based on ANY of the following criteria:
   * - GuideBase/Guide is null, indicating they were removed
   * - Prototype is null, indicating it was removed
   */
  active: {
    where: {
      guideBaseId: { [Op.ne]: null },
      guideId: { [Op.ne]: null },
      createdFromPrototypeId: { [Op.ne]: null },
    },
  },
  /**
   * The opposite of active. Useful for returning tags that should be removed
   * from the database.
   */
  inactive: {
    where: {
      [Op.or]: [
        { guideBaseId: null },
        { guideId: null },
        { createdFromPrototypeId: null },
      ],
    },
  },
}))
@Table({ schema: 'core', tableName: 'step_tagged_elements' })
export class StepTaggedElement extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  /** Can only be null in case of guide base removed, which should indicate this can be removed as well */
  @ForeignKey(() => GuideBase)
  @AllowNull(true)
  @Column({ field: 'guide_base_id', type: DataType.INTEGER })
  readonly guideBaseId!: number | null;

  /** Can only be null in case of guide removed, which should indicate this can be removed as well */
  @ForeignKey(() => Guide)
  @AllowNull(true)
  @Column({ field: 'guide_id', type: DataType.INTEGER })
  readonly guideId!: number | null;

  /** Can be null in case of Guide-level tag or reference removed */
  @ForeignKey(() => GuideStepBase)
  @AllowNull(true)
  @Column({ field: 'guide_base_step_id', type: DataType.INTEGER })
  readonly guideBaseStepId!: number | null;

  /** Can be null in case of Guide-level tag or reference removed */
  @ForeignKey(() => Step)
  @AllowNull(true)
  @Column({ field: 'step_id', type: DataType.INTEGER })
  readonly stepId!: number | null;

  /** Can only be null in case of prototype removed, which should make this UNAVAILABLE and eligible for removal */
  @ForeignKey(() => StepPrototypeTaggedElement)
  @AllowNull(true)
  @Column({ field: 'created_from_prototype_id', type: DataType.INTEGER })
  readonly createdFromPrototypeId!: number | null;

  @AllowNull(false)
  @Column({ field: 'url', type: DataType.TEXT })
  /** @deprecated use it from StepPrototypeTaggedElement instead */
  readonly url!: string;

  @AllowNull(false)
  @Column({ field: 'wildcard_url', type: DataType.TEXT })
  /** @deprecated use it from StepPrototypeTaggedElement instead */
  readonly wildcardUrl!: string;

  @AllowNull(false)
  @Column({ field: 'element_selector', type: DataType.TEXT })
  /** @deprecated use it from StepPrototypeTaggedElement instead */
  readonly elementSelector!: string;

  @AllowNull(false)
  @EnumColumn('type', ContextTagType)
  /** @deprecated use it from StepPrototypeTaggedElement instead */
  readonly type!: ContextTagType;

  @AllowNull(false)
  @EnumColumn('alignment', ContextTagAlignment)
  /** @deprecated use it from StepPrototypeTaggedElement instead */
  readonly alignment!: ContextTagAlignment;

  @AllowNull(false)
  @Column({ field: 'x_offset', type: DataType.INTEGER })
  /** @deprecated use it from StepPrototypeTaggedElement instead */
  readonly xOffset!: number;

  @AllowNull(false)
  @Column({ field: 'y_offset', type: DataType.INTEGER })
  /** @deprecated use it from StepPrototypeTaggedElement instead */
  readonly yOffset!: number;

  @AllowNull(false)
  @EnumColumn('tooltip_alignment', ContextTagTooltipAlignment)
  /** @deprecated use it from StepPrototypeTaggedElement instead */
  readonly tooltipAlignment?: ContextTagTooltipAlignment;

  @AllowNull(false)
  @Column({ field: 'relative_to_text', type: DataType.BOOLEAN })
  /** @deprecated use it from StepPrototypeTaggedElement instead */
  readonly relativeToText!: boolean;

  @AllowNull(true)
  @Column({ field: 'style', type: DataType.JSONB })
  /** @deprecated use it from StepPrototypeTaggedElement instead */
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

  @BelongsTo(() => Step)
  readonly step?: Step | null;

  @BelongsTo(() => GuideBase)
  readonly guideBase?: GuideBase | null;

  @BelongsTo(() => Guide)
  readonly guide?: Guide | null;

  @BelongsTo(() => StepPrototypeTaggedElement)
  readonly stepPrototypeTaggedElement?: StepPrototypeTaggedElement | null;

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
    instances: StepTaggedElement | StepTaggedElement[],
    options: CreateOptions | BulkCreateOptions
  ) {
    // when set to handle duplicates we shouldn't perform this checks, otherwise
    // we run the risk of negating an operation that should have succeeded without
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
          guideId: instance.guideId,
          stepId: instance.stepId || null,
        };

        const existingCount = await StepTaggedElement.count({
          where: { ...conflicting },
        });

        if (existingCount) {
          throw new ModelUniqueConstraintError(
            instance.stepId ? 'Step tag' : 'Guide tag',
            StepTaggedElement.name,
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
