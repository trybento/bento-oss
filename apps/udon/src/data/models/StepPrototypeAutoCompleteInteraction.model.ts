import { CreatedAt, EntityId, UpdatedAt } from './columns';
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

import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Organization } from './Organization.model';
import { StepAutoCompleteInteractionType } from 'bento-common/types';

@Table({
  schema: 'core',
  tableName: 'step_prototype_auto_complete_interactions',
})
export class StepPrototypeAutoCompleteInteraction extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => StepPrototype)
  @AllowNull(false)
  @Column({ field: 'step_prototype_id', type: DataType.INTEGER })
  readonly stepPrototypeId!: number;

  @AllowNull(false)
  @Column({ field: 'url', type: DataType.TEXT })
  readonly url!: string;

  @AllowNull(false)
  @Column({ field: 'wildcard_url', type: DataType.TEXT })
  readonly wildcardUrl!: string;

  @AllowNull(false)
  @EnumColumn('type', StepAutoCompleteInteractionType)
  readonly type!: StepAutoCompleteInteractionType;

  @AllowNull(false)
  @Column({ field: 'element_selector', type: DataType.TEXT })
  readonly elementSelector!: string;

  @AllowNull(true)
  @Column({ field: 'element_text', type: DataType.TEXT })
  readonly elementText?: string;

  @AllowNull(true)
  @Column({ field: 'element_html', type: DataType.TEXT })
  readonly elementHtml?: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @BelongsTo(() => StepPrototype)
  readonly stepPrototype!: StepPrototype;
}
