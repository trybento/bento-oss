import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';
import { GuideTypeEnum, Theme } from 'bento-common/types';

import EntityId from 'bento-common/graphql/EntityId';

import generateMutation from 'src/graphql/helpers/generateMutation';
import TemplateType, { GuideTypeEnumType } from '../Template.graphql';
import duplicateTemplate, {
  canDuplicateStepGroups,
  shouldDuplicateStepGroups,
} from 'src/interactions/library/duplicateTemplate';
import { getOrgSettings } from 'src/data/models/OrganizationSettings.model';
import { Template } from 'src/data/models/Template.model';
import { ThemeType } from 'src/graphql/Organization/Organization.graphql';
import NoContentError from 'src/errors/NoContentError';
import { withTransaction } from 'src/data';

interface DuplicateTemplateMutationArgs {
  entityId: string;
  type?: GuideTypeEnum;
  theme?: Theme;
  name?: string;
  duplicateStepGroups?: boolean;
}

export default generateMutation({
  name: 'DuplicateTemplate',
  description: 'Duplicate an existing template',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    type: {
      type: GuideTypeEnumType,
    },
    theme: {
      type: ThemeType,
    },
    name: {
      type: GraphQLString,
    },
    duplicateStepGroups: {
      type: GraphQLBoolean,
      description:
        'When set to true, all step groups will be duplicated. Can be enforced depending on the form factor',
    },
  },
  outputFields: {
    template: {
      type: TemplateType,
    },
  },
  mutateAndGetPayload: async (
    {
      entityId,
      type,
      theme,
      name,
      duplicateStepGroups,
    }: DuplicateTemplateMutationArgs,
    { organization, user }
  ) => {
    return withTransaction(async () => {
      const template = await Template.findOne({
        where: {
          entityId: entityId,
          organizationId: organization.id,
        },
      });

      if (!template) {
        throw new NoContentError(entityId, 'template');
      }

      /* Change the local obj for reference purposes, but don't persist for the original */
      if (name) {
        /** @todo cleanup displayTitle */
        template.set({ name, displayTitle: name });
      }
      if (type) template.set({ type });

      const newTheme = theme
        ? theme
        : (await getOrgSettings(organization)).theme;

      /**
       * @todo transform into validation error
       */
      if (duplicateStepGroups && !canDuplicateStepGroups(template, newTheme)) {
        throw new Error('Step group duplication not allowed for this template');
      }

      const newTemplate = await duplicateTemplate({
        newTheme,
        template,
        organization,
        user,
        useExistingModules: !(
          duplicateStepGroups || shouldDuplicateStepGroups(template, newTheme)
        ),
      });

      return { template: newTemplate };
    });
  },
});
