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
import { StepCtaSettings, StepCtaStyle, StepCtaType } from 'bento-common/types';

import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';

@Table({ schema: 'core', tableName: 'step_prototype_ctas' })
export class StepPrototypeCta extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => StepPrototype)
  @AllowNull(false)
  @Column({ field: 'step_prototype_id', type: DataType.INTEGER })
  readonly stepPrototypeId!: number;

  @AllowNull(false)
  @Column({ field: 'text', type: DataType.TEXT })
  readonly text!: string;

  @AllowNull(true)
  @Column({ field: 'url', type: DataType.TEXT })
  readonly url?: string;

  @ForeignKey(() => Template)
  @AllowNull(true)
  @Column({
    field: 'launchable_template_id',
    type: DataType.INTEGER,
    comment: 'The template to be launched by this cta, if any',
  })
  readonly launchableTemplateId?: number;

  @AllowNull(false)
  @EnumColumn('type', StepCtaType)
  readonly type!: StepCtaType;

  @AllowNull(false)
  @EnumColumn('style', StepCtaStyle)
  readonly style!: StepCtaStyle;

  @AllowNull(false)
  @Column({ field: 'settings', type: DataType.JSONB })
  readonly settings!: StepCtaSettings;

  @AllowNull(false)
  @Column({ field: 'order_index', type: DataType.INTEGER })
  readonly orderIndex!: number;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // associations

  @BelongsTo(() => StepPrototype)
  readonly stepPrototype!: StepPrototype;

  @BelongsTo(() => Template)
  readonly template?: Template;
}
