import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';
import { queryRunner } from 'src/data';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { Module } from 'src/data/models/Module.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import BranchingPathType from '../BranchingPath/BranchingPath.graphql';
import ModuleType from '../Module/Module.graphql';
import { GraphQLContext } from '../types';

type StepBranchingPerformance = {
  triggeredCount: number;
  createdModuleId?: number;
  createdModule?: Module;
  /* Not using for now; was intended for "originally branched from" */
  branchingPathId?: number;
  branchingPath?: BranchingPath;
  choiceText: string;
  activeBranchingPathId?: number;
};

export const StepBranchingPerformanceType = new GraphQLObjectType<
  StepBranchingPerformance,
  GraphQLContext
>({
  name: 'StepBranchingPerformanceType',
  fields: () => ({
    createdModule: {
      type: ModuleType,
      resolve: (sbp, _, { loaders }) =>
        sbp.createdModuleId
          ? loaders.moduleLoader.load(sbp.createdModuleId)
          : null,
    },
    branchingPath: {
      type: BranchingPathType,
      deprecationReason: 'Not implemented',
      description: 'Original branching path that triggered the branching',
      resolve: (sbp, _, { loaders }) =>
        sbp.branchingPathId
          ? loaders.branchingPathLoader.load(sbp.branchingPathId)
          : null,
    },
    activeBranchingPath: {
      type: BranchingPathType,
      description:
        'Any new branching path that would result in adding the targeted module',
      resolve: (sbp, _, { loaders }) =>
        sbp.activeBranchingPathId
          ? loaders.branchingPathLoader.load(sbp.activeBranchingPathId)
          : null,
    },
    triggeredCount: {
      type: GraphQLInt,
    },
    choiceText: {
      type: GraphQLString,
      resolve: (sbp) =>
        typeof sbp.choiceText === 'string' && sbp.choiceText.length > 0
          ? getChoiceText(sbp.choiceText)
          : sbp.choiceText,
    },
  }),
});

const getChoiceText = (ct: string) => {
  try {
    const p = JSON.parse(ct);

    return Array.isArray(p) ? p[0] : p;
  } catch {
    return ct;
  }
};

export const getStepBranchingPerformance = async (
  stepPrototype: StepPrototype,
  templateEntityId: string
): Promise<StepBranchingPerformance[]> => {
  const standardRows = await getStandardBranchingPerformance(
    stepPrototype,
    templateEntityId
  );

  const branchingRows = await getEmptyBranchPerformance(
    stepPrototype,
    templateEntityId
  );

  return [...standardRows, ...branchingRows];
};

const getStandardBranchingPerformance = async (
  stepPrototype: StepPrototype,
  templateEntityId: string
) => {
  const rows = (await queryRunner({
    sql: `--sql
		SELECT
			m.id AS "createdModuleId",
			bp.id AS "activeBranchingPathId",
			'' AS "choiceText",
			COUNT(tbp.id) AS "triggeredCount"
		FROM core.triggered_branching_paths tbp
		JOIN core.guides g ON tbp.triggered_from_guide_id = g.id
		JOIN core.templates t ON t.id = g.created_from_template_id
		JOIN core.guide_modules gm ON tbp.created_guide_module_id = gm.id
		LEFT JOIN core.modules m ON gm.created_from_module_id = m.id
		JOIN core.steps s ON tbp.triggered_from_step_id = s.id
		JOIN core.step_prototypes sp ON sp.id = s.created_from_step_prototype_id
		JOIN core.branching_paths bp ON bp.branching_key = sp.entity_id
			AND (
				CASE
					WHEN tbp.created_guide_module_id IS NULL AND bp.module_id IS NULL THEN 1
					WHEN bp.module_id = m.id THEN 1
					ELSE 0 END
			) = 1
		WHERE
			t.entity_id = :templateEntityId
			AND s.created_from_step_prototype_id = :stepPrototypeId
			AND gm.deleted_at IS NULL
		GROUP BY
			m.id,
			bp.id;
		`,
    replacements: {
      templateEntityId,
      stepPrototypeId: stepPrototype.id,
    },
  })) as {
    createdModuleId: number;
    triggeredCount: number;
    choiceText: string;
    activeBranchingPathId: number;
  }[];

  return rows;
};

const getEmptyBranchPerformance = async (
  stepPrototype: StepPrototype,
  templateEntityId: string
): Promise<StepBranchingPerformance[]> => {
  const rows = (await queryRunner({
    sql: `--sql
		SELECT DISTINCT
			tbp.triggered_from_guide_id AS "guideId",
			tbp.data->'choiceText' AS "choiceText"
		FROM core.triggered_branching_paths tbp
		JOIN core.guides g ON tbp.triggered_from_guide_id = g.id
		JOIN core.templates t ON t.id = g.created_from_template_id
		JOIN core.steps s ON tbp.triggered_from_step_id = s.id
		JOIN core.step_prototypes sp ON sp.id = s.created_from_step_prototype_id
		JOIN core.branching_paths bp ON bp.branching_key = sp.entity_id
		WHERE
			t.entity_id = :templateEntityId
			AND s.created_from_step_prototype_id = :stepPrototypeId
			AND bp.entity_type = 'module'
			AND tbp.created_guide_module_id IS NULL;
		`,
    replacements: {
      templateEntityId,
      stepPrototypeId: stepPrototype.id,
    },
  })) as { choiceText: string[]; guideId: number }[];

  const stats = rows.reduce((a, v) => {
    v.choiceText?.forEach((t) => {
      if (!t) return;

      if (!a[t]) {
        a[t] = {
          choiceText: t,
          triggeredCount: 1,
        };
      } else {
        a[t].triggeredCount++;
      }
    });
    return a;
  }, {} as Record<string, StepBranchingPerformance>);

  return Object.values(stats);
};
