import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import UserType from '../User/User.graphql';
import { AuditEvent } from 'src/utils/auditContext';

const AuditEventNameType = enumToGraphqlEnum({
  name: 'AuditEventNameEnumType',
  enumType: AuditEvent,
  description: 'The name of the audit event',
});

const AuditEventType = new GraphQLObjectType({
  name: 'AuditEvent',
  fields: () => ({
    ...globalEntityId('AuditEvent'),
    ...entityIdField(),
    eventName: {
      type: new GraphQLNonNull(AuditEventNameType),
      description: 'The name of the audit event',
    },
    timestamp: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'The time the event was logged',
    },
    user: {
      type: UserType,
      description: 'User that triggered this event',
    },
    data: {
      type: GraphQLString,
      /* Ideal state: typed according to eventName */
      description:
        'Arbitrary JSON string data providing context to audit event',
    },
  }),
});

export default AuditEventType;
