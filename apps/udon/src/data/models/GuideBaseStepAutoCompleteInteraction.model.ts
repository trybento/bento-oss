import { CreationOptional, NonAttribute, Op } from 'sequelize';
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
import { StepAutoCompleteInteractionType } from 'bento-common/types';

import { CreatedAt, EntityId, UpdatedAt } from './columns';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { Organization } from './Organization.model';
import { StepPrototypeAutoCompleteInteraction } from './StepPrototypeAutoCompleteInteraction.model';
import { deprecatedSetter } from './common';

export enum GuideBaseStepAutoCompleteInteractionModelScopes {
  active = 'active',
  orphan = 'orphan',
}

@Scopes(() => ({
  /**
   * Find instances attached to a StepPrototypeAutoCompleteInteraction, which indicates
   * they're still valid and should be treated as such.
   */
  [GuideBaseStepAutoCompleteInteractionModelScopes.active]: () => ({
    where: {
      createdFromSpacInteractionId: {
        [Op.ne]: null,
      },
    },
  }),
  /**
   * Find instances detached from a StepPrototypeAutoCompleteInteraction, which indicates
   * they should be removed.
   */
  [GuideBaseStepAutoCompleteInteractionModelScopes.orphan]: () => ({
    where: {
      createdFromSpacInteractionId: null,
    },
  }),
}))
@Table({
  schema: 'core',
  tableName: 'guide_base_step_auto_complete_interactions',
})
export class GuideBaseStepAutoCompleteInteraction extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => GuideStepBase)
  @AllowNull(false)
  @Column({ field: 'guide_base_step_id', type: DataType.INTEGER })
  readonly guideBaseStepId!: number;

  @ForeignKey(() => StepPrototypeAutoCompleteInteraction)
  @AllowNull(true)
  @Column({
    field: 'created_from_step_prototype_auto_complete_interaction_id',
    type: DataType.INTEGER,
  })
  readonly createdFromSpacInteractionId?: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(true)
  @Column({
    field: 'url',
    type: DataType.TEXT,
    set: deprecatedSetter('GuideBaseStepAutoCompleteInteraction', 'url'),
  })
  /** @deprecated use it from StepPrototypeAutoCompleteInteraction instead */
  readonly url?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({
    field: 'wildcard_url',
    type: DataType.TEXT,

    set: deprecatedSetter(
      'GuideBaseStepAutoCompleteInteraction',
      'wildcardUrl'
    ),
  })
  /** @deprecated use it from StepPrototypeAutoCompleteInteraction instead */
  readonly wildcardUrl?: CreationOptional<string | null>;

  @AllowNull(true)
  @EnumColumn('type', StepAutoCompleteInteractionType, {
    set: deprecatedSetter('GuideBaseStepAutoCompleteInteraction', 'type'),
  })
  /** @deprecated use it from StepPrototypeAutoCompleteInteraction instead */
  readonly type?: CreationOptional<StepAutoCompleteInteractionType | null>;

  @AllowNull(true)
  @Column({
    field: 'element_selector',
    type: DataType.TEXT,
    set: deprecatedSetter(
      'GuideBaseStepAutoCompleteInteraction',
      'elementSelector'
    ),
  })
  /** @deprecated use it from StepPrototypeAutoCompleteInteraction instead */
  readonly elementSelector?: CreationOptional<string | null>;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @BelongsTo(() => GuideStepBase)
  readonly guideBaseStep!: NonAttribute<GuideStepBase>;

  @BelongsTo(() => StepPrototypeAutoCompleteInteraction)
  readonly stepPrototypeAutoCompleteInteraction?: NonAttribute<StepPrototypeAutoCompleteInteraction>;
}
