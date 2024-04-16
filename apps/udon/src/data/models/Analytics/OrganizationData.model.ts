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
import { DiagnosticModules, DiagnosticStates } from 'bento-common/types';

import { CreatedAt, UpdatedAt } from '../columns';
import { Organization } from '../Organization.model';

export type DiagnosticState = { state: DiagnosticStates; updatedAt: Date };

export type DiagnosticsResults = Partial<
  Record<DiagnosticModules, DiagnosticStates | DiagnosticState>
>;

@Table({ schema: 'analytics', tableName: 'organization_data' })
export class OrganizationData extends Model {
  readonly id!: number;

  @Default({})
  @Column({ field: 'diagnostics', type: DataType.JSONB })
  readonly diagnostics!: DiagnosticsResults;

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
}
