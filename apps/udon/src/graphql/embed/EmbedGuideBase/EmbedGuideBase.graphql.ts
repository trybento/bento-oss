import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { guideNameOrFallback } from 'bento-common/utils/naming';

const EmbedGuideBaseType = new GraphQLObjectType({
  name: 'EmbedGuideBase',
  description: 'A guide base for a guide displayed to an end user',
  fields: {
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the guide base',
      resolve: async (guideBase, _, { loaders }) => {
        const ref = await loaders.templateLoader.load(
          guideBase.createdFromTemplateId || 0
        );
        return guideNameOrFallback(ref?.name);
      },
    },
  },
});

export default EmbedGuideBaseType;
