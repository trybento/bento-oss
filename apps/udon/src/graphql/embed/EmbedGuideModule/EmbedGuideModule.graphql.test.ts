import { applyFinalCleanupHook, MAX_RETRY_TIMES } from 'src/data/datatests';
import {
  createTemplateForTest,
  populateTemplateWithContent,
} from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { moduleToTemplateInputModule } from 'src/testUtils/dummyDataHelpers';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { Template } from 'src/data/models/Template.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Guide } from 'src/data/models/Guide.model';
import { Organization } from 'src/data/models/Organization.model';
import { AccountUser } from 'src/data/models/AccountUser.model';

applyFinalCleanupHook();

jest.retryTimes(MAX_RETRY_TIMES);

const graphqlTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, executeEmbedQuery, getEmbedContext } =
  graphqlTestHelpers;

/* Add modules to a launchable guide, return relevant gId */
const prepareTestWithContent = async (
  organization: Organization,
  accountUser: AccountUser
) => {
  const tm = await TemplateModule.scope({
    method: ['withModule', true],
  }).findAll({
    where: { organizationId: organization.id },
  });

  if (!tm) throw new Error('No templates with modules');

  const modules = tm.map((tm) =>
    moduleToTemplateInputModule(tm.module)
  ) as any[];

  const { template } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    { isSideQuest: false },
    true
  );

  const dbTemplate = await Template.findOne({
    where: {
      entityId: template.entityId,
    },
  });

  await populateTemplateWithContent(graphqlTestHelpers, dbTemplate!, modules);

  const expectedGp = await GuideParticipant.findOne({
    where: {
      accountUserId: accountUser.id,
    },
    include: [Guide],
  });

  return expectedGp?.guide.entityId;
};

const query = `
		query EmbedQueryTest($guideEntityId: EntityId!) {
			guide(guideEntityId: $guideEntityId) {
				entityId
				modules {
					entityId
					nextModule
					previousModule
					guide
					name
          orderIndex
				}
			}
		}
	`;

type GuideModuleQueryReturnType = {
  data: {
    guide: {
      entityId: string;
      modules: {
        entityId: string;
        nextModule: string;
        guide: string;
        name: string;
        previousModule: string;
        orderIndex: number;
      }[];
    };
  };
};

describe('EmbedQuery: EmbedGuideModules', () => {
  test('can select module entityIds', async () => {
    const { organization, accountUser } = getEmbedContext();

    const guideEntityId = await prepareTestWithContent(
      organization,
      accountUser
    );

    const {
      data: { guide },
    } = await executeEmbedQuery<GuideModuleQueryReturnType>({
      query,
      variables: {
        guideEntityId,
      },
    });

    expect(guide.modules.length).toBeGreaterThan(0);

    const guideModule = guide.modules[0];
    expect(guideModule.entityId).toBeTruthy();
  });

  test('contains the containing guide entityId and it is accurate', async () => {
    const { organization, accountUser } = getEmbedContext();

    const guideEntityId = await prepareTestWithContent(
      organization,
      accountUser
    );

    const {
      data: { guide },
    } = await executeEmbedQuery<GuideModuleQueryReturnType>({
      query,
      variables: {
        guideEntityId,
      },
    });

    const guideModule = guide.modules[0];

    expect(guideModule.guide).toEqual(guide.entityId);
  });

  test('contains the nextModule and it is accurate', async () => {
    const { organization, accountUser } = getEmbedContext();

    const guideEntityId = await prepareTestWithContent(
      organization,
      accountUser
    );

    const {
      data: { guide },
    } = await executeEmbedQuery<GuideModuleQueryReturnType>({
      query,
      variables: {
        guideEntityId,
      },
    });

    expect(guide.modules.length).toBeGreaterThan(1);

    const [firstModule, secondModule, lastModule] = guide.modules
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex);

    expect(firstModule.nextModule).toBeTruthy();
    expect(firstModule.nextModule).toEqual(secondModule.entityId);

    expect(lastModule.nextModule).toBeFalsy();
  });

  test('contains the previousModule and it is accurate', async () => {
    const { organization, accountUser } = getEmbedContext();

    const guideEntityId = await prepareTestWithContent(
      organization,
      accountUser
    );

    const {
      data: { guide },
    } = await executeEmbedQuery<GuideModuleQueryReturnType>({
      query,
      variables: {
        guideEntityId,
      },
    });

    expect(guide.modules.length).toBeGreaterThan(1);

    const [firstModule, secondModule] = guide.modules
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex);

    expect(secondModule.previousModule).toBeTruthy();
    expect(secondModule.previousModule).toEqual(firstModule.entityId);
    expect(firstModule.previousModule).toBeFalsy();
  });
});
