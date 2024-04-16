import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
  AssociationGetOptions,
  Comment,
  Default,
  Scopes,
} from 'sequelize-typescript';
import { EnumColumn } from 'bento-common/utils/sequelize';
import { Organization } from './Organization.model';
import { StepPrototype } from './StepPrototype.model';
import { EntityId, CreatedAt, UpdatedAt } from './columns';
import {
  MediaReferenceSettings,
  MediaReferenceType,
} from 'bento-common/types/media';
import Media from './Media.model';

@Scopes(() => ({
  fromOrg: (organizationId: number) => ({
    where: { organizationId },
  }),
}))
@Table({
  schema: 'core',
  tableName: 'media_references',
})
export default class MediaReference extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @ForeignKey(() => Media)
  @AllowNull(false)
  @Column({ field: 'media_id', type: DataType.INTEGER })
  readonly mediaId!: number;

  @Comment('Id of the entity being associated to a media')
  @AllowNull(false)
  @Column({ field: 'reference_id', type: DataType.INTEGER })
  readonly referenceId!: number;

  @Comment('Entity type/name that is linked to a media')
  @AllowNull(false)
  @EnumColumn('reference_type', MediaReferenceType)
  readonly referenceType!: MediaReferenceType;

  @AllowNull(false)
  @Default(0)
  @Column({ field: 'order_index', type: DataType.INTEGER })
  readonly orderIndex!: number;

  @Default({})
  @Column({ field: 'settings', type: DataType.JSONB })
  readonly settings!: MediaReferenceSettings;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // Associations

  @BelongsTo(() => Organization)
  readonly organization!: Organization;

  @BelongsTo(() => Media)
  readonly media!: Media;

  @BelongsTo(() => StepPrototype, {
    foreignKey: 'referenceId',
    constraints: false,
  })
  readonly stepPrototype!: StepPrototype;

  // Methods

  getReference(options?: AssociationGetOptions) {
    switch (this.referenceType) {
      case MediaReferenceType.stepPrototype:
        return this.$get('stepPrototype', options);

      default:
        return Promise.resolve(null);
    }
  }
}
