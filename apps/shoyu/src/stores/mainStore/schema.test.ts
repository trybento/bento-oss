import { normalize } from 'normalizr';
import { omit } from 'lodash';

import schema, { NormalizedGuideData } from './schema';

jest.mock('../../lib/graphqlClient');

describe('schema.destination', () => {
  const server = {
    guide: {
      __typename: 'EmbedGuide',
      id: 'RW1iZWRHdWlkZTplYjYxZTI5Ny1lZmIwLTQzMmItYTliMC05M2I5ZmI5ZDRjNDg=',
      entityId: 'eb61e297-efb0-432b-a9b0-93b9fb9d4c48',
      name: 'Feb 15: Tooltip',
      theme: 'standard',
      type: 'user',
      description: '',
      completionState: 'incomplete',
      completedAt: null,
      doneAt: null,
      savedAt: null,
      state: 'active',
      isViewed: false,
      isDestination: true,
      totalSteps: 1,
      completedStepsCount: 0,
      isSideQuest: true,
      orderIndex: 1,
      nextGuide: null,
      previousGuide: null,
      firstIncompleteModule: '06ad882c-9b53-4a18-99ee-c6f03fea4965',
      firstIncompleteStep: '923dc0a8-16e6-4792-be75-44cf7a97c960',
      pageTargetingType: 'visual_tag',
      pageTargetingUrl: null,
      designType: 'everboarding',
      formFactor: 'tooltip',
      canResetOnboarding: false,
      isCyoa: false,
      branchedFromGuide: null,
      branchedFromChoice: null,
      formFactorStyle: {
        backgroundColor: '#FFFFFF',
        backgroundOverlayColor: null,
        backgroundOverlayOpacity: null,
        hasArrow: false,
        hasBackgroundOverlay: false,
        textColor: null,
        tooltipShowOn: 'page_load',
        tooltipSize: 'medium',
        canDismiss: true,
        __typename: 'TooltipStyle',
      },
      guideBase: {
        entityId: 'caf222fc-19bb-4d70-9888-1d471ae7ef8e',
        __typename: 'EmbedGuideBase',
      },
      stepsInfo: [
        {
          __typename: 'EmbedStep',
          name: 'Image perf - Tooltip',
          bodySlate: [
            {
              id: '62de8944-e5d2-42c2-b55c-b6591ce4f16d',
              url: 'https://picsum.photos/1920/1080',
              fill: 'marginless',
              type: 'image',
              children: [
                {
                  text: '',
                },
              ],
              naturalWidth: 1920,
              naturalHeight: 1080,
            },
            {
              id: '68d03871-14fb-4d15-9024-6d62f73e57f6',
              type: 'paragraph',
              children: [
                {
                  text: '',
                },
              ],
            },
            {
              id: '101c2ba2-b229-4576-924d-3770041176ea',
              type: 'paragraph',
              children: [
                {
                  bold: true,
                  text: 'Feb 15 Tooltip',
                },
              ],
            },
            {
              id: '03e21d48-4390-44cc-997a-515709c352e6',
              type: 'paragraph',
              children: [
                {
                  text: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo.',
                },
              ],
            },
          ],
        },
      ],
      stepsByState: {
        __typename: 'GuideStepsByState',
        incomplete: [
          {
            name: 'Image perf - Tooltip',
            __typename: 'EmbedStep',
          },
        ],
        complete: [],
        skipped: [],
        viewed: [],
      },
      taggedElements: [
        {
          entityId: 'ebb2c5ed-0ffb-4ce9-9b70-8908997d9650',
          url: 'http://localhost:3000/workflows',
          wildcardUrl: 'http://localhost:3000/workflows',
          elementSelector:
            'div:nth-child(1) > .break-words tr:nth-child(5) .NaN',
          type: 'highlight',
          alignment: 'top_right',
          xOffset: 0,
          yOffset: 0,
          relativeToText: false,
          tooltipAlignment: 'right',
          style: {
            type: 'overlay',
            pulse: false,
            color: '#9B2FAE',
            thickness: 4,
            padding: 7,
            radius: 4,
            opacity: 0.3,
            __typename: 'VisualTagHighlightSettings',
          },
          tooltipTitle: 'Feb 15: Tooltip',
          isSideQuest: true,
          designType: 'everboarding',
          formFactor: 'tooltip',
          step: null,
          guide: 'eb61e297-efb0-432b-a9b0-93b9fb9d4c48',
          __typename: 'EmbedTaggedElement',
        },
      ],
      modules: [
        {
          __typename: 'EmbedGuideModule',
          id: 'RW1iZWRHdWlkZU1vZHVsZTowNmFkODgyYy05YjUzLTRhMTgtOTllZS1jNmYwM2ZlYTQ5NjU=',
          entityId: '06ad882c-9b53-4a18-99ee-c6f03fea4965',
          name: 'Image perf - Tooltip (Copy)',
          orderIndex: 0,
          nextModule: null,
          previousModule: null,
          guide: 'eb61e297-efb0-432b-a9b0-93b9fb9d4c48',
          totalStepsCount: 1,
          completedStepsCount: 0,
          isComplete: false,
          firstIncompleteStep: '923dc0a8-16e6-4792-be75-44cf7a97c960',
          steps: [
            {
              __typename: 'EmbedStep',
              id: 'RW1iZWRTdGVwOjkyM2RjMGE4LTE2ZTYtNDc5Mi1iZTc1LTQ0Y2Y3YTk3Yzk2MA==',
              entityId: '923dc0a8-16e6-4792-be75-44cf7a97c960',
              isComplete: false,
              completedAt: null,
              completedByUser: null,
              wasCompletedAutomatically: false,
              manualCompletionDisabled: false,
              name: 'Image perf - Tooltip',
              orderIndex: 0,
              bodySlate: [
                {
                  id: '62de8944-e5d2-42c2-b55c-b6591ce4f16d',
                  url: 'https://picsum.photos/1920/1080',
                  fill: 'marginless',
                  type: 'image',
                  children: [
                    {
                      text: '',
                    },
                  ],
                  naturalWidth: 1920,
                  naturalHeight: 1080,
                },
                {
                  id: '68d03871-14fb-4d15-9024-6d62f73e57f6',
                  type: 'paragraph',
                  children: [
                    {
                      text: '',
                    },
                  ],
                },
                {
                  id: '101c2ba2-b229-4576-924d-3770041176ea',
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: 'Feb 15 Tooltip',
                    },
                  ],
                },
                {
                  id: '03e21d48-4390-44cc-997a-515709c352e6',
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo.',
                    },
                  ],
                },
              ],
              hasViewedStep: false,
              state: 'incomplete',
              stepType: 'fyi',
              dismissLabel: 'false',
              nextStepEntityId: null,
              previousStepEntityId: null,
              guide: 'eb61e297-efb0-432b-a9b0-93b9fb9d4c48',
              module: '06ad882c-9b53-4a18-99ee-c6f03fea4965',
              branching: {
                __typename: 'EmbedBranching',
                key: null,
                type: null,
                question: null,
                multiSelect: false,
                dismissDisabled: false,
                formFactor: null,
                branches: null,
              },
              ctas: [],
              inputs: [],
            },
          ],
        },
      ],
    },
    __typename: 'GetDestinationGuidePayload',
  };

  test('normalize guide schema', () => {
    const { result: guideEntityId, entities } = normalize(
      server.guide,
      schema.guide
    ) as NormalizedGuideData;

    expect(guideEntityId).toEqual(server.guide.entityId);
    expect(entities.guides).toMatchObject({
      [server.guide.entityId]: {
        entityId: server.guide.entityId,
        modules: server.guide.modules.flatMap((m) => m.entityId),
        taggedElements: server.guide.taggedElements.map((t) => t.entityId),
      },
    });
    expect(entities.modules).toMatchObject({
      [server.guide.modules[0].entityId]: omit(
        server.guide.modules[0],
        'steps'
      ),
    });
    expect(entities.steps).toMatchObject({
      [server.guide.modules[0].steps[0].entityId]: {
        ...server.guide.modules[0].steps[0],
        completedAt: undefined, // stringToDate transforms it to undefined
      },
    });
    expect(entities.taggedElements).toMatchObject({
      [server.guide.taggedElements[0].entityId]: server.guide.taggedElements[0],
    });
  });
});
