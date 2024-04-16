import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import {
  GroupCondition,
  InjectionAlignment,
  InjectionPosition,
  InlineEmbedState,
  InlineEmbedTargeting,
  TargetingType,
} from 'bento-common/types';

import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Organization } from './Organization.model';
import { Template } from './Template.model';

@Scopes(() => ({
  active: {
    where: {
      state: InlineEmbedState.active,
    },
  },
  global: {
    where: {
      templateId: null,
    },
  },
  withTemplate: {
    include: [
      {
        model: Template,
        required: true,
      },
    ],
  },
  withOptionalTemplate: {
    include: [Template],
  },
  ofTemplate: (templateId: number) => ({
    where: {
      templateId,
    },
    include: [Template],
  }),
}))
@Table({ schema: 'core', tableName: 'organization_inline_embeds' })
export default class OrganizationInlineEmbed extends Model<
  InferAttributes<OrganizationInlineEmbed>,
  InferCreationAttributes<OrganizationInlineEmbed>
> {
  declare readonly id: CreationOptional<number>;

  @EntityId
  declare readonly entityId: CreationOptional<string>;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  declare readonly organizationId: number;

  @ForeignKey(() => Template)
  @AllowNull(true)
  @Column({ field: 'template_id', type: DataType.INTEGER })
  declare readonly templateId: CreationOptional<number | null>;

  @AllowNull(false)
  @Column({ field: 'url', type: DataType.TEXT })
  declare readonly url: string;

  @AllowNull(false)
  @Column({ field: 'wildcard_url', type: DataType.TEXT })
  declare readonly wildcardUrl: string;

  @AllowNull(false)
  @Column({ field: 'element_selector', type: DataType.TEXT })
  declare readonly elementSelector: string;

  @AllowNull(false)
  @EnumColumn('position', InjectionPosition)
  declare readonly position: InjectionPosition;

  @AllowNull(false)
  @Column({ field: 'top_margin', type: DataType.INTEGER })
  declare readonly topMargin: number;

  @AllowNull(false)
  @Column({ field: 'right_margin', type: DataType.INTEGER })
  declare readonly rightMargin: number;

  @AllowNull(false)
  @Column({ field: 'bottom_margin', type: DataType.INTEGER })
  declare readonly bottomMargin: number;

  @AllowNull(false)
  @Column({ field: 'left_margin', type: DataType.INTEGER })
  declare readonly leftMargin: number;

  @AllowNull(true)
  @EnumColumn('alignment', InjectionAlignment)
  declare readonly alignment: CreationOptional<InjectionAlignment>;

  @AllowNull(true)
  @Column({ field: 'max_width', type: DataType.INTEGER })
  declare readonly maxWidth: CreationOptional<number>;

  @AllowNull(false)
  @Column({ field: 'padding', type: DataType.INTEGER })
  declare readonly padding: number;

  @AllowNull(false)
  @Column({ field: 'border_radius', type: DataType.INTEGER })
  declare readonly borderRadius: number;

  /** @todo could be null for template specific inline placements */
  @Default({
    account: {
      type: TargetingType.all,
      rules: [],
      grouping: GroupCondition.all,
    },
    accountUser: {
      type: TargetingType.all,
      rules: [],
      grouping: GroupCondition.all,
    },
  })
  @Column({ field: 'targeting', type: DataType.JSONB })
  declare readonly targeting: CreationOptional<InlineEmbedTargeting>;

  @AllowNull(false)
  @Default(InlineEmbedState.inactive)
  @EnumColumn('state', InlineEmbedState)
  declare readonly state: CreationOptional<InlineEmbedState>;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  // Associations

  @BelongsTo(() => Template)
  declare readonly template: CreationOptional<Template>;
}
