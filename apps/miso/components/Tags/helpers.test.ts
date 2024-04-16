import { TagInput } from 'bento-common/types';
import { StepEntityId } from 'bento-common/types/globalShoyuState';
import { fullGuidePreviewData } from 'components/ContextTagEditor/constants';
import { templateToGuideTransformer } from 'components/Library/LibraryTemplates/LibraryTemplatePreview/preview.helpers';
import { createTaggedElement } from 'components/Templates/EditTemplate/wysiwyg.helpers';
import { templateValueMock } from '__mocks__/templateForm';
import {
  getAllTaggedElementsForPreview,
  getDefaultFlowGuideUrl,
} from './helpers';

describe('getAllTaggedElementsForPreview', () => {
  const guide = templateValueMock
    ? templateToGuideTransformer(templateValueMock, undefined)
    : fullGuidePreviewData;

  const firstStep = templateValueMock.modules[0].stepPrototypes[0];

  afterEach(() => {
    firstStep.taggedElements = [];
  });

  test('Returns new tag for template', async () => {
    const { newTag } = createTaggedElement(guide, {
      context: 'template',
      stepEntityId: undefined,
    });

    const allTaggedElements = getAllTaggedElementsForPreview(
      templateValueMock,
      newTag
    );

    expect(allTaggedElements.length).toBe(
      templateValueMock.taggedElements.length + 1
    );
  });

  test('Tagged elements count remains the same for existing tag', async () => {
    const firstStep = templateValueMock.modules[0].stepPrototypes[0];

    const { newTag } = createTaggedElement(guide, {
      context: 'step',
      stepEntityId: firstStep.entityId as StepEntityId,
    });

    firstStep.taggedElements = [newTag] as TagInput[];

    const allTaggedElements = getAllTaggedElementsForPreview(
      templateValueMock,
      newTag
    );

    expect(allTaggedElements.length).toBe(firstStep.taggedElements.length);
  });
});

describe('getDefaultFlowGuideUrl', () => {
  const guide = templateValueMock
    ? templateToGuideTransformer(templateValueMock, undefined)
    : fullGuidePreviewData;

  const firstStep = templateValueMock.modules[0].stepPrototypes[0];
  const secondStep = templateValueMock.modules[0].stepPrototypes[1];

  beforeAll(() => {
    [firstStep, secondStep].forEach((s) => {
      const { newTag } = createTaggedElement(guide, {
        context: 'step',
        stepEntityId: secondStep.entityId as StepEntityId,
      });
      s.taggedElements = [newTag] as TagInput[];
    });
  });

  afterAll(() => {
    firstStep.taggedElements = [];
    secondStep.taggedElements = [];
  });

  test('First tag in the guide, returns undefined', async () => {
    const url = getDefaultFlowGuideUrl(templateValueMock, firstStep.entityId);
    expect(url).toBe(undefined);
  });

  test('Second tag in the guide, returns URL from first tag', async () => {
    const url = getDefaultFlowGuideUrl(templateValueMock, secondStep.entityId);
    expect(url).toBe(firstStep.taggedElements[0]?.url);
  });
});
