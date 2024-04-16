import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { entityIdField } from 'bento-common/graphql/EntityId';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { VisualBuilderContext } from 'src/graphql/types';
import { VisualBuilderSession } from 'src/data/models/VisualBuilderSession.model';
import { GraphQLJSONObject } from 'graphql-type-json';
import {
  VisualBuilderSessionTypeEnum,
  VisualBuilderSessionStateEnum,
} from 'src/graphql/graphQl.types';

const VisualBuilderSessionType = new GraphQLObjectType<
  VisualBuilderSession,
  VisualBuilderContext
>({
  name: 'VisualBuilderSession',
  fields: () => ({
    ...globalEntityId('VisualBuilderSession'),
    ...entityIdField(),
    type: {
      type: new GraphQLNonNull(VisualBuilderSessionTypeEnum),
      description: 'The type of editor session (e.g., tag, inline embed etc.)',
    },
    initialData: {
      type: new GraphQLNonNull(GraphQLJSONObject),
      description: 'Data used to initialize the editor',
    },
    progressData: {
      type: GraphQLJSONObject,
      description: 'Data representing the editors saved progress',
    },
    previewData: {
      type: GraphQLJSONObject,
      description:
        'Data used to render a preview of the editor changes in Shoyu',
    },
    state: {
      type: new GraphQLNonNull(VisualBuilderSessionStateEnum),
      description: 'The current state of the session',
    },
  }),
});

export default VisualBuilderSessionType;
