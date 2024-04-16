import { subDays, isSameDay } from 'date-fns';

import { applyFinalCleanupHook } from 'src/data/datatests';

import {
  gptExampleGuide,
  handleGptDateAttribute,
  sanitizeGptResults,
} from './gpt.helpers';
import { getDummyString } from 'src/testUtils/dummyDataHelpers';
import { GptEditorNode, sanitizeGptStepBodies } from './slateSanitizer';
import GptMalformedPayloadError from 'src/errors/GptMalformedPayloadError';

applyFinalCleanupHook();

describe('misc gpt helpers', () => {
  test.each([true, false])('example guide is valid json', (withMedia) => {
    const guideString = gptExampleGuide(withMedia);
    const parsed = JSON.parse(guideString);

    expect(typeof parsed === 'object').toBeTruthy();
  });
});

const textNode = () => ({
  type: 'text',
  text: getDummyString(),
});

/* This is a real raw output from a guide that produced bad content. */
const erroringGuide =
  '{"guideTitle":"null", "steps": [{"title":"Select your persona","body":[{"type":"paragraph","children":[{"text":"Choose the business user persona to begin the onboarding process."}]},{"type":"image","url":"https://thoughtspot.com/business-user-onboarding","caption":"Business user or analyst screen"}],"ctaText":"Next"},{"title":"Watch the introduction video","body":[{"type":"paragraph","children":[{"text":"Get familiar with ThoughtSpot by watching a short video introduction."}]}],"ctaText":"Next"},{"title":"Practice with Search Assist","body":[{"type":"paragraph","children":[{"text":"ThoughtSpot will guide you through sample searches using Search Assist."}]},{"type":"paragraph","children":[{"text":"You can choose to go to the homepage or try another search after completing the first sample search."}]}],"ctaText":"Finish Onboarding"}]}';

