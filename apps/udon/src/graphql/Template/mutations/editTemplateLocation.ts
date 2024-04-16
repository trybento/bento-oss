import { GraphQLNonNull, GraphQLString } from 'graphql';
import TemplateType from 'src/graphql/Template/Template.graphql';
import EntityId from 'bento-common/graphql/EntityId';
import {
  AuditEvent,
  GuideDesignType,
  GuidePageTargetingType,
} from 'bento-common/types';
import { usesFirstStepTagLocation } from 'bento-common/utils/formFactor';

import generateMutation from 'src/graphql/helpers/generateMutation';
import { Template } from 'src/data/models/Template.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import AuditContext, { AuditType } from 'src/utils/auditContext';
import { logger } from 'src/utils/logger';
import { graphQlError } from 'src/graphql/utils';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

interface MutationArgs {
  entityId: string;
  wildcardUrl: string;
  url: string;
  inlineEmbedEntityId?: string;
}

export default generateMutation({
  name: 'EditTemplateLocation',
  description: 'Editing the location of a template',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    wildcardUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    inlineEmbedEntityId: {
      type: EntityId,
    },
  },
  outputFields: {
    template: {
      type: TemplateType,
    },
  },
  mutateAndGetPayload: async (
    { entityId, wildcardUrl, url, inlineEmbedEntityId }: MutationArgs,
    { organization, user, loaders }
  ) => {
    const template: Template | null = await Template.findOne({
      where: {
        entityId,
        organizationId: organization.id,
      },
    });

    if (!template) return graphQlError('Template not found');

    let editingGlobalLocation = false;

    if (template.pageTargetingType === GuidePageTargetingType.visualTag) {
      const supportsFirstStepTagLocation = usesFirstStepTagLocation(
        template.formFactor
      );

      const firstStep: StepPrototype | undefined = supportsFirstStepTagLocation
        ? (await loaders.stepPrototypesOfTemplateLoader.load(template.id))[0]
        : undefined;

      const tag = await StepPrototypeTaggedElement.findOne({
        where: {
          templateId: template.id,
          stepPrototypeId: firstStep?.id || null,
        },
      });

      if (!tag) return graphQlError('Tagged element not found');

      await tag.update({ wildcardUrl, url });
    } else if (
      (template.designType === GuideDesignType.onboarding &&
        inlineEmbedEntityId) ||
      template.pageTargetingType === GuidePageTargetingType.inline
    ) {
      const orgInlineEmbed = await OrganizationInlineEmbed.findOne({
        where: {
          entityId: inlineEmbedEntityId,
          organizationId: organization.id,
        },
      });

      if (!orgInlineEmbed)
        return graphQlError('Organization inline embed not found');

      await orgInlineEmbed.update({
        wildcardUrl,
        url,
      });

      editingGlobalLocation = true;
    } else if (
      template.pageTargetingType === GuidePageTargetingType.specificPage
    ) {
      template.set({ pageTargetingUrl: wildcardUrl });

      await template.save();

      logger.info(
        `[editTemplateLocation] Calling sync template changes on template id: ${template.id}, '${template.name}' for organization ${organization.name}`
      );

      await queueJob({
        jobType: JobType.SyncTemplateChanges,
        type: 'template',
        templateId: template.id,
        organizationId: organization.id,
      });

      await template.reload();
    }

    if (!editingGlobalLocation)
      new AuditContext({
        type: AuditType.Template,
        modelId: template.id,
        organizationId: organization.id,
        userId: user.id,
      }).logEvent({
        eventName: AuditEvent.locationChanged,
      });

    return { template };
  },
});
