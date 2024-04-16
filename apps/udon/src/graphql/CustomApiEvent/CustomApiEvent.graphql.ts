import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLEnumType,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';

import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { DataSource } from 'bento-common/types';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { CustomApiEvent } from 'src/data/models/CustomApiEvent.model';

import { GraphQLContext } from 'src/graphql/types';
import fetchAutocompleteStepsForEvent from 'src/interactions/fetchAutocompleteStepsForEvent';
import StepPrototypeType from '../StepPrototype/StepPrototype.graphql';
import AccountUserType from '../AccountUser/AccountUser.graphql';

export const CustomApiEventEnumType = new GraphQLEnumType({
  name: 'CustomApiEventEnum',
  description: 'What kind of step this is. e.g. required, optional',
  values: {
    event: { value: 'event' },
    eventProperty: { value: 'event-property' },
  },
});

const EventSourceType = enumToGraphqlEnum({
  name: 'EventSourceType',
  enumType: DataSource,
});

const EventDebugInformationType = new GraphQLObjectType({
  name: 'EventDebugInformation',
  fields: () => ({
    payload: {
      type: GraphQLJSON,
      description: 'Data sent to Bento',
    },
    autoCompletedSteps: {
      type: new GraphQLNonNull(new GraphQLList(StepPrototypeType)),
      description:
        'Whether this last instance of the event autocompleted any steps',
    },
    triggeredByAccountUser: {
      type: AccountUserType,
      description: 'Who triggered this event',
    },
  }),
});

const CustomApiEventType = new GraphQLObjectType<
  CustomApiEvent,
  GraphQLContext
>({
  name: 'CustomApiEvent',
  description: 'A custom event sent to us from an API',
  fields: () => ({
    ...globalEntityId('CustomApiEvent'),
    ...entityIdField(),
    name: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLNonNull(CustomApiEventEnumType),
      description: 'What kind of custom attribute we are looking at',
    },
    source: {
      type: EventSourceType,
      description: 'Where the attribute was created from',
    },
    updatedAt: {
      type: GraphQLDateTime,
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    lastSeen: {
      type: GraphQLDateTime,
    },
    debugInformation: {
      type: EventDebugInformationType,
      resolve: async ({ debugInformation }, _, { loaders }) => {
        const autoCompletedSteps = debugInformation?.autoCompletedStepIds
          ? await loaders.stepPrototypeLoader.loadMany(
              debugInformation.autoCompletedStepIds
            )
          : [];
        const triggeredByAccountUser =
          debugInformation?.triggeredByAccountUserId
            ? await loaders.accountUserLoader.load(
                debugInformation.triggeredByAccountUserId
              )
            : null;

        return {
          payload: debugInformation?.payload,
          autoCompletedSteps,
          triggeredByAccountUser,
        };
      },
    },
    autocompletes: {
      type: new GraphQLNonNull(new GraphQLList(StepPrototypeType)),
      description: 'What steps this event may autocomplete',
      resolve: (customApiEvent, _, { organization, loaders }) =>
        fetchAutocompleteStepsForEvent({
          eventName: customApiEvent.name,
          organization,
          internalProperties: customApiEvent.properties,
          loaders,
        }),
    },
    mappedToAutocomplete: {
      type: GraphQLBoolean,
      resolve: async (customApiEvent, _args, { organization, loaders }) => {
        const r = await fetchAutocompleteStepsForEvent({
          eventName: customApiEvent.name,
          organization,
          loaders,
          internalProperties: customApiEvent.properties,
          fetchOne: true,
        });
        return r.length > 0;
      },
    },
  }),
});

export default CustomApiEventType;
