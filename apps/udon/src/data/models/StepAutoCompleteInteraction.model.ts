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
import { Organization } from './Organization.model';
import { Step } from './Step.model';
import { GuideBaseStepAutoCompleteInteraction } from './GuideBaseStepAutoCompleteInteraction.model';
import { deprecatedSetter } from './common';

export enum StepAutoCompleteInteractionModelScopes {
  active = 'active',
  orphan = 'orphan',
}

/**
 * This should be migrated over to the new data model in the near future.
 * @deprecated use `AutoCompleteInteraction` instead
 */

@Scopes(() => ({
  /**
   * Find instances attached to a GuideBaseStepAutoCompleteInteraction, which indicates
   * they're still valid and should be treated as such.
   */
  [StepAutoCompleteInteractionModelScopes.active]: () => ({
    where: {
      createdFromGuideBaseStepAutoCompleteInteractionId: {
        [Op.ne]: null,
      },
    },
  }),
  /**
   * Find instances detached from a GuideBaseStepAutoCompleteInteraction, which indicates
   * they should be removed.
   */
  [StepAutoCompleteInteractionModelScopes.orphan]: () => ({
    where: {
      createdFromGuideBaseStepAutoCompleteInteractionId: null,
    },
  }),
}))
@Table({
  schema: 'core',
  tableName: 'step_auto_complete_interactions',
})
export class StepAutoCompleteInteraction extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Step)
  @AllowNull(false)
  @Column({ field: 'step_id', type: DataType.INTEGER })
  readonly stepId!: number;

  @ForeignKey(() => GuideBaseStepAutoCompleteInteraction)
  @AllowNull(true)
  @Column({
    field: 'created_from_guide_base_step_auto_complete_interaction_id',
    type: DataType.INTEGER,
  })
  readonly createdFromGuideBaseStepAutoCompleteInteractionId?: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(true)
  @Column({
    field: 'url',
    type: DataType.TEXT,
    set: deprecatedSetter('StepAutoCompleteInteraction', 'url'),
  })
  /** @deprecated use it from StepPrototypeAutoCompleteInteraction instead */
  readonly url?: CreationOptional<string | null>;

  @AllowNull(true)
  @Column({
    field: 'wildcard_url',
    type: DataType.TEXT,
    set: deprecatedSetter('StepAutoCompleteInteraction', 'wildcardUrl'),
  })
  /** @deprecated use it from StepPrototypeAutoCompleteInteraction instead */
  readonly wildcardUrl?: CreationOptional<string | null>;

  @AllowNull(true)
  @EnumColumn('type', StepAutoCompleteInteractionType, {
    set: deprecatedSetter('StepAutoCompleteInteraction', 'type'),
  })
  /** @deprecated use it from StepPrototypeAutoCompleteInteraction instead */
  readonly type?: CreationOptional<StepAutoCompleteInteractionType | null>;

  @AllowNull(true)
  @Column({
    field: 'element_selector',
    type: DataType.TEXT,
    set: deprecatedSetter('StepAutoCompleteInteraction', 'elementSelector'),
  })
  /** @deprecated use it from StepPrototypeAutoCompleteInteraction instead */
  readonly elementSelector?: CreationOptional<string | null>;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @BelongsTo(() => Step)
  readonly step!: Step;

  @BelongsTo(() => GuideBaseStepAutoCompleteInteraction)
  readonly guideBaseStepAutoCompleteInteraction?: NonAttribute<GuideBaseStepAutoCompleteInteraction>;
}
