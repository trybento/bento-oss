import { every } from 'lodash';

import { GuideModule } from 'src/data/models/GuideModule.model';
import { Step } from 'src/data/models/Step.model';

type Args = {
  guideModule: GuideModule;
  timestamp: Date;
};

export async function updateGuideModuleCompletion({
  guideModule,
  timestamp = new Date(),
}: Args) {
  const guideModuleSteps = await Step.findAll({
    where: {
      guideModuleId: guideModule.id,
    },
  });

  const areAllStepsComplete = every(guideModuleSteps, 'isComplete');
  const isGuideModuleMarkedComplete = !!guideModule.completedAt;

  if (areAllStepsComplete && !isGuideModuleMarkedComplete) {
    await guideModule.update({
      completedAt: timestamp,
    });
  } else if (!areAllStepsComplete && isGuideModuleMarkedComplete) {
    await guideModule.update({
      completedAt: null,
    });
  }

  return guideModule;
}
