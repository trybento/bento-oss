import env from '@beam-australia/react-env';

import { GptErrors } from 'bento-common/types';
import {
  GroupTargeting,
  RuleTypeEnum,
  TargetingType,
  TargetValueType,
} from 'bento-common/types/targeting';
import { sleep } from 'bento-common/utils/promise';
import { IS_DEVELOPMENT } from 'utils/constants';

export type TestMode = 'off' | 'mock' | 'timer';

type Args = {
  accessToken: string;
  prompt: string;
  templateEntityId: string;
  /** For tracing a GPT generation across events */
  requestId: string;
  /** Provide a callback to allow ignoring the results when invoked */
  setCancel?: (cb: () => void | null) => void;
  /** Mock or simulate results to prevent real GPT use. Only in DEV */
  testMode?: TestMode;
};

const TEST_TARGETING: GroupTargeting = {
  account: {
    type: TargetingType.attributeRules,
    groups: [
      {
        rules: [
          {
            attribute: 'name',
            ruleType: RuleTypeEnum.equals,
            valueType: TargetValueType.text,
            value: 'Ventana',
          },
        ],
      },
    ],
  },
  accountUser: { type: TargetingType.all, groups: [] },
};

export const fetchTargeting = async ({
  accessToken,
  prompt,
  templateEntityId,
  requestId,
  setCancel,
  testMode,
}: Args): Promise<{
  targeting: GroupTargeting | null;
  error: GptErrors | null;
}> => {
  let cancelled = false;

  setCancel?.(() => {
    cancelled = true;
  });

  const handleCancelled = () => {
    /**
     * Return cancel state. The caller should ignore it.
     * We could send AbortSignal to the fetch request, but that would
     * not stop the GPT call or other async pieces server-side anyway.
     */
    return {
      targeting: null,
      error: GptErrors.cancelled,
    };
  };

  if (testMode !== 'off' && IS_DEVELOPMENT) {
    /** mini sleep even if no wait so it isn't instant. 0.1% realism in mocking */
    await sleep(testMode === 'timer' ? 30 * 1000 : 1000);

    if (cancelled) return handleCancelled();

    return {
      targeting: TEST_TARGETING,
      error: null,
    };
  }

  try {
    const res = await fetch(`${env('API_HOST')}/integrations/targeting-gpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        prompt,
        templateEntityId,
        requestId,
      }),
    });

    if (cancelled) return handleCancelled();

    const result = await res.json();

    if (res.ok) {
      return { targeting: result.gptOutput, error: null };
    }

    return { targeting: null, error: result.error };
  } catch (e) {
    return { targeting: null, error: GptErrors.apiError };
  } finally {
    setCancel?.(null);
  }
};

export const TARGETING_GPT_LOADER_MSG = [
  'Processing your description',
  'Gathering available attributes',
  'Generating rules',
  'Sprinkling magic dust ✨',
];
