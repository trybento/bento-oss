import promises from 'src/utils/promises';
import {
  duplicateName,
  isCardTheme,
  isVideoGalleryTheme,
} from 'bento-common/data/helpers';
import {
  GuideFormFactor,
  RuleTypeEnum,
  TargetingType,
  TemplateState,
  Theme,
} from 'bento-common/types';
import {
  isBannerGuide,
  isCarousel,
  isModalGuide,
  isSidebarContextualGuide,
  isTooltipGuide,
  isFlowGuide,
} from 'bento-common/utils/formFactor';
import { nameAndPrivateNameShouldMatch } from 'bento-common/utils/naming';
import { RawRule } from 'bento-common/types/targeting';

import { queryRunner, withTransaction } from 'src/data';
import duplicateModule from './duplicateModule';
import { Template } from 'src/data/models/Template.model';
import { Module } from 'src/data/models/Module.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { modifyFormFactorStyleForDuplicate } from './library.helpers';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';
import duplicateInlineEmbeds from './duplicateInlineEmbeds';
import duplicatePrototypeTaggedElementOfTemplate from '../taggedElements/duplicatePrototypeTaggedElementOfTemplate';
import duplicatePrototypeTaggedElementOfSteps from '../taggedElements/duplicatePrototypeTaggedElementOfSteps';
import { enableInternalGuideNames } from 'src/utils/features';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';

type Args = {
  template: Template;
  newTheme?: Theme;
  organization: Organization;
  user?: User;
  /** Don't add "copy" */
  preserveName?: boolean;
  /** Specify a new name specifically */
  customName?: string;
  /** Keep status as unlaunchable "template" */
  markAsTemplate?: boolean;
  /** Skip making duplicates of modules */
  useExistingModules?: boolean;
  /** Using cross org templating system */
  usingTemplate?: boolean;
};

/**
 * Determines if we CAN duplicate step groups.
 *
 * Useful when we're dealing with templates that CAN use existing modules,
 * but the Admin has control over it.
 */
export const canDuplicateStepGroups = (
  template: Template,
  newTheme?: Theme
): Boolean => {
  // If we should duplicate it, it means we definitely can
  if (shouldDuplicateStepGroups(template, newTheme)) return true;

  // Checklists can duplicate
  if (!template.isSideQuest) return true;

  // Sidebar contextuals can duplicate
  if (isSidebarContextualGuide(template)) return true;

  // Carousels can duplicate
  if (isCarousel(template)) return true;

  return false;
};

/**
 * Determines if we SHOULD necessarily duplicate step groups.
 *
 * Useful when we're dealing with templates that CANNOT use existing modules.
 */
export const shouldDuplicateStepGroups = (
  template: Template,
  _newTheme?: Theme
): boolean => {
  // All by-design single-step templates should always duplicate
  if (
    isModalGuide(template.formFactor) ||
    isBannerGuide(template.formFactor) ||
    isTooltipGuide(template.formFactor) ||
    isFlowGuide(template.formFactor) ||
    isCardTheme(template.theme) ||
    isVideoGalleryTheme(template.theme)
  )
    return true;

  return false;
};

