import Dataloader from 'dataloader';

import getPercentageProgressOfGuideBase from 'src/interactions/analytics/stats/getPercentageProgressOfGuideBase';

export default function averageCompletionPercentageOfGuideBaseLoader() {
  return new Dataloader<number, number>(async (guideBaseIds) => {
    return getPercentageProgressOfGuideBase(guideBaseIds);
  });
}
