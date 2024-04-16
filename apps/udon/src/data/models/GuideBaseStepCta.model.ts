import {
  CreationOptional,
  Includeable,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Op,
} from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { EnumColumn } from 'bento-common/utils/sequelize';
import { StepCtaSettings, StepCtaStyle, StepCtaType } from 'bento-common/types';

import { CreatedAt, EntityId, UpdatedAt } from './columns';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { Organization } from 'src/data/models/Organization.model';
import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import { Template } from 'src/data/models/Template.model';

export enum GuideBaseStepCtaModelScope {
  active = 'active',
  orphan = 'orphan',
  withPrototype = 'withPrototype',
}

export type GuideBaseStepCtaWithPrototype<T = GuideBaseStepCta> = T & {
  stepPrototypeCta: StepPrototypeCta;
};

@Scopes(() => ({
  /**
   * Find instances attached to a StepPrototypeCta, which indicates
   * they're still valid and should be treated as such.
   */
  [GuideBaseStepCtaModelScope.active]: () => ({
    where: {
      createdFromStepPrototypeCtaId: {
        [Op.ne]: null,
      },
    },
  }),
  /**
   * Find instances detached from a StepPrototypeCta, which indicates
   * they should be removed.
   */
  [GuideBaseStepCtaModelScope.orphan]: () => ({
    where: {
      createdFromStepPrototypeCtaId: null,
    },
  }),
  /**
   * Includes the associated StepPrototypeCta from which this was created.
   * To be used with {@link GuideBaseStepCtaWithPrototype}
   */
  [GuideBaseStepCtaModelScope.withPrototype]: (
    includeOptions: Exclude<Includeable, string> = {}
  ) => ({
    include: [
      {
        required: true,
        model: StepPrototypeCta,
        ...includeOptions,
      },
    ],
  }),
}))
@Table({ schema: 'core', tableName: 'guide_base_step_ctas' })
export class GuideBaseStepCta extends Model<
  InferAttributes<GuideBaseStepCta>,
  InferCreationAttributes<GuideBaseStepCta, { omit: 'createdAt' | 'updatedAt' }>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @ForeignKey(() => GuideStepBase)
  @AllowNull(false)
  @Column({ field: 'guide_base_step_id', type: DataType.INTEGER })
  readonly guideBaseStepId!: number;

  @ForeignKey(() => StepPrototypeCta)
  @AllowNull(true)
  @Column({
    field: 'created_from_step_prototype_cta_id',
    type: DataType.INTEGER,
  })
  readonly createdFromStepPrototypeCtaId?: number | null;

  @AllowNull(true)
  @Column({ field: 'text', type: DataType.TEXT })
  /** @deprecated use it from StepPrototypeCta instead */
  readonly text?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({ field: 'url', type: DataType.TEXT })
  /** @deprecated use it from StepPrototypeCta instead */
  readonly url?: CreationOptional<string | null>;

  @ForeignKey(() => Template)
  @AllowNull(true)
  @Column({
    field: 'launchable_template_id',
    type: DataType.INTEGER,
    comment: 'The template to be launched by this cta, if any',
  })
  /** @deprecated use it from StepPrototypeCta instead */
  readonly launchableTemplateId?: CreationOptional<number | null>;

  @AllowNull(true)
  @EnumColumn('type', StepCtaType)
  /** @deprecated use it from StepPrototypeCta instead */
  readonly type?: CreationOptional<StepCtaType | null>;

  @AllowNull(true)
  @EnumColumn('style', StepCtaStyle)
  /** @deprecated use it from StepPrototypeCta instead */
  readonly style?: CreationOptional<StepCtaStyle | null>;

  @AllowNull(true)
  @Column({ field: 'settings', type: DataType.JSONB })
  /** @deprecated use it from StepPrototypeCta instead */
  readonly settings?: CreationOptional<StepCtaSettings | null>;

  @AllowNull(true)
  @Column({ field: 'order_index', type: DataType.INTEGER })
  /** @deprecated use it from StepPrototypeCta instead */
  readonly orderIndex!: CreationOptional<number | null>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // associations

  @BelongsTo(() => GuideStepBase)
  readonly guideBaseStep?: NonAttribute<GuideStepBase>;

  @BelongsTo(() => StepPrototypeCta)
  readonly stepPrototypeCta?: NonAttribute<StepPrototypeCta>;

  @BelongsTo(() => Template)
  readonly template?: NonAttribute<Template>;
}
