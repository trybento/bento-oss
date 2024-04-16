import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { keyBy } from 'lodash';
import { GraphQLDateTime } from 'graphql-iso-date';
import { Op } from 'sequelize';
import {
  assert,
  enums,
  nullable,
  number,
  optional,
  type,
  StructError,
  min,
  max,
} from 'superstruct';
import { $enum } from 'ts-enum-util';

import {
  GuidePageTargetingType,
  FormFactorStyle,
  AuditEvent,
  GuideFormFactor,
  Theme,
  GuideExpirationCriteria,
  TagInput,
  InlineEmbedInput,
  GuideTypeEnum,
  NotificationSettings,
  Mutable,
} from 'bento-common/types';
import { FormFactorStyleInputType } from 'bento-common/graphql/formFactorStyle';
import {
  areStepDetailsHidden,
  isAnnouncementGuide,
  isFlowGuide,
  isTooltipGuide,
} from 'bento-common/utils/formFactor';
import { nameAndPrivateNameShouldMatch } from 'bento-common/utils/naming';
import { getCompatibleThemes, isCardTheme } from 'bento-common/data/helpers';
import EntityId from 'bento-common/graphql/EntityId';

import TemplateType, {
  GuideExpirationCriteriaEnumType,
  GuidePageTargetingEnumType,
  GuideTypeEnumType,
  notificationSettingsFields,
} from 'src/graphql/Template/Template.graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { withTransaction } from 'src/data';
import AuditContext, { AuditType } from 'src/utils/auditContext';
import { removeUndefined } from 'src/utils/helpers';
import { Template } from 'src/data/models/Template.model';
import {
  validateFormFactorStyles,
  validateSchedulingFields,
} from 'src/graphql/Template/mutations/helpers';
import { ThemeType } from 'src/graphql/Organization/Organization.graphql';
import { Module } from 'src/data/models/Module.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { enableInternalGuideNames } from 'src/utils/features';
import {
  EditTaggedElementInputType,
  ModuleInput,
  ModuleInputType,
  validateStepPrototypes,
} from 'src/graphql/Module/mutations/moduleMutations.helpers';
import editModule from 'src/interactions/library/editModule';
import createModule from 'src/interactions/library/createModule';
import { deleteExistingInlineEmbed } from 'src/interactions/inlineEmbeds/deleteExistingInlineEmbeds';
import { graphQlError } from 'src/graphql/utils';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { shouldDeleteTemplatePrototypeTag } from 'src/interactions/taggedElements/helpers';
import deletePrototypeTaggedElement from 'src/interactions/taggedElements/deletePrototypeTaggedElement';
import upsertPrototypeTaggedElement from 'src/interactions/taggedElements/upsertPrototypeTaggedElement';
import upsertInlineEmbed from 'src/interactions/inlineEmbeds/upsertInlineEmbed';
import { UpsertInlineEmbedInputType } from 'src/graphql/InlineEmbed/mutations/common';
import { templateAllowsInlineEmbedding } from 'src/interactions/inlineEmbeds/helpers';

export interface TemplateInput {
  entityId: string;
  name: string;
  theme?: Theme;
  privateName?: string;
  description?: string;
  modules: ModuleInput[];
  type?: GuideTypeEnum;
  pageTargetingType?: GuidePageTargetingType;
  pageTargetingUrl?: string;
  enableAutoLaunchAt: string | null;
  disableAutoLaunchAt: string | null;
  formFactorStyle?: FormFactorStyle;
  taggedElements?: TagInput[];
  inlineEmbed?: InlineEmbedInput;
  notificationSettings?: NotificationSettings;
}

interface EditTemplateMutationArgs {
  templateData: TemplateInput;
}

export const NotificationSettingsInputType = new GraphQLInputObjectType({
  name: 'NotificationSettingsInputType',
  fields: {
    ...notificationSettingsFields,
  },
});

const EditTemplateInputType = new GraphQLInputObjectType({
  name: 'EditTemplateTemplateInput',
  fields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    name: {
      type: GraphQLString,
    },
    privateName: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    pageTargetingType: {
      type: GuidePageTargetingEnumType,
    },
    pageTargetingUrl: {
      type: GraphQLString,
    },
    enableAutoLaunchAt: {
      type: GraphQLDateTime,
    },
    disableAutoLaunchAt: {
      type: GraphQLDateTime,
    },
    expireBasedOn: {
      type: GuideExpirationCriteriaEnumType,
    },
    expireAfter: {
      type: GraphQLInt,
    },
    modules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ModuleInputType))
      ),
    },
    type: {
      type: GuideTypeEnumType,
    },
    formFactorStyle: {
      type: FormFactorStyleInputType,
    },
    theme: {
      type: ThemeType,
    },
    notificationSettings: {
      type: NotificationSettingsInputType,
    },
    taggedElements: {
      type: new GraphQLList(new GraphQLNonNull(EditTaggedElementInputType)),
    },
    inlineEmbed: { type: UpsertInlineEmbedInputType },
  },
});

