import { WysiwygEditorRecordedAction } from 'bento-common/types';
import { GPTGeneratedGuide } from 'bento-common/types/integrations';
import { EditorNode } from 'bento-common/types/slate';
import { getEmptyStepBody } from 'bento-common/utils/templates';

export const recordedActionsMock: WysiwygEditorRecordedAction[] = [
  {
    url: 'https://www.trybento.co/',
    elementSelector: 'p',
    elementText: 'Mock',
    elementType: 'p',
    elementHtml: '',
    action: 'Clicked p: Mock',
  },
  {
    url: 'https://www.trybento.co/',
    elementSelector: 'DIV',
    elementText: 'Second mock',
    elementType: 'div',
    elementHtml: '',
    action: 'Clicked div: Mock',
  },
];

export const gptGeneratedGuideMock: GPTGeneratedGuide = {
  guideTitle: 'GPT Mock guide',
  steps: [
    {
      title: 'GPT Mock step 1',
      body: getEmptyStepBody('lorem impsum') as EditorNode[],
      ctaText: 'Click me',
      ctaUrl: 'https://www.trybento.co/',
      imageUrl: '',
    },
    {
      title: 'GPT Mock step 2',
      body: getEmptyStepBody('lorem impsum') as EditorNode[],
      ctaText: 'Complete',
      ctaUrl: '',
      imageUrl: '',
    },
    {
      title: 'GPT Mock step 3',
      body: [],
      ctaText: 'Save',
      ctaUrl: 'https://www.trybento.co/',
      imageUrl: '',
    },
  ],
};
