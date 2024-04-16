import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';

import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import StepType from 'src/graphql/Step/Step.graphql';

import { FileUpload } from 'src/data/models/FileUpload.model';
import { GraphQLContext } from 'src/graphql/types';

/**
 * @deprecated remove after D+7
 */
const FileUploadType = new GraphQLObjectType<FileUpload, GraphQLContext>({
  name: 'FileUpload',
  description: 'A guide used in an customer account journey',
  fields: () => ({
    ...globalEntityId('FileUpload'),
    ...entityIdField(),
    filename: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the file',
    },
    originalFilename: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The original filename of the file',
    },
    url: {
      type: GraphQLString,
      description: 'The url of the file',
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    step: {
      type: new GraphQLNonNull(StepType),
      description: 'The step in which this file was uploaded',
      resolve: (fileUpload, _, { loaders }) =>
        loaders.stepLoader.load(fileUpload.stepId),
    },
    accountUser: {
      type: AccountUserType,
      description: 'The account user that uploaded this file',
      resolve: (fileUpload, _, { loaders }) =>
        fileUpload.accountUserId
          ? loaders.accountUserLoader.load(fileUpload.accountUserId)
          : null,
    },
    participants: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      description: 'The account users that are participating in this guide',
      resolve: (guide, _, { loaders }) =>
        loaders.participantsOfGuideLoader.load(guide.id),
    },
  }),
});

export default FileUploadType;
