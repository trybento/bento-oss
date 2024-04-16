import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import promises from 'src/utils/promises';
import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { keyBy } from 'lodash';

import {
  GuideFormFactor,
  Theme,
  GuidePageTargetingType,
  ModalSize,
  TooltipSize,
  TooltipShowOn,
  StepType,
  ModalPosition,
  BannerTypeEnum,
  ModalStyle,
  TooltipStyle,
  BannerStyle,
  BannerPosition,
  CreateGuideVariationEnum,
  ChecklistStyle,
  StepBodyOrientation,
  CardStyle,
  VerticalAlignmentEnum,
  GuideTypeEnum,
  TemplateState,
} from 'bento-common/types';
import { getGuideThemeFlags } from 'bento-common/data/helpers';
import {
  getDefaultMediaReferences,
  getTemplateByFormFactor,
} from 'bento-common/utils/templates';

import generateMutation from 'src/graphql/helpers/generateMutation';
import TemplateType, {
  GuideTypeEnumType,
  GuideFormFactorEnumType,
  GuidePageTargetingEnumType,
} from 'src/graphql/Template/Template.graphql';

import { withTransaction } from 'src/data';
import { getOrgSettings } from 'src/data/models/OrganizationSettings.model';
import { ThemeType } from 'src/graphql/Organization/Organization.graphql';
import {
  ModuleInput,
  ModuleInputType,
  NewModuleInput,
} from 'src/graphql/Module/mutations/moduleMutations.helpers';
import { Module } from 'src/data/models/Module.model';
import editModule from 'src/interactions/library/editModule';
import createModule from 'src/interactions/library/createModule';
import { Template } from 'src/data/models/Template.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import {
  CYOA_THEME,
  DEFAULT_CYOA_QUESTION,
  DEFAULT_CYOA_TITLE,
} from 'bento-common/utils/constants';
import { getDefaultNotificationSettings } from 'src/jobsBull/jobs/notifications/notifications.helpers';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import {
  isFlowGuide,
  isInlineContextualGuide,
  isStandardMultiStepTheme,
  isTooltipGuide,
} from 'bento-common/utils/formFactor';

export interface TemplateInput {
  name: string;
  privateName?: string;
  description?: string;
  modules?: NewModuleInput[];
  type: GuideTypeEnum;
  isSideQuest?: boolean;
  isCyoa?: boolean;
  formFactor: GuideFormFactor;
  theme?: Theme;
  pageTargetingType?: GuidePageTargetingType;
  pageTargetingUrl?: string;
}

interface CreateTemplateMutationArgs {
  variation?: CreateGuideVariationEnum;
  templateData: TemplateInput;
}

export const CreateGuideVariationEnumType = enumToGraphqlEnum({
  name: 'CreateGuideVariationEnumType',
  enumType: CreateGuideVariationEnum,
  description:
    'Variation used to indicate a special configuration for new guides.',
});

const CreateTemplateInputType = new GraphQLInputObjectType({
  name: 'CreateTemplateTemplateInput',
  fields: {
    name: {
      type: GraphQLString,
    },
    privateName: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    isCyoa: {
      type: GraphQLBoolean,
    },
    modules: {
      type: new GraphQLList(new GraphQLNonNull(ModuleInputType)),
    },
    type: {
      type: new GraphQLNonNull(GuideTypeEnumType),
    },
    isSideQuest: {
      type: GraphQLBoolean,
    },
    formFactor: {
      type: GuideFormFactorEnumType,
    },
    theme: {
      type: ThemeType,
    },
    pageTargetingType: {
      type: GuidePageTargetingEnumType,
    },
    pageTargetingUrl: {
      type: GraphQLString,
    },
  },
});

