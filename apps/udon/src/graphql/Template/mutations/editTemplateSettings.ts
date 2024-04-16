import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { pick } from 'lodash';
import {
  GuideTypeEnum,
  GuideFormFactor,
  GuidePageTargetingType,
  NotificationSettings,
} from 'bento-common/types';
import EntityId from 'bento-common/graphql/EntityId';
import {
  isAnnouncementGuide,
  isFlowGuide,
  isTooltipGuide,
} from 'bento-common/utils/formFactor';

import TemplateType, {
  GuideTypeEnumType,
  GuideFormFactorEnumType,
  GuidePageTargetingEnumType,
  notificationSettingsFields,
} from 'src/graphql/Template/Template.graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { withTransaction } from 'src/data';
import { Template } from 'src/data/models/Template.model';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import { removeUndefined } from 'src/utils/helpers';
import { validateSchedulingFields } from 'src/graphql/Template/mutations/helpers';
import { deleteExistingInlineEmbed } from 'src/interactions/inlineEmbeds/deleteExistingInlineEmbeds';
import { graphQlError } from 'src/graphql/utils';
import { shouldDeleteTemplatePrototypeTag } from 'src/interactions/taggedElements/helpers';
import deletePrototypeTaggedElement from 'src/interactions/taggedElements/deletePrototypeTaggedElement';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { templateAllowsInlineEmbedding } from 'src/interactions/inlineEmbeds/helpers';
import { NotificationSettingsInputType, TemplateInput } from './editTemplate';

interface EditTemplateSettingsMutationArgs {
  templateData: TemplateInput;
}

const EditTemplateSettingsInputType = new GraphQLInputObjectType({
  name: 'EditTemplateSettingsTemplateInput',
  fields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    privateName: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    type: {
      type: GuideTypeEnumType,
    },
    formFactor: {
      type: GuideFormFactorEnumType,
    },
    pageTargetingType: {
      type: GuidePageTargetingEnumType,
    },
    pageTargetingUrl: {
      type: GraphQLString,
    },
    enableAutoLaunchAt: {
      type: GraphQLString,
    },
    disableAutoLaunchAt: {
      type: GraphQLString,
    },
    notificationSettings: {
      type: NotificationSettingsInputType,
    },
  },
});

const fieldsToSaveAndSync: Array<keyof Template> = [
  'name',
  'description',
  'type',
  'formFactor',
  'pageTargetingType',
  'pageTargetingUrl',
  'notificationSettings',
];

/**
 * @todo Deprecate. This is safe to remove and only kept for deploy support
 */
export default generateMutation({
  name: 'EditTemplateSettings',
  description: 'Change the settings of an existing template',
  inputFields: {
    templateData: {
      type: new GraphQLNonNull(EditTemplateSettingsInputType),
    },
  },
  outputFields: {
    template: {
      type: TemplateType,
    },
  },
  mutateAndGetPayload: async (
    { templateData }: EditTemplateSettingsMutationArgs,
    { organization, user }
  ) => {
    const template = await Template.findOne({
      where: {
        entityId: templateData.entityId,
        organizationId: organization.id,
      },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    let schedulingFields;
    try {
      schedulingFields = validateSchedulingFields(templateData, template.state);
    } catch (e: any) {
      return graphQlError(e.message);
    }

    await withTransaction(async () => {
      if (shouldDeleteTemplatePrototypeTag(template, templateData)) {
        await deletePrototypeTaggedElement({
          template,
          organization,
        });
      }

      const data = {
        ...pick(templateData, fieldsToSaveAndSync),
        privateName: templateData.privateName,
        updatedByUserId: user.id,
        ...schedulingFields,
      };

      if (
        template.isSideQuest &&
        !isTooltipGuide(template.formFactor) &&
        !isAnnouncementGuide(template.formFactor) &&
        !isFlowGuide(template.formFactor)
      ) {
        data.formFactor =
          templateData.pageTargetingType === GuidePageTargetingType.inline
            ? GuideFormFactor.inline
            : GuideFormFactor.sidebar;
      }

      removeUndefined(data);
      template.set(data as Partial<Template>);
      if (template.changed()) {
        new AuditContext({
          type: AuditType.Template,
          modelId: template.id,
          organizationId: organization.id,
          userId: user.id,
        }).logEvent({
          eventName: AuditEvent.settingsChanged,
        });
      }

      await template.save();

      if (!templateAllowsInlineEmbedding(template)) {
        await deleteExistingInlineEmbed({ template });
      }
    });

    await queueJob({
      jobType: JobType.SyncTemplateChanges,
      type: 'template',
      templateId: template.id,
      organizationId: organization.id,
    });

    return { template };
  },
});
