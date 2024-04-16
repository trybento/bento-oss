import { GraphQLNonNull, GraphQLString } from 'graphql';
import { GraphQLInputObjectType } from 'graphql/type';

const EmbedFileUploadInputType = new GraphQLInputObjectType({
  name: 'EmbedFileUpload',
  description: 'A file to be uploaded',
  fields: () => ({
    originalname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    mimetype: {
      type: new GraphQLNonNull(GraphQLString),
    },
    path: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export default EmbedFileUploadInputType;
