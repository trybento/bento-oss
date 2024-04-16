import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { VisualTagStyleSettingsType } from 'bento-common/graphql/visualTags';
import EntityIdType, { entityIdField } from 'bento-common/graphql/EntityId';
import { DEFAULT_TAG_TEXT } from 'bento-common/utils/constants';

import {
  ContextTagTypeEnumType,
  ContextTagAlignmentEnumType,
  ContextTagTooltipAlignmentEnumType,
} from 'src/graphql/StepPrototypeTaggedElement/StepPrototypeTaggedElement.graphql';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import {
  GuideDesignTypeEnumType,
  GuideFormFactorEnumType,
} from 'src/graphql/Template/Template.graphql';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { EmbedContext } from 'src/graphql/types';
import { dynamicAttributesResolver } from '../resolvers';

const EmbedTaggedElementType = new GraphQLObjectType<
  StepTaggedElement,
  EmbedContext
>({
  name: 'EmbedTaggedElement',
  fields: () => ({
    ...globalEntityId('EmbedTaggedElement'),
    ...entityIdField(),
    /**
     * @deprecated should only be used in the admin context (i.e. previews)
     */
    url: {
      deprecationReason: 'use `wildcardUrl` instead',
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (tag, _, { loaders }) => {
        return (await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
          tag.id
        ))!.url;
      },
    },
    wildcardUrl: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (tag, _, { loaders, account, accountUser }) => {
        const ref =
          await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
            tag.id
          );

        return dynamicAttributesResolver(
          ref!.wildcardUrl,
          account,
          accountUser
        );
      },
    },
    elementSelector: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (tag, _, { loaders }) => {
        return (await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
          tag.id
        ))!.elementSelector;
      },
    },
    type: {
      type: new GraphQLNonNull(ContextTagTypeEnumType),
      resolve: async (tag, _, { loaders }) => {
        return (await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
          tag.id
        ))!.type;
      },
    },
    alignment: {
      type: new GraphQLNonNull(ContextTagAlignmentEnumType),
      resolve: async (tag, _, { loaders }) => {
        return (await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
          tag.id
        ))!.alignment;
      },
    },
    xOffset: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (tag, _, { loaders }) => {
        return (await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
          tag.id
        ))!.xOffset;
      },
    },
    yOffset: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (tag, _, { loaders }) => {
        return (await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
          tag.id
        ))!.yOffset;
      },
    },
    relativeToText: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (tag, _, { loaders }) => {
        return (await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
          tag.id
        ))!.relativeToText;
      },
    },
    tooltipAlignment: {
      type: new GraphQLNonNull(ContextTagTooltipAlignmentEnumType),
      resolve: async (tag, _, { loaders }) => {
        return (await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
          tag.id
        ))!.tooltipAlignment;
      },
    },
    style: {
      type: VisualTagStyleSettingsType,
      resolve: async (tag, _, { loaders }) => {
        const ref =
          await loaders.stepPrototypeTaggedElementOfStepTaggedElementLoader.load(
            tag.id
          );
        return ref?.style
          ? {
              ...ref.style,
              opacity: ref.style.opacity ?? 0.2,
              text: ref.style.text ?? DEFAULT_TAG_TEXT,
            }
          : undefined;
      },
    },
    tooltipTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title for the tooltip component',
      resolve: async (tag, _args, { loaders }) => {
        return loaders.titleOfStepTaggedElementLoader.load(tag.id);
      },
    },
    isSideQuest: {
      deprecationReason: 'use designType instead',
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether this visual tag is about a side quest or a main quest.',
      resolve: async (tag, _args, { loaders }) => {
        return (await loaders.templateOfStepTaggedElementLoader.load(tag.id))
          ?.isSideQuest;
      },
    },
    dismissedAt: {
      type: GraphQLDateTime,
      description: 'Date of tag dismissal, if any',
      resolve: async (tag, _args, { loaders, accountUser }) => {
        return (
          await loaders.stepTaggedElementParticipantForTagAndAccountUserLoader.load(
            {
              tagId: tag.id,
              accountUserId: accountUser.id,
            }
          )
        )?.dismissedAt;
      },
    },
    designType: {
      type: new GraphQLNonNull(GuideDesignTypeEnumType),
      description: 'The design type for the related guide',
      resolve: async (tag, _args, { loaders }) => {
        return (await loaders.templateOfStepTaggedElementLoader.load(tag.id))
          ?.designType;
      },
    },
    formFactor: {
      type: new GraphQLNonNull(GuideFormFactorEnumType),
      description: 'The form factor for the related guide',
      resolve: async (tag, _args, { loaders }) => {
        return (await loaders.templateOfStepTaggedElementLoader.load(tag.id))
          ?.formFactor;
      },
    },
    step: {
      type: EntityIdType,
      resolve: async (tag, _args, { loaders }) => {
        const step = tag.stepId
          ? await loaders.stepLoader.load(tag.stepId)
          : null;
        return step?.entityId;
      },
    },
    guide: {
      type: new GraphQLNonNull(EntityIdType),
      resolve: async (tag, _args, { loaders }) => {
        return (await loaders.guideLoader.load(tag.guideId || 0))?.entityId;
      },
    },
  }),
});

export default EmbedTaggedElementType;
