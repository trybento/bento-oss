import {
  CtasOrientation,
  GuideDesignType,
  GuideExpirationCriteria,
  GuideFormFactor,
  GuidePageTargetingType,
  StepBodyOrientation,
  StepCtaStyle,
  StepCtaType,
  StepType,
  Theme,
} from 'bento-common/types';
import { BranchingFormFactor } from 'bento-common/types/globalShoyuState';
import { TemplateValue } from 'bento-common/types/templateData';

export const templateValueMock: TemplateValue = {
  entityId: '57e8e920-112f-43b2-9acb-1f1e2d5f0419',
  privateName: 'Welcome to Payday',
  description: null,
  name: 'Welcome to Payday',
  theme: Theme.flat,
  isSideQuest: false,
  inlineEmbed: null,
  taggedElements: [],
  isCyoa: false,
  designType: GuideDesignType.onboarding,
  formFactor: GuideFormFactor.legacy,
  formFactorStyle: {
    stepBodyOrientation: StepBodyOrientation.vertical,
    mediaOrientation: null,
    height: 0,
    hideStepGroupTitle: null,
    hideCompletedSteps: false,
    imageWidth: '30%',
    ctasOrientation: CtasOrientation.left,
  },
  pageTargetingType: GuidePageTargetingType.anyPage,
  pageTargetingUrl: null,
  enableAutoLaunchAt: null,
  disableAutoLaunchAt: null,
  expireBasedOn: GuideExpirationCriteria.launch,
  expireAfter: 60,
  modules: [
    {
      name: 'Using PayDay.IO: A Quick Start Guide',
      displayTitle: 'Using PayDay.IO: A Quick Start Guide',
      description: null,
      entityId: '356b1214-b4e7-4236-9071-9c8dac1b1b25',
      stepPrototypes: [
        {
          name: 'Accessing Settings ',
          entityId: 'ef167257-6e33-4798-9cfb-6f7f0e48825d',
          body: "To get started with PayDay.IO, you'll need to access the settings menu. \n",
          bodySlate: [
            {
              type: 'paragraph',
              children: [
                {
                  children: [],
                  text: "To get started with PayDay.IO, you'll need to access the settings menu. ",
                },
              ],
            },
            {
              id: 'a7d5c3f3-8ed0-4a5c-8476-6b9e1c79f484',
              type: 'bulleted-list',
              children: [
                {
                  id: '03b0d34e-3007-4523-975e-31b92f9ddaad',
                  type: 'list-item',
                  children: [
                    {
                      children: [],
                      text: 'This allows you to customize your account and preferences. ',
                    },
                  ],
                },
              ],
            },
          ],
          stepType: StepType.optional,
          manualCompletionDisabled: true,
          eventMappings: [
            {
              eventName: 'Test event',
              completeForWholeAccount: false,
              rules: [],
            },
          ],
          branchingQuestion: '',
          branchingMultiple: false,
          branchingDismissDisabled: false,
          branchingFormFactor: BranchingFormFactor.dropdown,
          ctas: [
            {
              entityId: 'd8553a54-5a82-426e-969c-986f4782742d',
              type: StepCtaType.complete,
              style: StepCtaStyle.solid,
              text: 'Go to Settings',
              url: null,
              settings: {
                bgColorField: 'primaryColorHex',
                textColorField: 'white',
                eventName: 'action_name',
                markComplete: false,
                implicit: false,
                opensInNewTab: false,
              },
              destinationGuide: null,
            },
          ],
          mediaReferences: [],
          inputs: [],
          taggedElements: [],
          autoCompleteInteractions: [],
        },
        {
          name: 'Navigating Workflows',
          entityId: '789a2a32-5ac8-4720-aac0-29e97c2b479c',
          body: 'Workflows are a key feature in PayDay.IO. They help you automate tasks and streamline your work. To access workflows, follow these steps:\n',
          bodySlate: [
            {
              type: 'paragraph',
              children: [
                {
                  children: [],
                  text: 'Workflows are a key feature in PayDay.IO. They help you automate tasks and streamline your work. To access workflows, follow these steps:',
                },
              ],
            },
            {
              type: 'bulleted-list',
              children: [
                {
                  type: 'list-item',
                  children: [
                    {
                      children: [],
                      text: "Click on the 'Workflows' tab in the main navigation menu.",
                    },
                  ],
                },
                {
                  type: 'list-item',
                  children: [
                    {
                      children: [],
                      text: 'Select the workflow you want to work on.',
                    },
                  ],
                },
              ],
            },
          ],
          stepType: StepType.optional,
          manualCompletionDisabled: false,
          eventMappings: [],
          branchingQuestion: '',
          branchingMultiple: false,
          branchingDismissDisabled: false,
          branchingFormFactor: BranchingFormFactor.dropdown,
          ctas: [
            {
              entityId: '01eb2c47-3715-4db5-93d4-0c4a11d598e4',
              type: StepCtaType.complete,
              style: StepCtaStyle.solid,
              text: 'Access Workflows',
              url: null,
              settings: {
                bgColorField: 'primaryColorHex',
                textColorField: 'white',
                eventName: 'action_name',
                markComplete: false,
                implicit: false,
                opensInNewTab: false,
              },
              destinationGuide: null,
            },
          ],
          mediaReferences: [],
          autoCompleteInteractions: [],
          inputs: [],
          taggedElements: [],
        },
        {
          name: 'Checking Workflow Status',
          entityId: '3f0e8828-a601-4fdc-8c6f-2046ef65de67',
          body: 'To check the status of your workflow and resolve any errors, follow these steps:\n',
          bodySlate: [
            {
              type: 'paragraph',
              children: [
                {
                  children: [],
                  text: 'To check the status of your workflow and resolve any errors, follow these steps:',
                },
              ],
            },
            {
              type: 'bulleted-list',
              children: [
                {
                  type: 'list-item',
                  children: [
                    {
                      children: [],
                      text: "Click on the 'Workflows' tab in the main navigation menu.",
                    },
                  ],
                },
                {
                  type: 'list-item',
                  children: [
                    {
                      children: [],
                      text: "Click on the 'Status' column to view the status of each workflow.",
                    },
                  ],
                },
                {
                  type: 'list-item',
                  children: [
                    {
                      children: [],
                      text: 'Click into each error to be taken directly to the part of the workflow that needs to be amended.',
                    },
                  ],
                },
              ],
            },
          ],
          stepType: StepType.optional,
          manualCompletionDisabled: false,
          eventMappings: [],
          branchingQuestion: '',
          branchingMultiple: false,
          branchingDismissDisabled: false,
          branchingFormFactor: BranchingFormFactor.dropdown,
          ctas: [
            {
              entityId: 'ad6b7a22-ceae-4b49-8721-4c5918d2e30d',
              type: StepCtaType.complete,
              style: StepCtaStyle.solid,
              text: 'Done',
              url: null,
              settings: {
                bgColorField: 'primaryColorHex',
                textColorField: 'white',
                eventName: 'action_name',
                markComplete: false,
                implicit: false,
                opensInNewTab: false,
              },
              destinationGuide: null,
            },
          ],
          mediaReferences: [],
          autoCompleteInteractions: [],
          inputs: [],
          taggedElements: [],
        },
        {
          name: 'test',
          entityId: 'd75d93cb-4602-43d8-81e8-413f6832aa99',
          body: '',
          bodySlate: [
            {
              id: '93f8ed73-b654-4d8e-a8b5-745a37822ff7',
              type: 'paragraph',
              children: [
                {
                  id: '9ebb707a-aa5b-45ab-9bba-30f21b0e284d',
                  text: '',
                  type: 'text',
                  children: null,
                },
              ],
              template: true,
            },
          ],
          stepType: StepType.required,
          manualCompletionDisabled: false,
          eventMappings: [],
          branchingQuestion: '',
          branchingMultiple: false,
          branchingDismissDisabled: false,
          branchingFormFactor: BranchingFormFactor.dropdown,
          taggedElements: [],
          ctas: [
            {
              entityId: '2143229f-4796-4c3f-91c6-bbc04f9e4f00',
              type: StepCtaType.complete,
              style: StepCtaStyle.solid,
              text: 'Done',
              url: null,
              settings: {
                bgColorField: 'orgAdditionalColor0',
                textColorField: 'primaryColorHex',
                eventName: 'action_name',
                markComplete: false,
                implicit: false,
                opensInNewTab: false,
              },
              destinationGuide: null,
            },
            {
              entityId: '92dc03c0-2448-4af6-a7db-05485363990c',
              type: StepCtaType.skip,
              style: StepCtaStyle.link,
              text: 'Skip',
              url: null,
              settings: {
                bgColorField: 'primaryColorHex',
                textColorField: 'white',
                eventName: 'action_name',
                markComplete: false,
                implicit: false,
                opensInNewTab: false,
              },
              destinationGuide: null,
            },
          ],
          mediaReferences: [],
          autoCompleteInteractions: [],
          inputs: [],
        },
      ],
    },
  ],
};
