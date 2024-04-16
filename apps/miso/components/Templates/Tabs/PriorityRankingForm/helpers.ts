import { AutoLaunchableTarget } from 'components/EditorCommon/targeting.helpers';
import { FormEntityLabel } from 'components/GuideForm/types';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';
import { guideComponentIcon } from 'helpers/presentational';
import RankableObjectsQuery from 'queries/RankableObjectsQuery';
import { EditNpsQuery } from 'relay-types/EditNpsQuery.graphql';
import {
  AtLeast,
  GuideDesignType,
  GuideFormFactor,
  GuideTypeEnum,
  RankableType,
} from 'bento-common/types';
import { NpsFormValue } from 'types';
import { PRIORITY_RANK_MODIFIER } from 'bento-common/utils/constants';
import { isTemplateRankable } from 'bento-common/data/helpers';
import ThumbsUpDownOutlinedIcon from '@mui/icons-material/ThumbsUpDownOutlined';

type LaunchedSurveys = EditNpsQuery['response']['launchedNpsSurveys'];
type LaunchedTemplates = EditNpsQuery['response']['launchedTemplates'];

export interface GenericPriorityFormValues {
  formEntityLabel: FormEntityLabel;
  currentTarget: AutoLaunchableTarget | undefined;
  autoLaunchableTargets: AutoLaunchableTarget[];
}

export const AUTO_LAUNCHABLE_TARGETS_FORM_KEY = `autoLaunchableTargets`;

/**
 * Sorts rankable objects. Mutates the original array and returns it.
 * When passing inputs make sure non-sorted objects (like inline cards) are
 *   already filtered out as this method does not filter.
 */
export const sortRankableTargets = <
  T extends AtLeast<
    { priorityRanking: number; launchedAt: string },
    'priorityRanking'
  >
>(
  unorderedTargets: T[]
): T[] => {
  const computeRank = (object: T) => {
    /**
     * UI did not consider launchedAt before,
     * not adding it for now since it causes the
     * logic to behave wrong.
     */
    return object.priorityRanking * PRIORITY_RANK_MODIFIER;
  };

  unorderedTargets.sort((a, b) => {
    return computeRank(a) - computeRank(b);
  });

  return unorderedTargets;
};

export const getSortedRankableTargets = async ({
  enabledInternalNames,
}: {
  enabledInternalNames?: boolean;
}) => {
  const res = await RankableObjectsQuery();
  const { autoLaunchableTemplates, launchedNpsSurveys } = res || {};

  if (!autoLaunchableTemplates) return [];

  const templateTargets = autoLaunchableTemplates.reduce<
    AutoLaunchableTarget[]
  >((acc, t) => {
    if (!isTemplateRankable(t)) return acc;
    acc.push(templateToTargetTransformer(t, enabledInternalNames));
    return acc;
  }, []);
  const surveyTargets = launchedNpsSurveys.map(
    ({ entityId, name, priorityRanking, launchedAt }) => ({
      entityId,
      name,
      priorityRanking,
      launchedAt,
      type: RankableType.survey,
      Icon: ThumbsUpDownOutlinedIcon,
    })
  );

  const rankableTargets = sortRankableTargets([
    ...templateTargets,
    ...surveyTargets,
  ]);

  return rankableTargets;
};

/**
 * Transforms fragment RAnkableObjects_{templates | surveys} return data
 *   into AutoLaunchableTarget, which can be used to display guide lists
 */
export const templateToTargetTransformer = (
  template: LaunchedTemplates[number],
  enabledInternalNames: boolean
): AutoLaunchableTarget => {
  const {
    entityId,
    isCyoa,
    formFactor,
    designType,
    type,
    launchedAt,
    priorityRanking,
    splitTargets,
  } = template;
  const name = guidePrivateOrPublicNameOrFallback(
    enabledInternalNames,
    template
  );

  return {
    entityId,
    type: RankableType.guide,
    priorityRanking,
    name,
    launchedAt,
    Icon: guideComponentIcon({
      isCyoa,
      formFactor: formFactor as GuideFormFactor,
      designType: designType as GuideDesignType,
      type: type as GuideTypeEnum,
      theme: undefined,
    }),
    infoTags: (splitTargets || []).map((t) =>
      guidePrivateOrPublicNameOrFallback(enabledInternalNames, t)
    ),
  };
};

