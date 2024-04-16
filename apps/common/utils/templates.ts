import { v4 as uuidv4 } from 'uuid';

import { FillEnum, GuideFormFactor, StepType, Theme } from '../types';
import { FullGuide, MediaReference } from '../types/globalShoyuState';
import { MediaType } from '../types/media';
import { TextNode } from '../types/slate';
import { isFlowGuide } from './formFactor';
import { cloneDeep } from './lodash';

/** The presence of this in the first Slate node tells us it's a template */
export const TEMPLATE_INDICATOR_STRING = 'Template 👇:';

/**
 * Naively determines if bodySlate is a template based on the presence
 * of the template indicator string in the first position.
 */
export const isTemplateBody = (bodySlate: any[]): boolean => {
  const firstNode = bodySlate?.[0]?.children?.[0];
  return (
    firstNode?.text === TEMPLATE_INDICATOR_STRING &&
    firstNode?.children === null
  );
};

/** Used for the buttons in the templates */
const SAMPLE_FAKE_VIDEO_URL =
  'https://s3.us-west-1.amazonaws.com/assets.trybento.co/images/videoplayer.png';
export const SAMPLE_FAKE_IMAGE_URL =
  'https://s3.us-west-1.amazonaws.com/assets.trybento.co/images/imagePlaceholder.png';
export const SAMPLE_FAKE_IMAGE_URL_2 =
  'https://s3-us-west-1.amazonaws.com/uploads-staging.trybento.co/media/0016238c-6010-11eb-8c72-a7c10548a5e9/451ac7eb-abf0-4925-a368-f3fe06ab1fae_carrierpigeon.jpeg';

export const SAMPLE_IMAGE_MEDIA_REFERENCE: MediaReference = {
  media: {
    type: MediaType.image,
    url: SAMPLE_FAKE_IMAGE_URL,
    meta: {},
  },
  settings: {
    fill: FillEnum.marginless,
    lightboxDisabled: true,
  },
};

export const SAMPLE_IMAGE_MEDIA_REFERENCE_2: MediaReference = {
  media: {
    type: MediaType.image,
    url: SAMPLE_FAKE_IMAGE_URL_2,
    meta: {},
  },
  settings: {
    lightboxDisabled: false,
  },
};

export const SAMPLE_IMAGE_MEDIA_REFERENCE_3: MediaReference = {
  media: {
    type: MediaType.image,
    url: SAMPLE_FAKE_VIDEO_URL,
    meta: {},
  },
  settings: {
    lightboxDisabled: false,
  },
};

/** Slate node used for template detection */
const TEMPLATE_IDENTIFIER = {
  id: uuidv4(),
  type: 'paragraph',
  children: [
    {
      id: uuidv4(),
      type: 'text',
      text: TEMPLATE_INDICATOR_STRING,
      children: null,
    },
  ],
};

export const EMPTY_CONTENT_CALLOUT = [
  {
    id: uuidv4(),
    type: 'paragraph',
    children: [
      {
        id: uuidv4(),
        type: 'text',
        text: '(No content has been created yet)',
        children: null,
      },
    ],
  },
];

export const getEmptyStepBody = (
  stepBody?: string,
  options: Partial<Omit<TextNode, 'text' | 'type'>> = {}
) => [
  {
    id: uuidv4(),
    type: 'paragraph',
    template: true,
    children: [
      {
        id: uuidv4(),
        type: 'text',
        text: stepBody || '',
        children: null,
        ...options,
      },
    ],
  },
];

export const getDefaultStepBody = (
  stepType: StepType,
  theme: Theme,
  stepBody?: string
) => {
  if (stepBody) {
    return getEmptyStepBody(stepBody);
  }

  return getTemplate(stepType, theme);
};

