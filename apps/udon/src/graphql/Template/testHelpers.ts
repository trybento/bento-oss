import { v4 as uuidv4 } from 'uuid';
import {
  GuideBaseState,
  GuidePageTargetingType,
  GuideState,
  StepType,
  Theme,
} from 'bento-common/types';

import { Guide } from 'src/data/models/Guide.model';
import createGuideFromGuideBase from 'src/interactions/createGuideFromGuideBase';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { createGuideBase } from 'src/interactions/createGuideBase';
import { GraphQLTestHelpers } from './../testHelpers';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Module } from 'src/data/models/Module.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import type { TemplateInput } from 'src/graphql/Template/mutations/createTemplate';
import type { APITemplate } from 'src/graphql/Template/Template.graphql';
import { EmbedRequestUser } from '../types';
import { propagateTemplateChangesInPlace } from 'src/testUtils/tests.helpers';
import { Template } from 'src/data/models/Template.model';
import { withRetries } from 'src/utils/helpers';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';

type ReturnTemplate = Pick<APITemplate, 'id' | 'entityId'>;

const createTemplateMutationQuery = `
  mutation CreateTemplate($data: CreateTemplateInput!) {
    createTemplate(input: $data) {
      template {
        id
        entityId
      }
    }
  }
`;

type CreateQueryResponse = {
  data: { createTemplate: { template: ReturnTemplate } };
  errors: object[];
};

export async function createTemplateForTest(
  executeAdminQuery: GraphQLTestHelpers['executeAdminQuery'],
  embedContext: EmbedRequestUser,
  templateData: Partial<TemplateInput>,
  launch: true,
  priorityRanking?: number
): Promise<{
  template: ReturnTemplate;
  guideBase: GuideBase;
  guide: Guide;
  guideParticipant: GuideParticipant;
}>;
export async function createTemplateForTest(
  executeAdminQuery: GraphQLTestHelpers['executeAdminQuery'],
  embedContext: EmbedRequestUser,
  templateData: Partial<TemplateInput>,
  launch?: false,
  priorityRanking?: number
): Promise<{
  template: ReturnTemplate;
}>;
export async function createTemplateForTest(
  executeAdminQuery: GraphQLTestHelpers['executeAdminQuery'],
  embedContext: EmbedRequestUser,
  templateData: Partial<TemplateInput> = {},
  launch?: boolean,
  priorityRanking?: number
): Promise<{
  template: ReturnTemplate;
  guideBase?: GuideBase;
  guide?: Guide;
  guideParticipant?: GuideParticipant;
}> {
  const { organization, account, accountUser } = embedContext;
  const result = await withRetries(
    async () => {
      const res = (await executeAdminQuery({
        query: createTemplateMutationQuery,
        variables: {
          data: {
            templateData: {
              name: `template-${uuidv4()}`,
              type: 'user',
              modules: [],
              theme: Theme.nested,
              ...templateData,
            },
          },
        },
      })) as CreateQueryResponse;

      if (!res.data.createTemplate.template)
        throw new Error('Create template returned no response.');

      return res;
    },
    {
      max: 4,
    }
  );

  const {
    data: {
      createTemplate: { template },
    },
  } = result;

  if (priorityRanking || priorityRanking === 0)
    await Template.update(
      { priorityRanking },
      { where: { entityId: template.entityId } }
    );

  let guideBase: GuideBase | undefined = undefined;
  let guide: Guide | undefined = undefined;
  let guideParticipant: GuideParticipant | undefined = undefined;
  if (launch && organization && account && accountUser) {
    ({ guideBase, guide, guideParticipant } = await launchTemplateForTest(
      template.entityId,
      organization,
      account,
      accountUser
    ));
  }

  return { template, guideBase, guide, guideParticipant };
}

type ReturnModule = Pick<Module, 'id' | 'entityId' | 'stepPrototypes'>;

const createModuleMutationQuery = `
  mutation CreateModule($data: CreateModuleInput!) {
    createModule(input: $data) {
      module {
        entityId
        name
        stepPrototypes {
          entityId
          name
        }
      }
    }
  }
`;

export async function createModuleForTest(
  executeAdminQuery: GraphQLTestHelpers['executeAdminQuery'],
  stepCount = 1,
  stepPrototypeData: Partial<StepPrototype>[] = []
): Promise<Module> {
  const stepPrototypes = [...Array(stepCount)].map((_, i) => ({
    name: `step-${uuidv4()}`,
    ...(stepPrototypeData[i] || {
      stepType: StepType.fyi,
    }),
  }));

  const uuid = uuidv4();

  const {
    data: {
      createModule: { module: createdModule },
    },
  } = (await executeAdminQuery({
    query: createModuleMutationQuery,
    variables: {
      data: {
        moduleData: {
          name: `module-${uuid}`,
          displayTitle: `module-${uuid}`,
          stepPrototypes,
        },
      },
    },
  })) as { data: { createModule: { module: ReturnModule } } };
  return createdModule as Module;
}

const editTemplateMutationQuery = `
  mutation EditTemplateMutation($data: EditTemplateInput!) {
    editTemplate(input: $data) {
      template {
        id,
        entityId
				modules {
					entityId
				}
			}
		}
	}
`;

export const populateTemplateWithContent = async (
  graphqlTestHelpers: GraphQLTestHelpers,
  template: Template,
  modules
) => {
  const { executeAdminQuery } = graphqlTestHelpers;
  await executeAdminQuery({
    query: editTemplateMutationQuery,
    variables: {
      data: {
        templateData: {
          entityId: template.entityId,
          name: template.name,
          pageTargetingType: GuidePageTargetingType.anyPage,
          type: template.type || 'user',
          modules,
        },
      },
    },
  });

  await propagateTemplateChangesInPlace(template);
};

/**
 * Generate guideBases and guides given a template, to test with
 */
export async function launchTemplateForTest(
  templateEntityId: string,
  organization: Organization,
  account: Account,
  accountUser: AccountUser
) {
  const guideBase = await createGuideBase({
    account,
    templateEntityId,
  });

  await guideBase.update({
    state: GuideBaseState.active,
    activatedAt: new Date(),
  });

  const guide = await createGuideFromGuideBase({
    guideBase: guideBase,
    state: GuideState.active,
    launchedAt: new Date(),
  });

  const guideParticipant = await GuideParticipant.create({
    guideId: guide.id,
    accountUserId: accountUser.id,
    organizationId: organization.id,
  });

  return { guideBase, guide, guideParticipant };
}
