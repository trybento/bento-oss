import { defaultCommonTargeting } from 'components/EditorCommon/common';
import { prepareTargetingData } from 'components/EditorCommon/targeting.helpers';

export const prepareIntegrationTargeting = (targeting, attributes) =>
  targeting
    ? prepareTargetingData(targeting, attributes)
    : defaultCommonTargeting();
