import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { Organization } from './Organization.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Template } from './Template.model';
import { IntegrationType } from './IntegrationApiKey.model';

@Table({
  schema: 'core',
  tableName: 'integration_template_selections',
})
export default class IntegrationTemplateSelection extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @AllowNull(false)
  @EnumColumn('type', IntegrationType)
  readonly type!: IntegrationType;

  @Default({})
  @Column({ field: 'options', type: DataType.JSONB })
  readonly options!: object;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @BelongsTo(() => Template)
  readonly template!: Template;
}
