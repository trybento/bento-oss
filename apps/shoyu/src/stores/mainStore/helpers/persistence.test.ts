import { sub } from 'date-fns';
import {
  BentoSettings,
  EmbedFormFactor,
  RecursivePartial,
} from 'bento-common/types';
import {
  BranchingChoiceKey,
  GlobalState,
  GuideEntityId,
  ModuleEntityId,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';

import {
  getPersistenceVersion,
  getVerifierKeyValue,
  removePreviewItems,
  reviveDates,
  sanitizeStateForPersistence,
} from './persistence';
import { StorageValue } from '../../middleware/persist';

describe('getVerifierKeyValue', () => {
  test('results in `${appId}:${accountId}:${accountUserId}` string', () => {
    // @ts-expect-error
    window.bentoSettings = {
      appId: 'app',
      account: {
        id: 'a1',
      },
      accountUser: {
        id: 'u2',
      },
    } as RecursivePartial<BentoSettings>;

    expect(getVerifierKeyValue()).toEqual(`app:a1:u2`);
  });
});

describe('getPersistenceVersion', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  test('commitSha being `dev` or `undefined` returns 0', () => {
    process.env.VITE_COMMIT_SHA = 'dev';
    expect(getPersistenceVersion()).toEqual(0);
    process.env.VITE_COMMIT_SHA = undefined;
    expect(getPersistenceVersion()).toEqual(0);
  });

  test('existing commitSha is returned', () => {
    process.env.VITE_COMMIT_SHA = '53f63b47';
    expect(getPersistenceVersion()).toEqual('53f63b47');
  });
});

describe('reviveDates', () => {
  test('properly revive dates without affecting other items', () => {
    const source = {
      initialized: sub(new Date(), { days: 7 }),
      completedAt: new Date(),
      doneAt: null,
      savedAt: sub(new Date(), { hours: 2 }),
      foo: 'bar',
      int: 2,
      obj: {
        attr: 'another',
      },
      nothing: null,
    };

    expect(JSON.parse(JSON.stringify(source), reviveDates)).toMatchObject(
      source
    );
  });
});

describe('removePreviewItems', () => {
  test.each([
    false,
    true,
    new Date(),
    null,
    undefined,
    'foo',
    99,
    () => {},
    {
      a: false,
      b: true,
      c: new Date(),
      d: null,
      e: undefined,
      f: 'foo',
      g: 99,
      h: () => {},
    },
  ])('%p value returns same', (value) => {
    expect(removePreviewItems(value as any)).toEqual(value);
  });
});

describe('sanitizePersistenceState', () => {
  test('preview data is filtered out', () => {
    const fakeState: StorageValue<GlobalState> = {
      version: 0,
      signature: 'fake',
      expireAt: new Date(),
      state: {
        guides: {
          ['3b6a6ac7-6624-47e8-a2d7-aec809055c31' as GuideEntityId]: {
            isPreview: true,
          },
          ['d17dd883-a1a3-4314-9880-85e957e2473b' as GuideEntityId]: {
            isPreview: false,
          },
        },
        modules: {
          ['c3511d6d-7fd4-47a3-a48b-d04388e8fcd9' as ModuleEntityId]: {
            isPreview: false,
          },
          ['f50b677e-d3cf-4af1-a96b-ee799b757a80' as ModuleEntityId]: {
            isPreview: true,
          },
        },
        steps: {},
        formFactors: {
          modal: {
            formFactor: EmbedFormFactor.modal,
            isPreview: true,
          },
          banner: {
            formFactor: EmbedFormFactor.banner,
            isPreview: false,
          },
          inline: {
            formFactor: EmbedFormFactor.inline,
            guides: [],
            selectedGuide: '5453f9b1-52d7-40bb-a100-4e2dd80be9fd',
            selectedModule: '287e8253-9e31-49b4-a06c-9bd541788c8a',
            selectedStep: '9e5e1004-d599-40b1-8bef-9e977fc49951',
          },
        },
        taggedElements: {
          ['512e92bd-19fb-4079-a5ee-c3e7869e0ace' as TaggedElementEntityId]: {
            entityId: '512e92bd-19fb-4079-a5ee-c3e7869e0ace',
            isPreview: false,
          },
          ['d3ba08f0-1d75-48a0-8eeb-f32cbe894135' as TaggedElementEntityId]: {
            entityId: 'd3ba08f0-1d75-48a0-8eeb-f32cbe894135',
            isPreview: true,
          },
        },
        branchingPaths: {
          paths: {
            ['foo' as BranchingChoiceKey]: {
              choiceKey: 'foo',
              branchingKey: 'bar',
              orderIndex: 0,
            },
          },
          guides: {},
          modules: {},
          steps: {},
        },
      },
    };

    const { state, ...rest } = fakeState;

    expect(sanitizeStateForPersistence(fakeState)).toStrictEqual(
      JSON.stringify({
        ...rest,
        state: {
          guides: {
            ['d17dd883-a1a3-4314-9880-85e957e2473b' as GuideEntityId]: {
              isPreview: false,
            },
          },
          modules: {
            ['c3511d6d-7fd4-47a3-a48b-d04388e8fcd9' as ModuleEntityId]: {
              isPreview: false,
            },
          },
          steps: {},
          formFactors: {
            banner: {
              formFactor: EmbedFormFactor.banner,
              isPreview: false,
            },
            inline: {
              formFactor: EmbedFormFactor.inline,
              guides: [],
              selectedGuide: '5453f9b1-52d7-40bb-a100-4e2dd80be9fd',
              selectedModule: '287e8253-9e31-49b4-a06c-9bd541788c8a',
              selectedStep: '9e5e1004-d599-40b1-8bef-9e977fc49951',
            },
          },
          taggedElements: {
            ['512e92bd-19fb-4079-a5ee-c3e7869e0ace' as TaggedElementEntityId]: {
              entityId: '512e92bd-19fb-4079-a5ee-c3e7869e0ace',
              isPreview: false,
            },
          },
          branchingPaths: {
            paths: {
              ['foo' as BranchingChoiceKey]: {
                choiceKey: 'foo',
                branchingKey: 'bar',
                orderIndex: 0,
              },
            },
            guides: {},
            modules: {},
            steps: {},
          },
        },
      })
    );
  });
});
