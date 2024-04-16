import env from '@beam-australia/react-env';
import { GptErrors } from 'bento-common/types';
import { IS_DEVELOPMENT, IS_STAGING } from './constants';

export default async function fetchSnappyStepChoices(
  accessToken: string,
  stepContent: string
): Promise<{ choices: string[]; error: GptErrors | undefined }> {
  const testPrompt =
    IS_DEVELOPMENT || IS_STAGING
      ? window.localStorage.getItem('gptTestPrompt')
      : undefined;

  try {
    if (testPrompt)
      console.debug(`[fetchSnappyStepChoices] Using testPrompt: ${testPrompt}`);

    const res = await fetch(`${env('API_HOST')}/integrations/step-gpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        text: stepContent,
        ...(testPrompt && { testPrompt }),
      }),
    });
    const result = await res.json();
    if (res.ok) {
      return { choices: result.choices as string[], error: undefined };
    } else {
      return { choices: [], error: result.error };
    }
  } catch (e) {
    return { choices: [], error: GptErrors.apiError };
  }
}