export default generateMutation({
  name: 'CreateTemplate',
  description: 'Creating a new template',
  inputFields: {
    variation: {
      type: CreateGuideVariationEnumType,
    },
    templateData: {
      type: new GraphQLNonNull(CreateTemplateInputType),
    },
  },
  outputFields: {
    template: {
      type: TemplateType,
    },
  },
  mutateAndGetPayload: async (
    { variation, templateData }: CreateTemplateMutationArgs,
    { organization, user }
  ) => {
    const isCyoa = !!templateData.isCyoa;
    let modulesData = templateData.modules || [];

    const newTemplateTheme = isCyoa
      ? CYOA_THEME
      : templateData.isSideQuest && !templateData.theme
      ? Theme.nested
      : templateData.theme || (await getOrgSettings(organization)).theme;

    const moduleEntityIdRows = modulesData
      .map((module) => module.entityId)
      .filter(Boolean);
    let modulesByEntityId: Record<string, Module> = {};

    const stepBodyOrientation =
      variation === CreateGuideVariationEnum.vertical
        ? StepBodyOrientation.vertical
        : StepBodyOrientation.horizontal;
    const verticalMediaAlignment =
      stepBodyOrientation === StepBodyOrientation.horizontal
        ? VerticalAlignmentEnum.center
        : undefined;

    if (
      [
        GuideFormFactor.modal,
        GuideFormFactor.banner,
        GuideFormFactor.tooltip,
        GuideFormFactor.flow,
      ].includes(templateData.formFactor) ||
      isInlineContextualGuide(newTemplateTheme) ||
      isCyoa
    ) {
      if (modulesData.length > 0) {
        throw new Error(
          `[${newTemplateTheme}|${templateData.formFactor}] currently don't support user provided modules`
        );
      }

      modulesData = [genModuleInput(templateData, newTemplateTheme, isCyoa)];
    }

    if (moduleEntityIdRows.length > 0) {
      const modules = await Module.findAll({
        where: {
          entityId: moduleEntityIdRows,
        },
      });

      modulesByEntityId = keyBy(modules, 'entityId');
    }

    const template = await withTransaction(async () => {
      const createdTemplate = await Template.create({
        organizationId: organization.id,
        state: TemplateState.draft,
        name: templateData.name,
        /** @todo cleanup displayTitle */
        displayTitle: templateData.name,
        privateName: templateData.privateName,
        description: templateData.description,
        type: templateData.type as GuideTypeEnum,
        isSideQuest: templateData.isSideQuest,
        formFactor: templateData.formFactor,
        isCyoa,
        pageTargetingType: templateData.pageTargetingType,
        pageTargetingUrl: templateData.pageTargetingUrl,
        createdByUserId: user.id,
        updatedByUserId: user.id,
        editedByUserId: user.id,
        editedAt: new Date(),
        theme: newTemplateTheme,
        notificationSettings: getDefaultNotificationSettings(
          templateData as Template
        ),
        formFactorStyle:
          templateData.formFactor === GuideFormFactor.modal
            ? ({
                modalSize: ModalSize.large,
                position: ModalPosition.center,
                hasBackgroundOverlay: true,
              } as ModalStyle)
            : isTooltipGuide(templateData.formFactor)
            ? ({
                hasArrow: false,
                hasBackgroundOverlay: false,
                tooltipShowOn: TooltipShowOn.hover,
                tooltipSize: TooltipSize.small,
                backgroundColor: '#FFFFFF',
              } as TooltipStyle)
            : isFlowGuide(templateData.formFactor)
            ? ({
                hasArrow: true,
                hasBackgroundOverlay: false,
                tooltipShowOn: TooltipShowOn.load,
                tooltipSize: TooltipSize.small,
                backgroundColor: '#FFFFFF',
              } as TooltipStyle)
            : templateData.formFactor === GuideFormFactor.banner
            ? ({
                bannerType: BannerTypeEnum.floating,
                bannerPosition: BannerPosition.top,
              } as BannerStyle)
            : newTemplateTheme === Theme.card
            ? ({
                canDismiss: false,
                stepBodyOrientation,
                verticalMediaAlignment,
              } as CardStyle)
            : ({
                stepBodyOrientation:
                  newTemplateTheme === Theme.nested
                    ? StepBodyOrientation.vertical
                    : stepBodyOrientation,
              } as ChecklistStyle),
      });

      await TemplateAutoLaunchRule.create({
        templateId: createdTemplate.id,
        organizationId: organization.id,
      });
      await TemplateTarget.create({
        templateId: createdTemplate.id,
        organizationId: organization.id,
      });

      /* We usually expect no module inputs */
      await promises.mapSeries(modulesData, async (moduleData, moduleIdx) => {
        const existingModule =
          moduleData.entityId && modulesByEntityId[moduleData.entityId];

        let persistedModule: Module | { errors: string[] };
        if (existingModule) {
          persistedModule = await editModule(
            {
              module: existingModule,
              moduleData: moduleData as ModuleInput,
              organization,
              user,
            },
            {}
          );
        } else {
          persistedModule = await createModule({
            moduleData: {
              ...moduleData,
              isCyoa: createdTemplate.isCyoa,
              createdFromFormFactor: createdTemplate.formFactor,
            },
            organization,
            user,
            createCtasForTemplate: true,
            template: createdTemplate,
          });
        }

        if (!(persistedModule instanceof Module))
          throw new Error('Validation error');

        await TemplateModule.create({
          templateId: createdTemplate.id,
          moduleId: persistedModule.id,
          organizationId: organization.id,
          orderIndex: moduleIdx,
        });
      });

      return createdTemplate;
    });

    return { template };
  },
});

function genModuleInput(
  { formFactor, ...data }: TemplateInput,
  theme: Theme,
  isCyoa: boolean
): NewModuleInput {
  const isFlow = isFlowGuide(formFactor);
  const { isVideoGallery, isFlat } = getGuideThemeFlags(theme);
  const standardGuide = isStandardMultiStepTheme(theme);

  /** Overrides existing values. */
  const cyoaProps = isCyoa
    ? {
        step: {
          name: DEFAULT_CYOA_TITLE,
          stepType: StepType.branching,
          branchingQuestion: DEFAULT_CYOA_QUESTION,
        },
        module: {
          name: DEFAULT_CYOA_TITLE,
          displayTitle: DEFAULT_CYOA_TITLE,
        },
      }
    : {};

  return {
    name: standardGuide ? '' : data.name,
    displayTitle: standardGuide ? '' : data.name,
    isCyoa,
    createdFromFormFactor: formFactor,
    stepPrototypes: [
      {
        name: isVideoGallery
          ? ''
          : standardGuide
          ? isFlow
            ? 'Step 1'
            : 'Sample step'
          : data.name || '',
        bodySlate: getTemplateByFormFactor(formFactor, theme),
        stepType: isFlat && !isFlow ? StepType.required : StepType.fyi,
        mediaReferences: getDefaultMediaReferences(formFactor, theme),
        ...cyoaProps.step,
      },
    ],
    ...cyoaProps.module,
  };
}
