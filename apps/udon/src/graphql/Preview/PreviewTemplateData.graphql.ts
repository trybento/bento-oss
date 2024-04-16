import { GraphQLObjectType } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';

import { GraphQLContext } from 'src/graphql/types';
import { Template } from 'src/data/models/Template.model';
import { getTemplateDataForPreview } from 'src/interactions/preview/getTemplateDataForPreview';

const PreviewTemplateDataType = new GraphQLObjectType<Template, GraphQLContext>(
  {
    name: 'PreviewTemplateData',
    fields: () => ({
      ...globalEntityId('Template'),
      ...entityIdField(),
      previewData: {
        type: GraphQLJSON,
        description: 'The full template data in JSON format',
        resolve: async (template) => getTemplateDataForPreview({ template }),
      },
    }),
  }
);

export default PreviewTemplateDataType;