export default async function duplicateTemplate({
  template,
  newTheme,
  organization,
  user,
  preserveName,
  useExistingModules,
  markAsTemplate,
  customName,
  usingTemplate,
}: Args) {
  return withTransaction(async () => {
    const formFactorStyle = modifyFormFactorStyleForDuplicate({
      theme: newTheme,
      formFactor: template.formFactor,
      existingFormFactorStyle: template.formFactorStyle,
    });

    /**
     * If the org has private names enabled, we always want the internal name to have "(Copy)"
     *
     */
    const usePrivateNames = await enableInternalGuideNames.enabled(
      organization
    );

    const newName = customName ? customName : template.name;
    const newPrivateName = nameAndPrivateNameShouldMatch(
      template.formFactor,
      template.theme
    )
      ? newName
      : usePrivateNames && !preserveName
      ? duplicateName(template.privateName)
      : newName;

    const createdTemplate = await Template.create({
      organizationId: organization.id,
      state: TemplateState.draft,
      name: newName,
      /** @todo cleanup displayTitle */
      displayTitle: newName,
      privateName: newPrivateName,
      theme: newTheme || template.theme,
      description: template.description,
      type: template.type,
      isSideQuest: template.isSideQuest,
      isCyoa: template.isCyoa,
      formFactor: template.formFactor,
      createdByUserId: user?.id,
      updatedByUserId: user?.id,
      pageTargetingType: template.pageTargetingType,
      pageTargetingUrl: template.pageTargetingUrl,
      editedByUserId: user?.id,
      editedAt: user ? new Date() : undefined,
      isTemplate: markAsTemplate,
      formFactorStyle,
    });

    let autolaunchRules = [
      {
        templateId: createdTemplate.id,
        organizationId: createdTemplate.organizationId,
        ruleType: TargetingType.all,
        rules: [] as RawRule[],
      },
    ];

    let targets = [
      {
        templateId: createdTemplate.id,
        organizationId: createdTemplate.organizationId,
        targetType: TargetingType.all,
        rules: [] as RawRule[],
      },
    ];

    /**
     * We should only look for existing targets if we're cloning within the
     * same organization. Otherwise, we should just set default rules.
     */
    if (template.organizationId === createdTemplate.organizationId) {
      autolaunchRules = await TemplateAutoLaunchRule.findAll({
        where: {
          templateId: template.id,
          organizationId: createdTemplate.organizationId,
        },
      });

      targets = await TemplateTarget.findAll({
        where: {
          templateId: template.id,
          organizationId: createdTemplate.organizationId,
        },
      });
    }

    await TemplateAutoLaunchRule.bulkCreate(
      autolaunchRules.length > 0
        ? autolaunchRules.map(({ ruleType, rules }) => ({
            templateId: createdTemplate.id,
            ruleType,
            rules,
            organizationId: createdTemplate.organizationId,
          }))
        : [
            {
              templateId: createdTemplate.id,
              organizationId: createdTemplate.organizationId,
            },
          ]
    );

    await TemplateTarget.bulkCreate(
      targets.length > 0
        ? targets.map(({ targetType, rules }) => ({
            templateId: createdTemplate.id,
            targetType,
            rules,
            organizationId: createdTemplate.organizationId,
          }))
        : [
            {
              templateId: createdTemplate.id,
              organizationId: createdTemplate.organizationId,
            },
          ]
    );

    /* Dup inline embed injections */
    if (
      template.formFactor === GuideFormFactor.inline &&
      template.isSideQuest
    ) {
      await duplicateInlineEmbeds({
        sourceTemplate: template,
        destinationTemplate: createdTemplate,
      });
    }

    await duplicatePrototypeTaggedElementOfTemplate({
      organization,
      originalTemplate: template,
      copyTemplate: createdTemplate,
    });

    const copyingFromTemplate = usingTemplate || template.isTemplate;

    const modules = (
      await TemplateModule.scope(['withModule', 'byOrderIndex']).findAll({
        where: { templateId: template.id },
      })
    ).map((tm) => tm.module) as Module[];

    await promises.mapSeries(modules, async (module, orderIndex) => {
      if (useExistingModules && !copyingFromTemplate) {
        return await TemplateModule.create({
          templateId: createdTemplate.id,
          moduleId: module.id,
          organizationId: organization.id,
          orderIndex,
        });
      }

      const newModule = await duplicateModule({
        module,
        theme: createdTemplate.theme,
        organization,
        user,
        preserveName: copyingFromTemplate ? true : false,
      });

      await TemplateModule.create({
        templateId: createdTemplate.id,
        moduleId: newModule.id,
        organizationId: organization.id,
        orderIndex,
      });
    });

    // duplicate all step-level tags from the original template to the copy
    await duplicatePrototypeTaggedElementOfSteps({
      organization,
      originalTemplate: template,
      copyTemplate: createdTemplate,
    });

    return createdTemplate;
  });
}

export const getBranchingTargetModules = async (template: Template) => {
  const rows = (await queryRunner({
    sql: `SELECT m.id FROM core.branching_paths bp
			JOIN core.modules m ON bp.module_id = m.id
			JOIN core.step_prototypes sp ON bp.branching_key = sp.entity_id
			JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
			JOIN core.templates_modules tm ON tm.module_id = msp.module_id
			WHERE tm.template_id = :templateId;`,
    replacements: {
      templateId: template.id,
    },
  })) as { id: number }[];

  const mIds = rows.map((r) => r.id);

  if (!mIds.length) return [];

  return await Module.findAll({ where: { id: mIds } });
};