const GuideExpirySchema = type({
  expireBasedOn: optional(
    nullable(enums($enum(GuideExpirationCriteria).getValues()))
  ),
  expireAfter: optional(nullable(min(max(number(), 999), 1))),
});

export default generateMutation<unknown, EditTemplateMutationArgs>({
  name: 'EditTemplate',
  description: 'Editing the contents of an existing template',
  inputFields: {
    templateData: {
      type: new GraphQLNonNull(EditTemplateInputType),
    },
  },
  outputFields: {
    template: {
      type: TemplateType,
    },
  },
  mutateAndGetPayload: async ({ templateData }, { organization, user }) => {
    const template: Template | null = await Template.findOne({
      where: {
        entityId: templateData.entityId,
        organizationId: organization.id,
      },
    });

    if (!template) return graphQlError('Template not found');

    const newTheme = templateData.theme || template.theme;

    const newTargetingType =
      templateData.pageTargetingType || template.pageTargetingType;

    // Validate theme change
    const compatibleThemes = getCompatibleThemes(template.theme);
    if (compatibleThemes.length > 0 && !compatibleThemes.includes(newTheme)) {
      return graphQlError(
        `Template change not supported. Current: ${template.theme}, New: ${newTheme}`
      );
    }

    let schedulingFields: ReturnType<typeof validateSchedulingFields>;
    try {
      schedulingFields = validateSchedulingFields(templateData, template.state);
    } catch (e: any) {
      return graphQlError(e.message);
    }

    // Validate specific form factor styles
    await validateFormFactorStyles(template, templateData);

    // Check whether page targeting is allowed
    if (
      isAnnouncementGuide(template.formFactor) &&
      templateData.pageTargetingType === GuidePageTargetingType.visualTag
    ) {
      return graphQlError(`Announcements can not be targeted by visual tag`);
    }

    try {
      // validate guide expiry
      assert(templateData, GuideExpirySchema);
    } catch (innerError) {
      if (innerError instanceof StructError) {
        return graphQlError('Invalid guide duration settings');
      }
      throw innerError;
    }

    const skipStepNameValidation = areStepDetailsHidden(
      template.formFactor!,
      newTheme
    );

    // Validate step branching and inputs
    for (const moduleData of templateData.modules || []) {
      if (moduleData.stepPrototypes.length === 0)
        return { errors: ['At least one step is required'] };

      const validationErrors = await validateStepPrototypes({
        input: moduleData.stepPrototypes || [],
        theme: newTheme,
        allowNamelessSteps: skipStepNameValidation,
        shouldValidateCtas: isFlowGuide(template.formFactor),
      });

      if (validationErrors) return validationErrors;
    }

    // Validate scope
    const hasAtLeastOneActiveGuideBase = !!(await GuideBase.findOne({
      attributes: ['id'],
      where: {
        createdFromTemplateId: template.id,
        state: { [Op.ne]: 'draft' },
      },
    }));

    if (hasAtLeastOneActiveGuideBase && templateData.type !== template.type) {
      return graphQlError('Cannot change scope of active guide templates.');
    }

    const moduleWithoutStepsFound =
      templateData.modules.findIndex(
        (moduleData) => moduleData.stepPrototypes.length === 0
      ) !== -1;
    if (moduleWithoutStepsFound)
      return graphQlError(`Modules without steps can't be added to a guide.`);

    const moduleEntityIdRows = templateData.modules
      .map((module) => module.entityId)
      .filter(Boolean);

    let modulesByEntityId: Record<string, Module> = {};
    if (moduleEntityIdRows.length > 0) {
      const modules = await Module.findAll({
        where: {
          entityId: moduleEntityIdRows,
        },
      });

      modulesByEntityId = keyBy(modules, 'entityId');
    }

    const auditContext = new AuditContext({
      type: AuditType.Template,
      modelId: template.id,
      organizationId: organization.id,
      userId: user.id,
    });

    let templateChanges = 0;

    const useInternalNames = await enableInternalGuideNames.enabled(
      organization
    );

    /* It may be worth making it an allowlist for formFactor instead, depending how things proceed */
    const usePublicName =
      !template.privateName ||
      !useInternalNames ||
      nameAndPrivateNameShouldMatch(template.formFactor, newTheme);

    // Determine whether expiration settings changed
    const expirationChanged =
      template.expireBasedOn !== templateData.expireBasedOn ||
      template.expireAfter !== templateData.expireAfter;

    await withTransaction(async () => {
      const newData: Partial<Mutable<Template>> = {
        name: templateData.name,
        /** @todo cleanup displayTitle */
        displayTitle: templateData.name,
        privateName: usePublicName
          ? templateData.name
          : templateData.privateName,
        theme: newTheme,
        description: templateData.description,
        pageTargetingType: templateData.pageTargetingType,
        pageTargetingUrl: templateData.pageTargetingUrl,
        type: templateData.type,
        formFactorStyle: templateData.formFactorStyle,
        expireBasedOn: templateData.expireBasedOn,
        expireAfter: templateData.expireAfter,
        /** deprecate? */
        updatedByUserId: user.id,
        notificationSettings: templateData.notificationSettings,
        ...schedulingFields,
      };

      if (
        template.isSideQuest &&
        !isTooltipGuide(template.formFactor) &&
        !isAnnouncementGuide(template.formFactor) &&
        !isFlowGuide(template.formFactor) &&
        !isCardTheme(newTheme)
      ) {
        newData.formFactor =
          newTargetingType === GuidePageTargetingType.inline
            ? GuideFormFactor.inline
            : GuideFormFactor.sidebar;
      }

      removeUndefined(newData);
      template.set(newData);

      const changed = template.changed();
      templateChanges += Array.isArray(changed) ? changed.length : 0;

      // Update template 'updatedAt' timestamp.
      template.changed('name', true);
      await template.save();

      await TemplateModule.destroy({
        where: {
          templateId: template.id,
        },
      });

      const templateModuleCreateData: any = [];

      for (const [moduleIdx, moduleData] of templateData.modules.entries()) {
        const existingModule = modulesByEntityId[moduleData.entityId];

        let persistedModule: Module | { errors: string[] };

        if (existingModule) {
          persistedModule = await editModule(
            {
              module: existingModule,
              moduleData,
              organization,
              user,
              updatedFromTemplateId: template.id,
              skipStepNameValidation,
              onChangesCommitted: (changes) => {
                templateChanges += changes;
              },
            },
            { auditContext }
          );
        } else {
          templateChanges++;

          persistedModule = await createModule({
            moduleData,
            organization,
            user,
            template,
          });
        }

        if (!(persistedModule instanceof Module))
          throw new Error(`Validation error: ${persistedModule.errors?.[0]}`);

        templateModuleCreateData.push({
          templateId: template.id,
          moduleId: persistedModule.id,
          organizationId: organization.id,
          orderIndex: moduleIdx,
        });
      }

      await TemplateModule.bulkCreate(templateModuleCreateData, {
        ignoreDuplicates: true,
      });

      const tag = templateData?.taggedElements?.[0];

      if (shouldDeleteTemplatePrototypeTag(template, templateData) || !tag) {
        await deletePrototypeTaggedElement({
          template,
          organization,
        });
      } else if (tag) {
        await upsertPrototypeTaggedElement({
          input: tag,
          template,
          organization,
        });
      }

      const inlineEmbedData = templateData?.inlineEmbed;

      if (!templateAllowsInlineEmbedding(template) || !inlineEmbedData) {
        await deleteExistingInlineEmbed({ template });
      } else if (inlineEmbedData) {
        await upsertInlineEmbed({
          organization,
          template,
          inlineEmbed: inlineEmbedData,
        });
      }

      return template;
    });

    await template.reload();

    if (templateChanges > 0) {
      auditContext.logEvent({
        eventName: AuditEvent.contentChanged,
      });
    }

    await queueJob({
      jobType: JobType.SyncTemplateChanges,
      type: 'template',
      templateId: template.id,
      organizationId: organization.id,
    });

    // If expiration settings changed, we queue a job to sync
    // that information down to existing guides
    if (expirationChanged) {
      auditContext.logEvent({
        eventName: AuditEvent.expirationCriteriaChanged,
        data: {
          expireBasedOn: template.expireBasedOn,
          expireAfter: template.expireAfter,
        },
      });
      await queueJob({
        jobType: JobType.TemplateExpirationChanged,
        templateId: template.id,
      });
    }

    return { template };
  },
});
