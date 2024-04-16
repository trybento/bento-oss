import {
  GuideFormFactor,
  StepBodyOrientation,
  Theme,
} from 'bento-common/types';
import { getEmptyStep } from 'utils/getEmptyStep';
import { saveCSV } from 'helpers';
import { checkStorage } from 'hooks/useClientStorage';
import * as CreateModuleMutation from 'mutations/CreateModule';
import * as CreateNpsSurveyMutation from 'mutations/CreateNpsSurvey';
import env from '@beam-australia/react-env';

const API_HOST = env('API_HOST');
const AL_CSV_ENDPOINT = `${API_HOST}/autolaunch-report`;

export const requestAutolaunchCsv = async (accessToken?: string) => {
  const token =
    accessToken || checkStorage('localStorage')
      ? localStorage.accessToken
      : null;
  if (!token) return;

  const res = await fetch(AL_CSV_ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    const data = (await res.json()) as { report: string };
    const d = new Date();
    const filename = `BentoAutolaunchRules_${d.toISOString().split('T')[0]}`;
    saveCSV(filename, data.report);
  }
};

export const createNewStepGroup = async (
  guideFormFactor?: GuideFormFactor,
  theme?: Theme
) => {
  const result = await CreateModuleMutation.commit({
    moduleData: {
      name: '',
      stepPrototypes: [
        // @ts-ignore
        getEmptyStep(guideFormFactor, theme, {
          name: 'Sample step',
          entityId: null,
        }),
      ],
    },
  });

  const createdModule = result?.createModule?.module;
  return createdModule;
};

export const createNewNpsSurvey = async () => {
  return (await CreateNpsSurveyMutation.commit())?.createNpsSurvey?.npsSurvey;
};

export const formatContextualKey = (
  formFactor: GuideFormFactor,
  theme?: Theme | null,
  orientation?: StepBodyOrientation | null
) =>
  JSON.stringify({
    formFactor,
    ...(theme && { theme }),
    ...(orientation && { orientation }),
  });

/** Extracts predefined values from a selection type. */
export const getPredefinedTemplateValues = (
  jsonString: string
): {
  formFactor: GuideFormFactor;
  orientation: StepBodyOrientation;
  theme: Theme;
} | null => {
  try {
    const { formFactor, orientation, theme } = JSON.parse(jsonString);
    return { formFactor, orientation, theme };
  } catch (e) {
    // Passed string does not contain predefined data.
    return null;
  }
};
