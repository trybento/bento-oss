import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  CreateGuideVariationEnum,
  GuideTypeEnum,
  TemplateState,
} from 'bento-common/types';

import generateMutation from 'src/graphql/helpers/generateMutation';
import TemplateType from 'src/graphql/Template/Template.graphql';

import { withTransaction } from 'src/data';
import { Template } from 'src/data/models/Template.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import EntityIdType from 'bento-common/graphql/EntityId';
import createTemplateSplitTargets from 'src/interactions/library/createTemplateSplitTargets';

interface CreateSplitTestTemplateInput {
  name: string;
  privateName?: string;
  description?: string;
  targetTemplates: Array<string | null>;
}

interface CreateTemplateMutationArgs {
  variation?: CreateGuideVariationEnum;
  templateData: CreateSplitTestTemplateInput;
}

const CreateTemplateInputType = new GraphQLInputObjectType({
  name: 'CreateSplitTestTemplateTemplateInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    privateName: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    targetTemplates: {
      type: new GraphQLNonNull(new GraphQLList(EntityIdType)),
    },
  },
});

export default generateMutation({
  name: 'CreateSplitTestTemplate',
  description: 'Creating a new template',
  inputFields: {
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
    { templateData }: CreateTemplateMutationArgs,
    { organization, user }
  ) => {
    const template = await withTransaction(async () => {
      const createdTemplate = await Template.create({
        organizationId: organization.id,
        state: TemplateState.draft,
        name: templateData.name,
        /** @todo cleanup displayTitle */
        displayTitle: templateData.name,
        privateName: templateData.privateName,
        description: templateData.description,
        type: GuideTypeEnum.splitTest,
        createdByUserId: user.id,
        updatedByUserId: user.id,
        editedByUserId: user.id,
        editedAt: new Date(),
      });

      await TemplateAutoLaunchRule.create({
        templateId: createdTemplate.id,
        organizationId: organization.id,
      });
      await TemplateTarget.create({
        templateId: createdTemplate.id,
        organizationId: organization.id,
      });

      return createdTemplate;
    });

    await createTemplateSplitTargets({
      sourceTemplate: template,
      targetTemplateEntityIds: templateData.targetTemplates,
    });

    return { template };
  },
});
