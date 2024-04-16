import { GraphQLNonNull } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import { INTERNAL_TEMPLATE_ORG } from 'bento-common/utils/constants';

import generateMutation from 'src/graphql/helpers/generateMutation';
import TemplateType from '../Template.graphql';
import duplicateTemplate from 'src/interactions/library/duplicateTemplate';
import { Template } from 'src/data/models/Template.model';
import { Organization } from 'src/data/models/Organization.model';
import { analytics, Events } from 'src/interactions/analytics/analytics';

interface BootstrapTemplateMutationArgs {
  entityId: string;
}

export default generateMutation({
  name: 'BootstrapTemplate',
  description:
    'Cross-org duplication for the purposes of templating or managing source templates',
  inputFields: {
    entityId: {
      description: 'Entity ID of the target/source guide',
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    template: {
      type: TemplateType,
    },
  },
  mutateAndGetPayload: async (
    { entityId }: BootstrapTemplateMutationArgs,
    { organization, user }
  ) => {
    /** Determines the type of action/restrictions we enforce */
    const isCreatingSource = organization.slug === INTERNAL_TEMPLATE_ORG;

    /** If we aren't in the internal org then we should only duplicate from it. */
    const template = await Template.findOne({
      where: {
        entityId: entityId,
      },
      ...(isCreatingSource
        ? {}
        : {
            include: [
              {
                model: Organization,
                where: {
                  slug: INTERNAL_TEMPLATE_ORG,
                },
                required: true,
                attributes: ['slug'],
              },
            ],
          }),
    });

    if (!template) return { errors: ['Template not found'] };

    /* Safeguard */
    if (
      !isCreatingSource &&
      template.organization?.slug !== INTERNAL_TEMPLATE_ORG
    )
      return { errors: ['Invalid source'] };

    const newTemplate = await duplicateTemplate({
      template,
      organization,
      user,
      preserveName: true,
      useExistingModules: false,
      markAsTemplate: false,
      usingTemplate: true,
    });

    /** Log that the bootstrapping happened if it's a user */
    if (!isCreatingSource)
      void analytics.newEvent(Events.templateBootstrapped, {
        organizationEntityId: organization.entityId,
        userEntityId: user.entityId,
        sourceTemplate: template.id,
        createdTemplate: newTemplate.id,
      });

    return { template: newTemplate };
  },
});
