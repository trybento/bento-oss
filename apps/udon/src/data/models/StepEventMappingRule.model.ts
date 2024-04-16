import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';

import { Organization } from './Organization.model';
import { StepEventMapping } from './StepEventMapping.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';

import { AttributeValueType } from './types';
import { LongRuleTypeEnum } from 'bento-common/types';

/**
 * NOTE: This will likely point to the new data model (AutoCompleteInteraction) in the near future.
 */
@Table({ schema: 'core', tableName: 'step_event_mapping_rules' })
export class StepEventMappingRule extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @AllowNull(false)
  @ForeignKey(() => StepEventMapping)
  @Column({ field: 'step_event_mapping_id', type: DataType.INTEGER })
  readonly stepEventMappingId?: number;

  @AllowNull(false)
  @Column({ field: 'property_name', type: DataType.TEXT })
  readonly propertyName!: string;

  @AllowNull(false)
  @EnumColumn('value_type', AttributeValueType)
  readonly valueType!: AttributeValueType;

  @AllowNull(false)
  @EnumColumn('rule_type', LongRuleTypeEnum)
  readonly ruleType!: LongRuleTypeEnum;

  @AllowNull(true)
  @Column({ field: 'number_value', type: DataType.INTEGER })
  readonly numberValue?: number;

  @AllowNull(true)
  @Column({ field: 'text_value', type: DataType.TEXT })
  readonly textValue?: string;

  @AllowNull(true)
  @Column({ field: 'boolean_value', type: DataType.BOOLEAN })
  readonly booleanValue?: boolean;

  @AllowNull(true)
  @Column({ field: 'date_value', type: DataType.DATE })
  readonly dateValue?: Date;

  @AllowNull(false)
  @ForeignKey(() => Organization)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations
  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => StepEventMapping)
  readonly stepEventMapping!: StepEventMapping;
}
