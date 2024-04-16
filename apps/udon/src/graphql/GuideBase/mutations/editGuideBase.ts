import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';
import GuideBaseType from 'src/graphql/GuideBase/GuideBase.graphql';
import {
  editGuideBase,
  EditGuideBaseData,
} from 'src/interactions/editGuideBase';
import { StepTypeEnumType } from 'src/graphql/graphQl.types';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { SelectedModelAttrs } from 'src/../../common/types';
import { Template } from 'src/data/models/Template.model';

const EditGuideStepBaseInputType = new GraphQLInputObjectType({
  name: 'EditGuideStepBaseInput',
  fields: {
    entityId: {
      type: EntityId,
    },
    createdFromStepPrototypeEntityId: {
      type: EntityId,
    },
    name: {
      type: GraphQLString,
      deprecationReason: 'To be removed. UI no longer allows changing it',
    },
    bodySlate: {
      type: GraphQLJSON,
    },
    stepType: {
      type: new GraphQLNonNull(StepTypeEnumType),
    },
    dismissLabel: {
      type: GraphQLString,
    },
  },
});

const EditGuideModuleBaseInputType = new GraphQLInputObjectType({
  name: 'EditGuideModuleBaseInput',
  fields: {
    entityId: {
      type: EntityId,
    },
    createdFromModuleEntityId: {
      type: EntityId,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    steps: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(EditGuideStepBaseInputType))
      ),
    },
  },
});

const EditGuideBaseInputType = new GraphQLInputObjectType({
  name: 'EditGuideBaseGuideBaseInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
    modules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(EditGuideModuleBaseInputType))
      ),
    },
  },
});

type Args = {
  guideBaseEntityId: string;
  data: EditGuideBaseData;
};

export default generateMutation<unknown, Args>({
  name: 'EditGuideBase',
  description: 'Edit an existing guide base',
  inputFields: {
    guideBaseEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    data: {
      type: new GraphQLNonNull(EditGuideBaseInputType),
    },
  },
  outputFields: {
    guideBase: {
      type: GuideBaseType,
    },
  },
  mutateAndGetPayload: async (
    { guideBaseEntityId, data },
    { organization, user }
  ) => {
    const guideBase = (await GuideBase.scope({
      method: [
        'withTemplate',
        {
          required: true,
          attributes: ['name'],
        },
      ],
    }).findOne({
      where: {
        entityId: guideBaseEntityId,
        organizationId: organization.id,
      },
    })) as
      | null
      | (GuideBase & {
          createdFromTemplate: SelectedModelAttrs<Template, 'name'>;
        });

    if (!guideBase) {
      return {
        errors: ['Guide base not found'],
      };
    }

    const moduleWithoutStepsFound =
      data.modules.findIndex((moduleData) => moduleData.steps.length === 0) !==
      -1;
    if (moduleWithoutStepsFound) {
      throw new Error(`Modules without steps can't be added to a guide.`);
    }

    await editGuideBase({
      existingGuideBase: guideBase,
      editGuideBaseData: data,
      user,
    });

    await guideBase.reload();

    await queueJob({
      jobType: JobType.SyncTemplateChanges,
      type: 'guideBase',
      guideBaseId: guideBase.id,
      organizationId: organization.id,
    });

    return { guideBase };
  },
});
