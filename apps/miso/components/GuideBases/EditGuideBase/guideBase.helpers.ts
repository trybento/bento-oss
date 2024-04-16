import { getQueryParam, sanitizeGuideBaseData } from 'helpers';
import { commit as EditGuideBaseMutation } from 'mutations/EditGuideBase';
import { EditGuideBaseInput } from 'relay-types/EditGuideBaseMutation.graphql';

type GetPreselectedArgs = {
  modules: {
    steps: { entityId?: string; [other: string]: any }[];
    [other: string]: any;
  }[];
  [other: string]: any;
};

/** gb's are finicky to display and submit, make sure the data is all clear */
export const submitEditGuideBaseMutation = async (
  input: EditGuideBaseInput
) => {
  const sanitizedInput: EditGuideBaseInput = {
    ...input,
    data: sanitizeGuideBaseData(input.data),
  };

  return EditGuideBaseMutation(sanitizedInput);
};

export const getPreselectedStep = (guideData: GetPreselectedArgs) => {
  const preSelectedStep = getQueryParam('step');
  let m = 0;
  let s = 0;
  if (preSelectedStep) {
    for (let i = 0; i < guideData.modules.length; i++) {
      for (let j = 0; j < guideData.modules[i].steps.length; j++) {
        if (guideData.modules[i].steps[j].entityId === preSelectedStep) {
          m = i;
          s = j;
          break;
        }
      }
    }
  }

  return [m, s];
};

type GetPreselectedUserArgs = {
  modules: {
    steps: { entityId?: string; [other: string]: any }[];
    [other: string]: any;
  }[][];
  [other: string]: any;
};

export const getPreselectedStepUser = (guideData: GetPreselectedUserArgs) => {
  const preSelectedStep = getQueryParam('step');
  let m = 0;
  let m2 = 0;
  let s = 0;
  if (preSelectedStep) {
    for (let i = 0; i < guideData.modules.length; i++) {
      for (let j = 0; j < guideData.modules[i].length; j++) {
        for (let k = 0; k < guideData.modules[i][j].steps.length; k++) {
          if (guideData.modules[i][j].steps[k].entityId === preSelectedStep) {
            m = i;
            m2 = j;
            s = k;
            break;
          }
        }
      }
    }
  }

  return [m, m2, s];
};
