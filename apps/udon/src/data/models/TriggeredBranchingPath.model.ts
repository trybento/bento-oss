import { Includeable } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { AccountUser } from './AccountUser.model';
import { Guide } from './Guide.model';
import { GuideModule } from './GuideModule.model';
import { GuideModuleBase } from './GuideModuleBase.model';
import { Organization } from './Organization.model';
import { Step } from './Step.model';
import { BranchingPath } from './BranchingPath.model';

import { EntityId, CreatedAt, UpdatedAt } from './columns';

type TriggeredBranchingPathData = {
  choiceText: string[];
};

export type TriggeredBranchingPathWithBranchingPath<
  T = TriggeredBranchingPath
> = T & {
  branchingPath: BranchingPath;
};

export enum TriggeredBranchingPathModelScope {
  withBranchingPath = 'withBranchingPath',
}

@Scopes(() => ({
  /**
   * Returns the StepPrototype from which this Step was created.
   * To be used with {@link TriggeredBranchingPathWithBranchingPath}
   */
  [TriggeredBranchingPathModelScope.withBranchingPath]: (
    includeOptions: Exclude<Includeable, string> = {}
  ) => ({
    include: [
      {
        required: true,
        model: BranchingPath,
        ...includeOptions,
      },
    ],
  }),
}))
@Table({ schema: 'core', tableName: 'triggered_branching_paths' })
export class TriggeredBranchingPath extends Model {
  readonly id!: number;

  @EntityId
  readonly entityId!: string;

  @ForeignKey(() => BranchingPath)
  @AllowNull(true)
  @Column({ field: 'branching_path_id', type: DataType.INTEGER })
  readonly branchingPathId?: number;

  @ForeignKey(() => Guide)
  @AllowNull(true)
  @Column({ field: 'created_guide_id', type: DataType.INTEGER })
  readonly createdGuideId?: number;

  @ForeignKey(() => GuideModule)
  @AllowNull(true)
  @Column({ field: 'created_guide_module_id', type: DataType.INTEGER })
  readonly createdGuideModuleId?: number;

  @ForeignKey(() => GuideModuleBase)
  @AllowNull(true)
  @Column({ field: 'created_guide_module_base_id', type: DataType.INTEGER })
  readonly createdGuideModuleBaseId?: number;

  @ForeignKey(() => AccountUser)
  @AllowNull(true)
  @Column({ field: 'account_user_id', type: DataType.INTEGER })
  readonly accountUserId!: number;

  @ForeignKey(() => Guide)
  @AllowNull(true)
  @Column({ field: 'triggered_from_guide_id', type: DataType.INTEGER })
  readonly triggeredFromGuideId?: number;

  @ForeignKey(() => Step)
  @AllowNull(true)
  @Column({ field: 'triggered_from_step_id', type: DataType.INTEGER })
  readonly triggeredFromStepId?: number;

  @Column({ field: 'data', type: DataType.JSONB })
  readonly data?: TriggeredBranchingPathData;

  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column({ field: 'organization_id', type: DataType.INTEGER })
  readonly organizationId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  // ASSOCIATIONS
  @BelongsTo(() => Guide, { foreignKey: 'createdGuideId' })
  readonly createdGuide?: Guide;

  @BelongsTo(() => GuideModule, { foreignKey: 'createdGuideModuleId' })
  readonly createdGuideModule?: GuideModule;

  @BelongsTo(() => BranchingPath)
  readonly branchingPath?: BranchingPath;

  @BelongsTo(() => Guide, { foreignKey: 'triggeredFromGuideId' })
  readonly triggeredFromGuide?: Guide;

  @BelongsTo(() => Step)
  readonly triggeredFromStep?: Step;

  @BelongsTo(() => AccountUser)
  readonly accountUser?: AccountUser;

  @BelongsTo(() => Organization)
  readonly organization!: Organization;
}