type PreparePriorityRankingsArgs = {
  surveys: LaunchedSurveys;
  templates: LaunchedTemplates;
  currentTarget: AutoLaunchableTarget;
  enabledInternalNames: boolean;
};

export const preparePriorityRankings = ({
  surveys,
  templates,
  currentTarget,
  enabledInternalNames,
}: PreparePriorityRankingsArgs): AutoLaunchableTarget[] => {
  const templateTargets: AutoLaunchableTarget[] = templates.reduce((acc, t) => {
    if (!isTemplateRankable(t)) return acc;
    acc.push(templateToTargetTransformer(t, enabledInternalNames));
    return acc;
  }, [] as AutoLaunchableTarget[]);

  const surveyTargets: AutoLaunchableTarget[] = surveys.map(
    ({ entityId, name, priorityRanking, launchedAt }) => ({
      entityId,
      name,
      priorityRanking,
      launchedAt,
      type: RankableType.survey,
      Icon: ThumbsUpDownOutlinedIcon,
    })
  );

  const allTargets = sortRankableTargets([
    ...templateTargets,
    ...surveyTargets,
  ]);

  const insertTemplateAt: number | null = currentTarget.launchedAt
    ? null
    : currentTarget.priorityRanking ?? allTargets.length;

  if (insertTemplateAt !== null) {
    allTargets.splice(
      insertTemplateAt < 0 ? 0 : insertTemplateAt,
      0,
      currentTarget
    );
  }

  return allTargets;
};

export const preparePriorityRankingsForTemplateOrTest = ({
  formEntityLabel,
  templateOrTest,
  editedName,
  enabledInternalNames,
  ...restArgs
}: Omit<PreparePriorityRankingsArgs, 'currentTarget'> & {
  formEntityLabel: FormEntityLabel;
  templateOrTest: any;
  editedName: string;
  enabledInternalNames: boolean;
}): GenericPriorityFormValues => {
  const currentTarget: AutoLaunchableTarget = templateToTargetTransformer(
    {
      ...templateOrTest,
      ...(editedName ? { name: editedName } : {}),
    },
    enabledInternalNames
  );

  const autoLaunchableTargets = preparePriorityRankings({
    enabledInternalNames,
    currentTarget,
    ...restArgs,
  });

  return { formEntityLabel, currentTarget, autoLaunchableTargets };
};

export const preparePriorityRankingsForSurvey = ({
  survey: { entityId, name, priorityRanking, launchedAt },
  editedName,
  enabledInternalNames,
  ...restArgs
}: Omit<PreparePriorityRankingsArgs, 'currentTarget'> & {
  survey: NpsFormValue['npsSurveyData'];
  editedName: string;
  enabledInternalNames: boolean;
}): GenericPriorityFormValues => {
  const currentTarget: AutoLaunchableTarget = {
    entityId,
    type: RankableType.survey,
    name: editedName ?? name,
    priorityRanking,
    launchedAt,
  };

  const autoLaunchableTargets = preparePriorityRankings({
    enabledInternalNames,
    currentTarget,
    ...restArgs,
  });

  return {
    formEntityLabel: FormEntityLabel.nps,
    currentTarget,
    autoLaunchableTargets,
  };
};

/** Prepares the raking data to be submitted. */
export const sanitizePriorityRankingsInput = ({
  autoLaunchableTargets,
}: GenericPriorityFormValues) => {
  return autoLaunchableTargets.reduce((acc, { entityId, type }, idx) => {
    acc.push({ entityId, type, priorityRanking: idx });
    return acc;
  }, [] as Pick<AutoLaunchableTarget, 'entityId' | 'type' | 'priorityRanking'>[]);
};
