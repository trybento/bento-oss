import { AutoLaunchLog } from 'src/data/models/AutoLaunchLog.model';
import { GuideBase } from 'src/data/models/GuideBase.model';

/** Enables split test to be ran again */
export async function removeSplitTestLog({
  guideBase,
}: {
  guideBase: GuideBase;
}) {
  if (!guideBase.createdFromSplitTestId) return;

  await AutoLaunchLog.destroy({
    where: {
      organizationId: guideBase.organizationId,
      templateId: guideBase.createdFromSplitTestId,
    },
  });
}
