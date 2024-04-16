import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Template } from './Template.model';
import { Organization } from './Organization.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

@Table({ schema: 'core', tableName: 'template_split_targets' })
export class TemplateSplitTarget extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  /**
   * The source template should always be a split test type
   */
  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'source_template_id', type: DataType.INTEGER })
  readonly sourceTemplateId!: number;

  @ForeignKey(() => Template)
  @AllowNull(true)
  @Column({ field: 'destination_template_id', type: DataType.INTEGER })
  readonly destinationTemplateId!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @Column({
    field: 'triggered_times',
    type: DataType.INTEGER,
    comment: 'Times this path has been triggered',
  })
  readonly triggeredTimes?: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS

  @BelongsTo(() => Template, 'source_template_id')
  readonly sourceTemplate!: Template;

  @BelongsTo(() => Template, 'destination_template_id')
  readonly destinationTemplate?: Template;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
