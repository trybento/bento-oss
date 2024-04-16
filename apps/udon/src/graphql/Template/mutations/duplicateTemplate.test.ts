import {
  GuideFormFactor,
  GuidePageTargetingType,
  TemplateState,
  GuideTypeEnum,
  Theme,
} from 'bento-common/types';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';
import {
  ContextTagAlignment,
  ContextTagTooltipAlignment,
  ContextTagType,
} from 'bento-common/types/globalShoyuState';

import { applyFinalCleanupHook } from 'src/data/datatests';
import { fakeModule } from 'src/testUtils/dummyDataHelpers';
import { Template } from 'src/data/models/Template.model';
import { TemplateInput } from 'src/graphql/Template/mutations/editTemplate';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import upsertPrototypeTaggedElement from 'src/interactions/taggedElements/upsertPrototypeTaggedElement';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';

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

const duplicateTemplateMutation = `
  mutation ($input: DuplicateTemplateInput!) {
    duplicateTemplate(input: $input) {
      template {
        entityId
        name
        state
        taggedElements {
          entityId
          wildcardUrl
          url
          type
        }
        modules {
          entityId
          stepPrototypes {
            entityId
            taggedElements {
              entityId
              wildcardUrl
              url
              type
            }
          }
        }
      }
    }
  }
`;

type DuplicateTemplateResponse = {
  data: {
    duplicateTemplate: {
      template: {
        entityId: string;
        name: string;
        state: TemplateState;
        taggedElements: TaggedElement[];
        modules: {
          entityId: string;
          stepPrototypes: {
            entityId: string;
            taggedElements: TaggedElement[];
          }[];
        }[];
      };
    };
  };
  errors: any[];
};

type TaggedElement = {
  entityId: string;
  wildcardUrl: string;
  url: string;
  type: ContextTagType;
};

describe('DuplicateTemplate mutation', () => {
  test('tags are duplicated', async () => {
    const original = await createTemplate({
      pageTargetingType: GuidePageTargetingType.visualTag,
    });

    await upsertPrototypeTaggedElement({
      organization: original!.organizationId,
      template: original!.id,
      input: {
        alignment: ContextTagAlignment.topLeft,
        elementHtml: null,
        elementSelector: '#fakeId',
        elementText: 'Faker',
        relativeToText: true,
        tooltipAlignment: ContextTagTooltipAlignment.top,
        type: ContextTagType.badge,
        url: 'https://trybento.co',
        wildcardUrl: 'https://trybento.co/*',
        xOffset: 10,
        yOffset: 10,
      },
    });

    const [stepPrototype] = (
      await TemplateModule.scope([
        { method: ['withModule', true] },
        'byOrderIndex',
      ]).findAll({
        where: { templateId: original!.id },
      })
    ).flatMap<StepPrototype>((tm) =>
      tm.module.moduleStepPrototypes.map((msp) => msp.stepPrototype)
    );

    await upsertPrototypeTaggedElement({
      organization: original!.organizationId,
      template: original!.id,
      stepPrototype,
      input: {
        alignment: ContextTagAlignment.topLeft,
        elementHtml: null,
        elementSelector: '#anotherId',
        elementText: 'Faker 2nd',
        relativeToText: true,
        tooltipAlignment: ContextTagTooltipAlignment.top,
        type: ContextTagType.dot,
        url: 'https://trybento.co/account/123',
        wildcardUrl: 'https://trybento.co/account/*',
        xOffset: 10,
        yOffset: 10,
      },
    });

    const {
      errors,
      data: { duplicateTemplate: data },
    } = await executeAdminQuery<DuplicateTemplateResponse>({
      query: duplicateTemplateMutation,
      variables: {
        input: {
          entityId: original?.entityId,
          duplicateStepGroups: true,
          name: 'Copy of the original template',
        },
      },
    });

    expect(errors).toBeUndefined();
    expect(data.template.entityId).not.toEqual(original?.entityId);
    expect(data.template.taggedElements).toMatchObject([
      {
        entityId: expect.any(String),
        type: ContextTagType.badge,
        url: 'https://trybento.co',
        wildcardUrl: 'https://trybento.co/*',
      },
    ]);
    expect(
      data.template.modules?.[0]?.stepPrototypes?.[0]?.taggedElements
    ).toMatchObject([
      {
        entityId: expect.any(String),
        type: ContextTagType.dot,
        url: 'https://trybento.co/account/123',
        wildcardUrl: 'https://trybento.co/account/*',
      },
    ]);
  });
});
