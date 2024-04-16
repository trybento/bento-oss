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
import { StepEvent } from 'src/data/models/Analytics/StepEvent.model';
import detachedPromise from 'src/utils/detachPromise';

jest.mock('src/utils/detachPromise', () => ({
  __esModule: true,
  default: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
});

const graphQLTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, getAdminContext, getEmbedContext } =
  graphQLTestHelpers;

describe('trackCtaClicked', () => {
  test('records cta click', async () => {
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

    let innerPromise: () => Promise<void> = async () => {};

    (detachedPromise as jest.Mock).mockImplementationOnce(
      async (cb: () => Promise<void>) => {
        innerPromise = cb;
      }
    );

    trackCtaClicked({
      ctaEntityId: originStep!.createdFromGuideStepBase.ctas![0].entityId,
      accountUserEntityId: accountUser.entityId,
      stepEntityId: originStep!.entityId,
      organizationEntityId: organization.entityId,
    });

    await innerPromise();

    // check if step event was created
    const stepEvent = await StepEvent.findOne({
      where: {
        stepEntityId: originStep!.entityId,
        accountUserEntityId: accountUser.entityId,
      },
    });

    expect(stepEvent).not.toBeNull();
    expect(stepEvent?.data).toMatchObject({
      ctaEntityId: originStep!.createdFromGuideStepBase.ctas![0].entityId,
      ctaText: 'Launch a guide',
    });
  });
});
