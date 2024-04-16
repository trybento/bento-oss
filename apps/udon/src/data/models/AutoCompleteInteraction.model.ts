import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Scopes,
  BelongsTo,
  AssociationGetOptions,
  HasOne,
  Comment,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import {
  AutoCompleteInteractionCompletableType,
  AutoCompleteInteractionType,
} from 'bento-common/types/stepAutoComplete';

import { Organization } from './Organization.model';
import { StepPrototype } from './StepPrototype.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';
import AutoCompleteInteractionGuideCompletion from './AutoCompleteInteractionGuideCompletion.model';
import { Template } from './Template.model';

@Scopes(() => ({
  fromOrg: (organizationId: number) => ({
    where: { organizationId },
  }),
  fromAssociation: (
    organizationId: number,
    completableType: AutoCompleteInteractionCompletableType,
    completableId: number
  ) => ({
    where: { organizationId, completableType, completableId },
    order: [['createdAt', 'ASC']],
  }),
  guideCompletionsOfTemplate: (templateId: number) => ({
    where: {
      completableType: AutoCompleteInteractionCompletableType.stepPrototype,
      interactionType: AutoCompleteInteractionType.guideCompletion,
    },
    include: [
      {
        model: AutoCompleteInteractionGuideCompletion,
        where: { templateId },
        required: true,
      },
    ],
  }),
  guideCompletions: {
    where: {
      completableType: AutoCompleteInteractionCompletableType.stepPrototype,
      interactionType: AutoCompleteInteractionType.guideCompletion,
    },
    include: [
      {
        model: AutoCompleteInteractionGuideCompletion,
        required: true,
        include: [
          {
            model: Template,
            attributes: ['id', 'entityId', 'name'],
            required: true,
          },
        ],
      },
    ],
  },
}))
@Table({
  schema: 'core',
  tableName: 'auto_complete_interactions',
})
export default class AutoCompleteInteraction extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @Comment('Determines which type of interaction')
  @AllowNull(false)
  @EnumColumn('interaction_type', AutoCompleteInteractionType)
  readonly interactionType!: AutoCompleteInteractionType;

  @Comment('Entity type/name that completes after this interaction')
  @AllowNull(false)
  @EnumColumn('completable_type', AutoCompleteInteractionCompletableType)
  readonly completableType!: AutoCompleteInteractionCompletableType;

  @Comment('Entity id that completes after this interaction')
  @AllowNull(false)
  @Column({ field: 'completable_id', type: DataType.INTEGER })
  readonly completableId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations

  @BelongsTo(() => StepPrototype, {
    foreignKey: 'completableId',
    constraints: false,
  })
  readonly stepPrototype!: StepPrototype;

  @HasOne(() => AutoCompleteInteractionGuideCompletion)
  readonly ofGuideCompletions?: AutoCompleteInteractionGuideCompletion;

  // Methods

  getCompletable(options?: AssociationGetOptions) {
    switch (this.completableType) {
      case AutoCompleteInteractionCompletableType.stepPrototype:
        return this.$get('stepPrototype', options);

      default:
        return Promise.resolve(null);
    }
  }
}
