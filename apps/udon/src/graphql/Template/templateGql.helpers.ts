import { GraphQLFieldResolver } from 'graphql';
import { keyBy } from 'lodash';

import { isSplitTestGuide } from 'bento-common/data/helpers';
import { usesFirstStepTagLocation } from 'bento-common/utils/formFactor';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { GraphQLContext } from 'src/graphql/types';
import { AnnouncementDailyActivity } from 'src/data/models/Analytics/AnnouncementDailyActivity.model';
import { QueryDatabase, queryRunner } from 'src/data';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { Module } from 'src/data/models/Module.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Loaders } from 'src/data/loaders';

export const lastUsedAtResolver: GraphQLFieldResolver<
  Template,
  GraphQLContext
> = async (template: Template, _, { loaders }): Promise<Date | undefined> => {
  const splitTargets = isSplitTestGuide(template.type)
    ? await loaders.templateSplitTargetsLoader.load(template.id)
    : [];

  const splitTargetIds =
    splitTargets.length > 0
      ? splitTargets.reduce((acc, t) => {
          if (t?.id !== undefined) acc.push(t.id);
          return acc;
        }, [] as number[])
      : [];

  const guideBase = await GuideBase.findOne({
    where: {
      createdFromTemplateId:
        splitTargetIds.length > 0 ? splitTargetIds : template.id,
    },
    order: [['createdAt', 'DESC']],
  });

  if (guideBase) {
    loaders.guideBaseEntityLoader.prime(guideBase.entityId, guideBase);
    loaders.guideBaseLoader.prime(guideBase.id, guideBase);
  }

  return guideBase?.createdAt;
};

export type MappedAnnouncementCtaActivity = {
  ctaEntityId: string;
  text: string;
  count: number;
};

export const composeAnnouncementTimeSeries = async (template: Template) => {
  if (!template.isSideQuest) return [];

  const dailyActivity = await AnnouncementDailyActivity.findAll({
    // Needed to prevent sequelize to assume that an 'id'
    // column exists.
    attributes: { exclude: ['id'] },
    where: {
      templateId: template.id,
    },
    order: [['date', 'DESC']],
    /* Buffer for if UTC time generates extra rows */
    limit: 32,
  });

  return dailyActivity
    .reverse()
    .map(({ savedForLater, viewed, dismissed, date, ctaActivity }) => {
      /* Reformat to array of data so gQL can type it */
      const ctaActivityTransformed: MappedAnnouncementCtaActivity[] =
        Object.keys(ctaActivity).map((ctaEntityId) => ({
          ctaEntityId,
          text: ctaActivity[ctaEntityId].text ?? 0,
          count: ctaActivity[ctaEntityId].count ?? 0,
        }));

      return {
        savedForLater,
        viewed,
        dismissed,
        date,
        ctaActivity: ctaActivityTransformed,
      };
    });
};

type BranchingPerformance = {
  // TODO
  branchingPath?: BranchingPath;
  createdModule?: Module;
  createdTemplate?: Template;
  stepPrototype?: StepPrototype;
  count: number;
};

