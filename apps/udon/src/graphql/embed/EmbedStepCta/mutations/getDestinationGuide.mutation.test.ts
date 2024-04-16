import { faker } from '@faker-js/faker';
import { Guide as EmbedGuide } from 'bento-common/types/globalShoyuState';
import { StepCtaStyle } from 'bento-common/types';

import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import {
  createTemplateForTest,
  launchTemplateForTest,
} from 'src/graphql/Template/testHelpers';
import { Template } from 'src/data/models/Template.model';
import { Module } from 'src/data/models/Module.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Step } from 'src/data/models/Step.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { GuideBaseStepCta } from 'src/data/models/GuideBaseStepCta.model';
import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import trackCtaClicked from 'src/interactions/analytics/trackCtaClicked';

jest.mock('src/interactions/analytics/trackCtaClicked');

afterEach(() => {
  jest.resetAllMocks();
});

const graphQLTestHelpers = setupGraphQLTestServer('bento');
const {
  executeAdminQuery,
  getAdminContext,
  executeEmbedQuery,
  getEmbedContext,
} = graphQLTestHelpers;

type MutationReturnType = {
  data: Record<string, { guide: EmbedGuide; errors?: string[] }>;
  errors: string[];
};

const query = `
  mutation GetDestinationGuideMutation($input: GetDestinationGuideInput!) {
    getDestinationGuide(input: $input) {
      guide {
        entityId
        name
        taggedElements {
          entityId
          elementSelector
        }
      }
      errors
    }
  }
`;

describe('GetDestinationGuide Mutation', () => {
  test('fails if destination key or step are invalid', async () => {
    const { errors } = await executeEmbedQuery<MutationReturnType>({
      query,
      variables: {
        input: {
          destinationKey: faker.string.uuid(),
          stepEntityId: faker.string.uuid(),
          ctaEntityId: faker.string.uuid(),
          markComplete: true,
        },
      },
    });

    expect(errors.length).toBeGreaterThan(0);
  });

  test('launches and correctly returns the destination guide multiple times', async () => {
    const { organization } = getAdminContext();
    const { account, accountUser } = getEmbedContext();

    const { template: destinationTemplate } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      { name: 'Destiny' }
    );

    const destinationTemplateId = (await Template.findOne({
      where: { entityId: destinationTemplate.entityId },
    }))!.id;

    const originTemplate = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
      include: [{ model: Module, include: [StepPrototype] }],
    });

    await StepPrototypeCta.create({
      organizationId: organization.id,
      orderIndex: 0,
      style: StepCtaStyle.solid,
      settings: {
        bgColorField: '#000000',
        textColorField: '#ffffff',
      },
      stepPrototypeId: originTemplate!.modules[0].stepPrototypes[0].id,
      text: 'Launch a guide',
      type: 'launch',
      launchableTemplateId: destinationTemplateId,
    });

    const { guide: originGuide } = await launchTemplateForTest(
      originTemplate!.entityId,
      organization,
      account,
      accountUser
    );

    const originStep = (
      await originGuide.$get('guideModules', {
        include: [
          {
            model: Step,
            include: [
              {
                model: GuideStepBase,
                include: [
                  {
                    model: GuideBaseStepCta,
                  },
                ],
              },
            ],
          },
        ],
        order: [['orderIndex', 'ASC']],
        limit: 1,
      })
    )?.map((gm) => gm.steps[0])?.[0];

    const guidesLaunched: string[] = [];

    for (let index = 0; index < 2; index++) {
      const {
        data: { getDestinationGuide: data },
      } = await executeEmbedQuery<MutationReturnType>({
        query,
        variables: {
          input: {
            destinationKey: destinationTemplate.entityId,
            stepEntityId: originStep!.entityId,
            ctaEntityId: originStep!.createdFromGuideStepBase.ctas![0].entityId,
            markComplete: true,
          },
        },
      });

      expect(trackCtaClicked).toHaveBeenCalledWith({
        ctaEntityId: originStep!.createdFromGuideStepBase.ctas![0].entityId,
        accountUserEntityId: accountUser.entityId,
        stepEntityId: originStep!.entityId,
        organizationEntityId: organization.entityId,
      });

      expect(data.guide).toMatchObject({
        entityId: expect.any(String),
        name: 'Destiny',
      });

      expect(data.errors).toHaveLength(0);
      guidesLaunched.push(data.guide.entityId);
    }

    // expect that all the guides launched are the same
    expect(guidesLaunched.every((el) => el === guidesLaunched[0])).toBeTruthy();
  });
});
