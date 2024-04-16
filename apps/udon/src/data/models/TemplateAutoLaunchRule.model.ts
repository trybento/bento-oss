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
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { Template } from './Template.model';
import { Organization } from './Organization.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { TargetingType } from 'bento-common/types';
import { RawRule } from 'bento-common/types/targeting';

@Table({ schema: 'core', tableName: 'template_auto_launch_rules' })
export class TemplateAutoLaunchRule extends Model<
  InferAttributes<TemplateAutoLaunchRule>,
  InferCreationAttributes<TemplateAutoLaunchRule>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @ForeignKey(() => Template)
  @AllowNull(false)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  readonly templateId!: number;

  @Default(TargetingType.all)
  @EnumColumn('rule_type', TargetingType)
  readonly ruleType!: CreationOptional<TargetingType>;

  @Default([])
  @Column({ field: 'rules', type: DataType.JSONB })
  readonly rules!: CreationOptional<RawRule[]>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  // ASSOCIATIONS
  @BelongsTo(() => Template)
  readonly template!: CreationOptional<Template>;

  @BelongsTo(() => Organization)
  readonly organization!: CreationOptional<Organization>;
}
