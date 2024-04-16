import { AtLeast, BentoSettings } from 'bento-common/types';
import { KbArticle } from 'bento-common/types/integrations';
import { debugMessage } from 'bento-common/utils/debugging';
import { debounce } from 'bento-common/utils/lodash';

import catchException from '../lib/catchException';
import { getTraceHeaders } from '../lib/trace';
import sessionStore from '../stores/sessionStore';
import { getToken } from '../stores/sessionStore/helpers';
import fetch from './fetch';
import { API_URL_BASE } from '../constants';

/**
 * Let udon know this user has been exposed to the sidebar onboarding
 *   animation
 *
 * The throttle is used to prevent it sending more than once, we can also
 *   add an implementation of once() instead
 */
export const trackOnboardedSidebar = debounce(async () => {
  try {
    const token = getToken();

    if (!token) return;

    const response = await fetch(`${API_URL_BASE}/embed/update-properties`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: 'onboardedSidebar', value: true }),
    });

    if (response && !response.ok) {
      throw new Error('Could not track onboarding sidebar usage');
    }
  } catch (e) {
    catchException(e as Error, 'Track onboarded sidebar');
  }
}, 30000);

export const resetDropdown = async ({
  stepEntityId,
  slateNodeId,
  accountUserEntityId,
}: {
  stepEntityId: string;
  slateNodeId: string;
  accountUserEntityId?: string;
}) => {
  try {
    const token = getToken();

    if (!token) return;

    const response = await fetch(`${API_URL_BASE}/embed/reset-dropdown`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stepEntityId, slateNodeId, accountUserEntityId }),
    });

    if (response && !response.ok) {
      throw new Error('Could not reset dropdown');
    }
  } catch (e) {
    catchException(e as Error, 'Reset Dropdown');
  }
};

type VideoErrorArgs = {
  videoId: string;
  videoUrl: string;
  stepEntityId: string;
};

/** Send an error to the server about a video 404 */
const notifyVideoErrorRaw = async (params: VideoErrorArgs) => {
  try {
    const token = getToken();
    if (!token) return;

    const response = await fetch(`${API_URL_BASE}/embed/video-error`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (response && !response.ok) {
      throw new Error('Post on bad video url failed');
    }
  } catch (e) {
    catchException(e as Error, 'Video Error');
  }
};

export const searchKbArticles = async (query: string) => {
  const token = getToken();
  if (!token) return [];

  const response = await fetch(
    `${API_URL_BASE}/embed/kb/search?query=${query}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const json = await response.json();

  return json.articles as KbArticle[];
};

/* Debounce so we don't send from sidebar+inline, or etc. */
export const notifyVideoError = debounce(notifyVideoErrorRaw, 1000);

export const sendDiagnostics = async (
  payload: AtLeast<any, 'appId' | 'event'>
) => {
  if (!payload.appId) return;
  await fetch(`${API_URL_BASE}/embed/diagnostics`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getTraceHeaders(),
    },
    body: JSON.stringify(payload),
  });
};

export const handleIdentify = async (
  bentoSettings: BentoSettings
): Promise<
  [
    /** Whether the account/User was successfully identified */
    success: boolean,
    /** Whether launching cache was hit for the account/User */
    cacheHit: boolean
  ]
> => {
  const response = await fetch(
    `${process.env.VITE_PUBLIC_API_URL_BASE}/embed/identify`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...getTraceHeaders(),
      },
      body: JSON.stringify(bentoSettings as BentoSettings),
    }
  );

  /* Network error */
  if (!response) return [false, false];

  const permissionError = [401, 403, 404].includes(response.status);

  if (!response.ok && !permissionError) {
    const err = new Error(
      `[BENTO] Error identifying account and/or user: ${response.status} - ${response.statusText}`
    );
    (err as any).response = {
      type: response.type,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    catchException(err, 'Identify/Fetch');
    throw err;
  }

  if (!permissionError) {
    try {
      const data = (await response.json()) as {
        // on success
        token?: string;
        enabledFeatureFlags?: string[] | null;
        /** Determines whether or not cache was hit on the server */
        cacheHit?: boolean;
        // on error
        message?: string;
        errors?: Record<string, unknown>[];
      };

      const { message, token, enabledFeatureFlags, cacheHit } = data;

      if (!token && !permissionError) {
        const errMessage = message
          ? `[BENTO] Error identifying: ${message}`
          : '[BENTO] Error identifying account and/or user. No token returned.';
        throw new Error(errMessage);
      }

      sessionStore.getState().setSessionData(token, enabledFeatureFlags);

      return [true, !!cacheHit];
    } catch (e: any) {
      catchException(e, 'Identify/Parse');
    }
  }

  return [false, false];
};

/**
 * Performs long polling to know when the server finishes processing
 * the checks and is safe to hydrate to get the most up-to-date data.
 *
 * It will permanently fail after 3 attempts OR if the request timed out.
 */
export const handlePollingChecks = async (attempt = 1): Promise<boolean> => {
  if (attempt > 3) {
    debugMessage('[BENTO] Long polling permanently failed');
    return false;
  }

  debugMessage('[BENTO] Long polling checks...');
  const response = await fetch(`${API_URL_BASE}/embed/identify/checks`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...getTraceHeaders(),
    },
  });

  // server terminated connection after 30s or there was an error with the fetch
  if (!response || response.status === 408) {
    return false;
  }

  // server is "ok"
  if (response.status === 200) {
    debugMessage('[BENTO] Long polling succeeded');
    return true;
  }

  debugMessage('[BENTO] Long polling checks failed, retrying...');

  return await handlePollingChecks(attempt + 1);
};
