import {
  DEFAULT_FLOW_TAG_STYLE,
  DEFAULT_FLOW_TAG_TYPE,
} from 'bento-common/types';
import { gptGeneratedGuideMock, recordedActionsMock } from '__mocks__/gpt';
import { transformGeneratedGuideContent } from '../BentoAIBuilder/autoGenerateContent.helpers';

describe('transformGeneratedGuideContent', () => {
  const content = gptGeneratedGuideMock;
  const recordedActions = recordedActionsMock;

  const newModule = transformGeneratedGuideContent(content, recordedActions);
  const tags = (newModule?.stepPrototypes || []).flatMap(
    (sp) => sp.taggedElements
  );

  test('Auto Flow guide builder result is not null', async () => {
    expect(newModule).toBeTruthy();
  });

  test(`Number of tags doesn't exceed number of recorded actions`, async () => {
    expect(tags.length).toBeLessThanOrEqual(recordedActionsMock.length);
  });

  test(`Check that we are using the right type and style for tags.`, async () => {
    const firstTag = tags[0];
    if (firstTag) {
      expect(firstTag.type).toBe(DEFAULT_FLOW_TAG_TYPE);
      expect(firstTag.style).toBe(DEFAULT_FLOW_TAG_STYLE);
      expect(firstTag.elementSelector).toBe(
        recordedActionsMock[0].elementSelector
      );
    }
  });
});