/** For step group branching */
export const getBranchingPerformance = async (
  template: Template,
  detachedOnly: boolean
): Promise<BranchingPerformance[]> => {
  if (template.isCyoa) {
    /** CYOA handling */
    const rows = (await queryRunner({
      sql: `--sql
				SELECT
					t.id AS "createdTemplateId",
					tbp.branching_path_id AS "branchingPathId",
					s.created_from_step_prototype_id AS "stepPrototypeId",
					COUNT(DISTINCT tbp.triggered_from_guide_id)
				FROM core.triggered_branching_paths tbp
				JOIN core.guides g ON tbp.triggered_from_guide_id = g.id
				JOIN core.guides cg ON tbp.created_guide_id = cg.id
				JOIN core.templates t ON cg.created_from_template_id = t.id
				JOIN core.steps s ON tbp.triggered_from_step_id = s.id
				JOIN core.step_prototypes sp ON s.created_from_step_prototype_id = sp.id
				WHERE g.created_from_template_id = :templateId
					AND t.id IS NOT NULL
				GROUP BY t.id, tbp.branching_path_id, s.created_from_step_prototype_id;
		`,
      replacements: {
        templateId: template.id,
      },
    })) as {
      createdTemplateId: number;
      branchingPathId: number | null;
      stepPrototypeId: number;
      count: number;
    }[];

    const createdTemplates = await Template.findAll({
      where: {
        id: rows.map((r) => r.createdTemplateId),
      },
    });

    const createdTemplatesById = keyBy(createdTemplates, 'id');

    return rows.map((r) => ({
      createdTemplate: createdTemplatesById[r.createdTemplateId],
      count: r.count,
    }));
  }

  /** Non-CYOA handling - primarily for detached branches */
  const rows = (await queryRunner({
    sql: `--sql
		SELECT
			m.id AS "createdModuleId",
			tbp.branching_path_id AS "branchingPathId",
			s.created_from_step_prototype_id AS "stepPrototypeId",
			COUNT(tbp.id)
		FROM core.triggered_branching_paths tbp
		JOIN core.guides g ON tbp.triggered_from_guide_id = g.id
		JOIN core.guide_modules gm ON tbp.created_guide_module_id = gm.id
		JOIN core.modules m ON gm.created_from_module_id = m.id
		JOIN core.steps s ON tbp.triggered_from_step_id = s.id
		JOIN core.step_prototypes sp ON s.created_from_step_prototype_id = sp.id
		${
      detachedOnly
        ? 'LEFT JOIN core.branching_paths abp ON abp.branching_key = sp.entity_id AND abp.module_id = m.id'
        : ''
    }
		WHERE g.created_from_template_id = :templateId
			AND m.id IS NOT NULL
			AND gm.deleted_at IS NULL
		${detachedOnly ? 'AND abp.id IS NULL' : ''}
		GROUP BY m.id, tbp.branching_path_id, s.created_from_step_prototype_id;
		`,
    replacements: {
      templateId: template.id,
    },
  })) as {
    createdModuleId: number;
    branchingPathId: number | null;
    stepPrototypeId: number;
    count: number;
  }[];

  const createdModules = await Module.findAll({
    where: {
      id: rows.map((r) => r.createdModuleId),
    },
  });

  // const stepPrototypes = await StepPrototype.findAll({
  //   where: {
  //     id: rows.map((r) => r.stepPrototypeId),
  //   },
  // });

  const createdModulesById = keyBy(createdModules, 'id');
  // const stepPrototypesById = keyBy(stepPrototypes, 'id');

  return rows.map((r) => ({
    createdModule: createdModulesById[r.createdModuleId],
    // stepPrototype: stepPrototypesById[r.stepPrototypeId],
    count: r.count,
  }));
};

/**
 * Count of guides that have triggered a branching path
 *
 * For account guides, should mean distinct accounts.
 * For user guides, should mean distinct users.
 */
export const getBranchedGuidesCount = async (templateId: number) => {
  const row = (await queryRunner({
    sql: `--sql
		SELECT
			COUNT(DISTINCT g.id)
		FROM core.templates t
		JOIN core.guides g ON g.created_from_template_id = t.id
		JOIN core.triggered_branching_paths tbp ON tbp.triggered_from_guide_id = g.id
		WHERE t.id = :templateId;
		`,
    replacements: {
      templateId,
    },
    queryDatabase: QueryDatabase.primary,
  })) as { count: number }[];

  return row?.[0].count ?? 0;
};

export const getTemplateTaggedElements = async (
  template: Template,
  loaders: Loaders,
  /** Check for types based on location entirely (e.g. flow) */
  checkFirstStepSupport?: boolean
) => {
  const supportsFirstStepTagLocation = usesFirstStepTagLocation(
    template.formFactor
  );

  const firstStep: StepPrototype | undefined =
    checkFirstStepSupport && supportsFirstStepTagLocation
      ? (await loaders.stepPrototypesOfTemplateLoader.load(template.id))[0]
      : undefined;

  if (firstStep) {
    return await loaders.stepPrototypeTaggedElementsOfStepPrototypeAndTemplateLoader.load(
      {
        stepPrototypeId: firstStep.id,
        templateEntityId: template.entityId,
      }
    );
  }

  return await loaders.stepPrototypeTaggedElementsOfTemplateLoader.load(
    template.id
  );
};