const brokenSteps = [
  [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Choose the business user persona to begin the onboarding process.',
        },
      ],
    },
    { url: 'https://thoughtspot.com/product', type: 'image' },
  ],
  [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Use the dashboard filters to search for the approver you want to delete.',
        },
      ],
    },
    {
      src: 'https://codahosted.io/docs/CI2GLA6LJx/blobs/bl-vWBKhp0xeZ/c86cf5de40157d72cf39e390dc8546fc9feeb98fdde9cb9e3a0275779a6adc754c67b52fd98371bc07e5ef910df747ac1cf7215fcefb28e2d3b85627db7cd8916b3b8f902dd217168758c50fd67bd3635c1d1a0b1277a1fc528dcac1ba8cbc06bbcc0415',
      type: 'image',
    },
  ],
  [
    {
      id: '07c10d01-2810-44f0-8ef3-bcff3efc54b3',
      type: 'bulletList',
      children: [
        {
          id: '3cb7fcd1-adf2-4bf1-b2a9-2298a01eb3e9',
          type: 'bulletList',
          children: [
            {
              id: '7c9ca458-662d-4a20-9c9c-1401e32de1ad',
              type: 'paragraph',
              children: [
                {
                  text: "To pass data from Bento into other tools, you can use the Zapier integration. If you're unfamiliar with Zapier, it's a great way to no code build integrations across SaaS tools and in doing so, create workflows.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '175f3d84-9073-497c-af09-0899218a8708',
      type: 'paragraph',
      children: [{ text: 'To set up your Zap:' }],
    },
    {
      type: 'bulletList',
      children: [
        {
          id: '93bce687-d6b0-4370-8aa1-e9a940717b90',
          type: 'bulleted-list',
          children: [
            {
              type: 'list-item',
              children: [
                { text: 'Search for Bento in the Trigger section of Zapier' },
              ],
            },
            {
              type: 'list-item',
              children: [
                {
                  text: 'Log in to your Bento account and copy your authorization token from the integrations page',
                },
              ],
            },
            {
              type: 'list-item',
              children: [
                { text: 'Choose the event you want to use as the trigger' },
              ],
            },
          ],
        },
        {
          id: '7057b8e3-1170-4586-9708-4fac186cacff',
          type: 'paragraph',
          children: [
            {
              text: "Testing is the name of the game! You'll need to make sure that you can test appropriately.",
            },
          ],
        },
        {
          id: '3cb7fcd1-adf2-4bf1-b2a9-2298a01eb3e9',
          type: 'bulletList',
          children: [
            {
              id: 'ca873420-d665-4bb2-8797-455c4470a45c',
              type: 'list-item',
              children: [{ text: '' }],
            },
          ],
        },
        {
          id: 'b30cae09-8e0f-42ff-9b5f-c6a9a688870d',
          type: 'bulletList',
          children: [
            {
              id: '7057b8e3-1170-4586-9708-4fac186cacff',
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ],
        },
      ],
    },
  ],
] as Array<GptEditorNode[]>;

describe('slate sanitization', () => {
  test('converts bulletList', () => {
    const stepBody = [
      {
        type: 'bulletList',
        children: [0, 1].map((_) => textNode()),
      },
    ];

    sanitizeGptStepBodies(stepBody);

    const bulletLists = stepBody.find((n) => n.type === 'bulletList');
    const fixed = stepBody.find((n) => n.type === 'bulleted-list');

    expect(!!bulletLists).toBeFalsy();
    expect(!!fixed).toBeTruthy();

    fixed?.children.forEach((c) => {
      expect(c.type).toEqual('list-item');
    });
  });

  test('Removes invalid nodes', () => {
    const invalidNodeType = 'wow-node';
    /** @todo generate these nodes to cover more cases */
    const stepBody = [
      {
        type: invalidNodeType,
        media: 'yes.jpag',
      },
      {
        type: 'paragraph',
        children: [textNode()],
      },
    ];

    sanitizeGptStepBodies(stepBody);

    const invalids = stepBody.find((n) => n.type === invalidNodeType);
    expect(!!invalids).toBeFalsy();

    expect(stepBody.length).toBeGreaterThan(0);
  });

  test('extract text from weird nodes', () => {
    const bodySlate: GptEditorNode[] = [
      { id: '1', type: 'container', children: [textNode()] },
    ];

    sanitizeGptStepBodies(bodySlate);

    const convertedNode = bodySlate.find((n) => n.id === '1');

    expect(!!convertedNode).toBeTruthy();
    expect(convertedNode?.type).toEqual('paragraph');

    const firstNode = convertedNode?.children?.[0];

    expect(firstNode?.type).toEqual('text');
    expect(!!firstNode?.text).toBeTruthy();
  });

  /**
   * Ideally we have a way to validate the object as Slate-friendly
   * Unfortunately not sure of a good way to do this quickly
   *   so I've just been logging and plugging it into a bodySlate.
   * Since that's manual, added/kept skip here.
   */
  test.skip.each(brokenSteps)('normalizes known bad steps', (badSlate) => {
    const wrappedBadSlate = Array.isArray(badSlate) ? badSlate : [badSlate];
    sanitizeGptStepBodies(wrappedBadSlate);

    console.log('Slate output', JSON.stringify(wrappedBadSlate));
  });

  test.each([erroringGuide, gptExampleGuide()])(
    'works in full flow',
    (gptGuide) => {
      const res = sanitizeGptResults([JSON.parse(gptGuide)], {});

      const guide = res[0];

      expect(!!guide).toBeTruthy();
      expect(guide.steps.length).toBeGreaterThan(1);
      guide.steps.forEach((step) => {
        expect(step.body.length).toBeGreaterThan(0);
      });
    }
  );
});

describe('gpt date parser', () => {
  test.each([
    ['2004-12-07', '2004-12-07T00:00:00.000Z'],
    ['2004-12-07T00:00:00.000Z', '2004-12-07T00:00:00.000Z'],
    ['2004-12-07T00:00:00Z', '2004-12-07T00:00:00.000Z'],
    ['2004/12/07', '2004-12-07T08:00:00.000Z'],
    ['12/7/2004', '2004-12-07T08:00:00.000Z'],
    ['TODAY - 0', new Date().toISOString()],
    ['TODAY - 5', subDays(new Date(), 5).toISOString()],
    ['TODAY - -5', subDays(new Date(), -5)],
    ['TODAY + 5', subDays(new Date(), -5)],
    ['WOW', null],
  ])('handles parsing %s', (rawValue, expected) => {
    try {
      const parsed = handleGptDateAttribute(rawValue);

      const dayEqual = isSameDay(new Date(parsed), new Date(expected!));

      expect(dayEqual).toBeTruthy();
    } catch (e) {
      expect(expected).toBeNull();
      expect(e instanceof GptMalformedPayloadError).toBeTruthy();
    }
  });
});
