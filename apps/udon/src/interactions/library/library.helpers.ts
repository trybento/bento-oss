import { Op } from 'sequelize';
import { keyBy, uniqBy } from 'lodash';
import {
  FormFactorStyle,
  GuideBaseState,
  GuideFormFactor,
  GuideTypeEnum,
  StepBodyOrientation,
  Theme,
} from 'bento-common/types';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';
import {
  isAnnouncementGuide,
  isTooltipGuide,
  isFlowGuide,
} from 'bento-common/utils/formFactor';
import {
  getParsedFormFactorStyle,
  isGuideEligibleToHideCompletedSteps,
} from 'bento-common/data/helpers';
import { Template } from 'src/data/models/Template.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import promises from 'src/utils/promises';

/** Tweak formFactorStyle if needed */
export const modifyFormFactorStyleForDuplicate = ({
  theme,
  formFactor,
  existingFormFactorStyle,
}: {
  theme: Theme | undefined;
  formFactor: GuideFormFactor | undefined;
  existingFormFactorStyle: FormFactorStyle | undefined;
}) => {
  if (!existingFormFactorStyle) return undefined;

  const { checklistFormFactorStyle } = getParsedFormFactorStyle(
    existingFormFactorStyle
  );

  checklistFormFactorStyle!.hideCompletedSteps =
    checklistFormFactorStyle!.hideCompletedSteps &&
    isGuideEligibleToHideCompletedSteps(theme);

  return {
    ...existingFormFactorStyle,
    ...checklistFormFactorStyle,
    stepBodyOrientation:
      theme === Theme.nested &&
      !isAnnouncementGuide(formFactor) &&
      !isTooltipGuide(formFactor) &&
      !isFlowGuide(formFactor)
        ? StepBodyOrientation.vertical
        : checklistFormFactorStyle!.stepBodyOrientation,
  };
};

/** Get count of autolaunched guides so we use it for default last ranking */
export const getLastPriorityRankingValue = async (organizationId: number) => {
  const lastTemplate = await Template.findOne({
    where: {
      organizationId,
      isAutoLaunchEnabled: true,
    },
    order: [['priorityRanking', 'DESC']],
  });

  return lastTemplate ? lastTemplate.priorityRanking + 1 : 0;
};

/** Enforce defaults on priority ranking */
export const getPriorityRanking = async (
  template: Template,
  launching: boolean
) => {
  if (!launching) return DEFAULT_PRIORITY_RANKING;

  if (template.priorityRanking === DEFAULT_PRIORITY_RANKING)
    return await getLastPriorityRankingValue(template.organizationId);

  return template.priorityRanking;
};

/**
 * Updates the template's manually-launched flag based on whether it
 * has at least one active manually-launched guide base.
 */
export const updateManualLaunchFlagForTemplates = async ({
  templateIds,
}: {
  templateIds: number[];
}) => {
  if (templateIds.length === 0) {
    return;
  }

  const manuallyLaunchedGuideBases = await GuideBase.findAll({
    where: {
      createdFromTemplateId: templateIds,
      state: GuideBaseState.active,
      wasAutoLaunched: false,
    },
    include: [
      {
        model: Template,
        attributes: [],
        required: true,
        where: {
          type: {
            [Op.in]: [GuideTypeEnum.account, GuideTypeEnum.user],
          },
        },
      },
    ],
    group: ['createdFromTemplateId'],
    attributes: ['createdFromTemplateId'],
  });

  const manuallyLaunchedGuideBasesByTemplate = keyBy(
    uniqBy(manuallyLaunchedGuideBases, 'createdFromTemplateId'),
    'createdFromTemplateId'
  );

  await promises.map(
    templateIds,
    async (templateId) => {
      const manuallyLaunched =
        !!manuallyLaunchedGuideBasesByTemplate[templateId];

      await Template.update(
        {
          manuallyLaunched,
        },
        {
          where: {
            id: templateId,
          },
        }
      );
    },
    { concurrency: 3 }
  );
};