export const getTemplate = (stepType: StepType, _theme?: Theme) => {
  switch (stepType) {
    case StepType.optional:
      return [
        TEMPLATE_IDENTIFIER,
        {
          id: uuidv4(),
          type: 'paragraph',
          children: [
            {
              id: uuidv4(),
              type: 'text',
              text: "Lorem ipsum here's a suggested action. It might not apply to you, but if it does, there are lots of reasons you want to do this.",
              children: null,
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '',
            },
          ],
          id: uuidv4(),
        },
      ];
    case StepType.required:
      return [
        TEMPLATE_IDENTIFIER,
        {
          type: 'paragraph',
          children: [
            {
              text: 'Lorem ipsum. This is a really important action!',
              bold: true,
            },
          ],
          id: uuidv4(),
        },
        {
          type: 'paragraph',
          id: uuidv4(),
          children: [
            {
              text: 'More importantly here are the benefits from doing it:',
            },
          ],
        },
        {
          type: 'bulleted-list',
          children: [
            {
              type: 'list-item',
              id: uuidv4(),
              children: [
                {
                  text: 'Value 1',
                },
              ],
            },
            {
              type: 'list-item',
              id: uuidv4(),
              children: [
                {
                  text: 'Value 2',
                },
              ],
            },
            {
              type: 'list-item',
              id: uuidv4(),
              children: [
                {
                  text: 'Value 3',
                },
              ],
            },
          ],
          id: uuidv4(),
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '',
            },
          ],
          id: uuidv4(),
        },
      ];
    case StepType.fyi:
      return [
        TEMPLATE_IDENTIFIER,
        {
          id: uuidv4(),
          type: 'paragraph',
          children: [
            {
              id: uuidv4(),
              type: 'text',
              text: 'Lorem ipsum we put together an overview on something you should know. Here are a couple points:',
              children: null,
            },
          ],
        },
        {
          type: 'bulleted-list',
          children: [
            {
              id: uuidv4(),
              type: 'list-item',
              template: true,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  children: null,
                  text: 'Point 1',
                },
              ],
            },
            {
              id: uuidv4(),
              type: 'list-item',
              template: true,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  children: null,
                  text: 'Point 2',
                },
              ],
            },
          ],
          id: uuidv4(),
        },
        {
          id: uuidv4(),
          type: 'paragraph',
          children: [
            {
              id: uuidv4(),
              type: 'text',
              children: null,
              text: 'Also, watch this video below:',
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'image',
          url: SAMPLE_FAKE_VIDEO_URL,
          children: [{ text: '' }],
        },
      ];
    case StepType.input:
      return [
        TEMPLATE_IDENTIFIER,
        {
          type: 'paragraph',
          children: [
            {
              text: 'Input fields (i.e. for a short text or NPS) can be added to the right 👉',
              bold: true,
            },
          ],
          id: uuidv4(),
        },
        {
          type: 'paragraph',
          id: uuidv4(),
          children: [
            {
              text: 'If you want to offer any explanations or examples you can include it here. ',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '',
            },
          ],
          id: uuidv4(),
        },
      ];
    case StepType.branching:
    case StepType.branchingOptional:
      return [
        TEMPLATE_IDENTIFIER,
        {
          type: 'paragraph',
          id: uuidv4(),
          children: [
            {
              text: `You might offer a 1 sentence intro into why you'll be asking users to choose an adventure, such as: we want to help you get to value as quickly as possible.`,
            },
          ],
        },
        {
          type: 'paragraph',
          id: uuidv4(),
          children: [
            {
              text: `Tell us a bit more about your [role | use-case | desired workflow | etc]`,
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '',
            },
          ],
          id: uuidv4(),
        },
      ];
    default:
      return [
        {
          id: uuidv4(),
          type: 'paragraph',
          template: true,
          children: [
            {
              id: uuidv4(),
              type: 'text',
              text: '',
              children: null,
            },
          ],
        },
      ];
  }
};

const getTemplateForTooltip = () => [
  {
    id: uuidv4(),
    type: 'paragraph',
    children: [{ text: 'Placeholder text 👇:' }],
  },
  {
    id: uuidv4(),
    type: 'paragraph',
    children: [
      { text: 'Make sure to check out the [new X, or changes to Y]!' },
    ],
  },
  {
    id: uuidv4(),
    type: 'paragraph',
    children: [
      {
        text: 'Tooltips can contain short videos or images, just don’t overdo it!',
      },
    ],
  },
];

export const getTemplateForCard = () => {
  return [
    {
      id: uuidv4(),
      type: 'paragraph',
      children: [{ text: 'This is a sample card', h1: true }],
    },
    {
      id: uuidv4(),
      type: 'paragraph',
      children: [
        {
          text: 'You probably want a short and snappy description with a clear call-to-action here!',
        },
      ],
    },
  ];
};

export const getTemplateForVideoGallery = () => {
  return [
    {
      id: uuidv4(),
      type: '',
      videoId: '',
      originalSrc: '',
      playsInline: true,
      children: [
        {
          text: '',
          type: 'text',
        },
      ],
    },
  ];
};

export const getTemplateByFormFactor = (
  formFactor: GuideFormFactor,
  theme: Theme
) => {
  switch (theme) {
    case Theme.card:
      return getTemplateForCard();
    // TODO: Update template.
    case Theme.videoGallery:
      return getTemplateForVideoGallery();
    default:
      break;
  }
  switch (formFactor) {
    case GuideFormFactor.tooltip:
    case GuideFormFactor.flow:
      return getTemplateForTooltip();

    default:
      return getEmptyStepBody();
  }
};

export const getDefaultMediaReferences = (
  formFactor: GuideFormFactor,
  theme: Theme
) => {
  switch (theme) {
    case Theme.card:
      return [SAMPLE_IMAGE_MEDIA_REFERENCE];
    default:
      break;
  }
  switch (formFactor) {
    case GuideFormFactor.tooltip:
      return [SAMPLE_IMAGE_MEDIA_REFERENCE];

    default:
      return [];
  }
};

export const addStepsToSampleGuide = (
  guide: Omit<FullGuide, 'steps'>
): FullGuide => ({
  ...cloneDeep(guide),
  steps: guide.modules.flatMap((m) => m.steps),
});
