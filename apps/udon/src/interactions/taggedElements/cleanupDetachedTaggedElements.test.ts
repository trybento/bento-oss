import {
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  Theme,
} from 'bento-common/types';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';
import Bluebird from 'bluebird';

import { applyFinalCleanupHook } from 'src/data/datatests';
import {
  fakeModule,
  fakeStepPrototypeTaggedElement,
  createDummyAccounts,
  createDummyAccountUsers,
} from 'src/testUtils/dummyDataHelpers';
import { Guide } from 'src/data/models/Guide.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { Template } from 'src/data/models/Template.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { TemplateInput } from 'src/graphql/Template/mutations/createTemplate';
import {
  createTemplateForTest,
  launchTemplateForTest,
} from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import cleanupDetachedTaggedElements from './cleanupDetachedTaggedElements';
import deletePrototypeTaggedElement from './deletePrototypeTaggedElement';
import upsertPrototypeTaggedElement from './upsertPrototypeTaggedElement';

const { executeAdminQuery, getEmbedContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const createTemplate = async (data?: Partial<TemplateInput>) => {
  const {
    template: { entityId },
  } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    {
      formFactor: GuideFormFactor.legacy,
      isSideQuest: false,
      theme: Theme.nested,
      type: GuideTypeEnum.user,
      modules: fakeModule() as unknown as any,
      ...data,
    },
    false,
    DEFAULT_PRIORITY_RANKING
  );

  return Template.scope(['withTemplateModules']).findOne({
    where: {
      entityId,
    },
  });
};

describe('cleanupDetachedTaggedElements', () => {
  test('removes detached prototypes and nothing else', async () => {
    const { organization } = getEmbedContext();

    const [firstAccount, secondAccount] = await createDummyAccounts(
      organization,
      2
    );

    const usersOfFirstAccount = await createDummyAccountUsers(
      organization,
      firstAccount,
      3
    );

    const template = await createTemplate({
      pageTargetingType: GuidePageTargetingType.visualTag,
    });

    // add tag to the first template
    await upsertPrototypeTaggedElement({
      organization: organization,
      template: template!.id,
      input: fakeStepPrototypeTaggedElement(),
    });

    const [firstStepPrototypeOfTemplate] = (
      await TemplateModule.scope([
        { method: ['withModule', true] },
        'byOrderIndex',
      ]).findAll({
        where: { templateId: template!.id },
      })
    ).flatMap<StepPrototype>((tm) =>
      tm.module.moduleStepPrototypes.map((msp) => msp.stepPrototype)
    );

    // add tag to the first step of template
    await upsertPrototypeTaggedElement({
      organization: organization.id,
      template: template!.id,
      stepPrototype: firstStepPrototypeOfTemplate,
      input: fakeStepPrototypeTaggedElement(),
    });

    // add another tag to the first step of the first template

    const guidesOfFirstAccount: Guide[] = [];

    // now remove one of the guides
    await Bluebird.map(usersOfFirstAccount, async (au) => {
      const { guide } = await launchTemplateForTest(
        template!.entityId,
        organization,
        firstAccount,
        au
      );
      guidesOfFirstAccount.push(guide);
    });

    const usersOfSecondAccount = await createDummyAccountUsers(
      organization,
      secondAccount,
      3
    );

    // drop the first guide launched to the first account/users
    // this should leave some visual tags detached of their guide id
    await guidesOfFirstAccount[0].destroy({ force: true });

    let guideBaseOfSecondAccount: GuideBase | undefined;

    // now remove one of the guides
    await Bluebird.map(usersOfSecondAccount, async (au) => {
      const { guideBase } = await launchTemplateForTest(
        template!.entityId,
        organization,
        secondAccount,
        au
      );
      guideBaseOfSecondAccount = guideBase;
    });

    if (guideBaseOfSecondAccount) {
      /* Delete guides first to prevent fKey errors */
      await Guide.destroy({
        where: {
          createdFromGuideBaseId: guideBaseOfSecondAccount.id,
        },
        force: true,
      });
      // drop the guide base launched to the second account
      // this should leave all tags tied to the second account detached of their guide base id
      await guideBaseOfSecondAccount.destroy({ force: true });
    }

    expect(await cleanupDetachedTaggedElements()).toEqual(
      // 2 of 1st account + 6 tags of 2nd account
      2 + 6
    );

    const livingTags = await StepTaggedElement.count({
      where: {
        organizationId: organization.id,
        guideId: guidesOfFirstAccount.map((g) => g.id),
      },
    });

    expect(livingTags).toEqual(
      // 2 tags * 2 living guide instances of 1st account
      2 * 2
    );

    // drop all tag prototypes
    await Promise.all([
      await deletePrototypeTaggedElement({
        organization,
        template: template!,
      }),
      await deletePrototypeTaggedElement({
        organization,
        template: template!,
        stepPrototype: firstStepPrototypeOfTemplate,
      }),
    ]);

    expect(await cleanupDetachedTaggedElements()).toEqual(livingTags);
  });
});
