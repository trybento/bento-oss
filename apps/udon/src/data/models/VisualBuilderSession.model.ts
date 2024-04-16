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
} from 'sequelize';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { EntityId, CreatedAt, UpdatedAt } from './columns';
import { Organization } from './Organization.model';
import { User } from './User.model';
import {
  WysiwygEditorState,
  VisualBuilderSessionType,
  VisualBuilderSessionState,
} from 'bento-common/types';
import { FullGuide } from 'bento-common/types/globalShoyuState';

@Table({ schema: 'core', tableName: 'visual_builder_sessions' })
export class VisualBuilderSession extends Model<
  InferAttributes<VisualBuilderSession>,
  InferCreationAttributes<VisualBuilderSession>
> {
  readonly id!: CreationOptional<number>;

  @EntityId
  readonly entityId!: CreationOptional<string>;

  @AllowNull(false)
  @EnumColumn('type', VisualBuilderSessionType)
  readonly type!: VisualBuilderSessionType;

  @AllowNull(false)
  @EnumColumn('state', VisualBuilderSessionState)
  readonly state!: VisualBuilderSessionState;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  readonly userId!: number;

  @AllowNull(true)
  @Column({ field: 'initial_data', type: DataType.JSONB })
  readonly initialData!: WysiwygEditorState<unknown>;

  @AllowNull(true)
  @Column({ field: 'progress_data', type: DataType.JSONB })
  readonly progressData?: CreationOptional<WysiwygEditorState<unknown>>;

  @AllowNull(true)
  @Column({ field: 'preview_data', type: DataType.JSONB })
  readonly previewData?: CreationOptional<FullGuide>;

  @CreatedAt
  readonly createdAt!: CreationOptional<Date>;

  @UpdatedAt
  readonly updatedAt!: CreationOptional<Date>;

  @BelongsTo(() => Organization)
  readonly organization!: CreationOptional<Organization>;

  @BelongsTo(() => User)
  readonly user!: CreationOptional<User>;
}
