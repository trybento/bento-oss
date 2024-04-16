import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { AuditEvent, GuideTypeEnum } from 'bento-common/types';

import TemplateType from 'src/graphql/Template/Template.graphql';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { withTransaction } from 'src/data';
import AuditContext, { AuditType } from 'src/utils/auditContext';
import { removeUndefined } from 'src/utils/helpers';
import { Template } from 'src/data/models/Template.model';
import { validateSchedulingFields } from 'src/graphql/Template/mutations/helpers';
import { enableInternalGuideNames } from 'src/utils/features';
import { TemplateInput } from './editTemplate';
import { GraphQLDateTime } from 'graphql-iso-date';
import { graphQlError } from 'src/graphql/utils';

interface EditSplitTestTemplateMutationArgs {
  templateData: Pick<
    TemplateInput,
    | 'entityId'
    | 'name'
    | 'privateName'
    | 'enableAutoLaunchAt'
    | 'disableAutoLaunchAt'
    | 'description'
  >;
}

const EditSplitTestTemplateInputType = new GraphQLInputObjectType({
  name: 'EditSplitTestTemplateTemplateInput',
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
    enableAutoLaunchAt: {
      type: GraphQLDateTime,
    },
    disableAutoLaunchAt: {
      type: GraphQLDateTime,
    },
  },
});

export default generateMutation({
  name: 'EditSplitTestTemplate',
  description: 'Editing the contents of an existing split test template',
  inputFields: {
    templateData: {
      type: new GraphQLNonNull(EditSplitTestTemplateInputType),
    },
  },
  outputFields: {
    template: {
      type: TemplateType,
    },
  },
  mutateAndGetPayload: async (
    { templateData }: EditSplitTestTemplateMutationArgs,
    { organization, user }
  ) => {
    const template = await Template.findOne({
      where: {
        entityId: templateData.entityId,
        organizationId: organization.id,
      },
    });

    if (!template) return { errors: ['Template not found'] };
    if (template.type !== GuideTypeEnum.splitTest)
      return { errors: ['Cannot modify new split test templates'] };

    let schedulingFields;
    try {
      schedulingFields = validateSchedulingFields(templateData, template.state);
    } catch (e: any) {
      return graphQlError(e.message);
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

    const usePublicName = !template.privateName || !useInternalNames;

    await withTransaction(async () => {
      const newData = {
        name: templateData.name,
        displayTitle: templateData.name,
        privateName: usePublicName
          ? templateData.name
          : templateData.privateName,
        description: templateData.description,
        updatedByUserId: user.id,
        ...schedulingFields,
      };

      removeUndefined(newData);
      template.set(newData as Template);

      const changed = template.changed();
      templateChanges += Array.isArray(changed) ? changed.length : 0;

      // Update template 'updatedAt' timestamp.
      template.changed('displayTitle', true);
      await template.save();
      return template;
    });

    await template.reload();

    if (templateChanges > 0) {
      auditContext.logEvent({
        eventName: AuditEvent.contentChanged,
      });
    }

    return { template };
  },
});
