import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

import { RuleTypeEnum } from 'bento-common/types';

import { Template } from './Template.model';
import { Organization } from './Organization.model';
import { Audience } from './Audience.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

@Table({
  schema: 'core',
  tableName: 'template_audiences',
})
export class TemplateAudience extends Model<
  InferAttributes<TemplateAudience>,
  InferCreationAttributes<TemplateAudience, { omit: 'createdAt' | 'updatedAt' }>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @ForeignKey(() => Audience)
  @AllowNull(false)
  @Column({ field: 'audience_entity_id', type: DataType.UUIDV4 })
  readonly audienceEntityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @AllowNull(false)
  @Column({ field: 'group_index', type: DataType.INTEGER })
  readonly groupIndex!: number;

  @AllowNull(false)
  @Column({ field: 'rule_type', type: DataType.TEXT })
  readonly ruleType!: RuleTypeEnum;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS

  @BelongsTo(() => Template)
  readonly template!: NonAttribute<Template>;

  @BelongsTo(() => Audience)
  readonly audience!: NonAttribute<Audience>;

  @BelongsTo(() => Organization)
  readonly organization!: NonAttribute<Organization>;
}
