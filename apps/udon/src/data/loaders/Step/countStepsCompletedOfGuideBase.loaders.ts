import Dataloader from 'dataloader';

import getNumberStepsCompletedOfGuideBase from 'src/interactions/analytics/stats/getNumberStepsCompletedForGuideBase';

export default function countStepsCompletedOfGuideBase() {
  return new Dataloader<number, number>(async (stepIds) => {
    const results = getNumberStepsCompletedOfGuideBase(stepIds);

    return results;
  });
}
