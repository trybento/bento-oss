import { Column, DataType } from 'sequelize-typescript';

/**
 * @todo move all to `apps/common/utils/sequelize.ts`
 */

export const EntityId = Column({
  field: 'entity_id',
  type: DataType.UUID,
  defaultValue: DataType.UUIDV4,
  unique: true,
  allowNull: false,
});

export const CreatedAt = Column({
  field: 'created_at',
  type: DataType.DATE,
  defaultValue: DataType.NOW,
  allowNull: false,
});

export const UpdatedAt = Column({
  field: 'updated_at',
  type: DataType.DATE,
  defaultValue: DataType.NOW,
  allowNull: false,
});

export const DeletedAt = Column({
  field: 'deleted_at',
  type: DataType.DATE,
  allowNull: true,
});

export const ArchivedAt = Column({
  field: 'archived_at',
  type: DataType.DATE,
  allowNull: true,
});
