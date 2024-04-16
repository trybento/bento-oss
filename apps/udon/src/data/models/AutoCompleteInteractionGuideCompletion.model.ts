import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Scopes,
  BelongsTo,
  Comment,
} from 'sequelize-typescript';

import { Organization } from './Organization.model';
import AutoCompleteInteraction from './AutoCompleteInteraction.model';
import { Template } from './Template.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

@Scopes(() => ({
  fromTemplate: (templateId: number) => ({
    where: { templateId },
    order: [['createdAt', 'ASC']],
  }),
}))
@Table({
  schema: 'core',
  tableName: 'auto_complete_interaction_guide_completions',
})
export default class AutoCompleteInteractionGuideCompletion extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => AutoCompleteInteraction)
  @AllowNull(false)
  @Column({ field: 'auto_complete_interaction_id', type: DataType.INTEGER })
  readonly autoCompleteInteractionId!: number;

  @Comment('Template that triggers the step auto-completion')
  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations

  @BelongsTo(() => AutoCompleteInteraction)
  readonly autoCompleteInteraction!: AutoCompleteInteraction;

  @BelongsTo(() => Template)
  readonly template!: Template;
}
