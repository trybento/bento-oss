import { prepareTargetingData } from 'components/EditorCommon/targeting.helpers';
import cloneDeep from 'lodash/cloneDeep';
import { AttributesQuery_attributes } from 'providers/AttributesProvider';
import { EditNpsQuery } from 'relay-types/EditNpsQuery.graphql';
import { NpsFormValue } from 'types';

export const prepareNpsSurveyData = (
  npsSurvey: EditNpsQuery['response']['npsSurvey'],
  /** We will need to supplement this with prepareSupportingAutolaunchContext for branching, launch etc. */
  attributes: AttributesQuery_attributes
) => {
  // Remove readonly fields.
  return {
    ...(cloneDeep(npsSurvey) as NpsFormValue['npsSurveyData']),
    targets: prepareTargetingData(npsSurvey.targets, attributes),
  };
};

/** From scheduling form to reflect what we have there. */
export const selectStyles = {
  container: (provided) => ({
    ...provided,
    flexGrow: 1,
  }),
};
