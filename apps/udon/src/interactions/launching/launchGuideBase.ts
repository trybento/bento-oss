import { GuideBaseState, GuideTypeEnum } from 'bento-common/types';

import { enableLaunchReportsMutation } from 'src/utils/internalFeatures/internalFeatures';
import { LaunchReport } from '../reporting/LaunchReport';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Guide } from 'src/data/models/Guide.model';
import NoContentError from 'src/errors/NoContentError';
import { updateManualLaunchFlagForTemplates } from '../library/library.helpers';
import createGuideForAccountGuideBase from './createGuideForAccountGuideBase';
import { isReloadError } from 'src/data/data.helpers';

type Args = {
  guideBase: GuideBase;
  activateAt?: Date;
};

/**
 * Launch a guide base and, if it's an account guide, create a guide from it.
 * A Guide is returned (not null) only in the case of account guides.
 */
export async function launchGuideBase({
  guideBase,
  activateAt,
}: Args): Promise<[GuideBase, Guide | null]> {
  const activatedAt = activateAt || new Date();
  let guide: Guide | null = null;

  const template = await guideBase.$get('createdFromTemplate', {
    attributes: ['type', 'expireBasedOn', 'expireAfter'],
  });

  if (!template) {
    throw new NoContentError(guideBase.createdFromTemplateId || 0, 'template');
  }

  await guideBase.update({
    state: GuideBaseState.active,
    activatedAt,
  });

  const useLaunchReport = await enableLaunchReportsMutation.enabled();

  const launchReport = useLaunchReport
    ? new LaunchReport(
        'template',
        guideBase.createdFromTemplateId || 0,
        guideBase.organizationId
      )
    : undefined;

  if (template.type === GuideTypeEnum.account)
    guide = await createGuideForAccountGuideBase({
      guideBase,
      activateAt: activatedAt,
    });

  launchReport?.write();

  try {
    await guideBase.reload();
  } catch (e) {
    /** Handle if gb was soft deleted */
    if (isReloadError(e))
      throw new NoContentError(guideBase.id ?? 0, 'guide base');

    throw e;
  }

  if (guideBase.wasAutoLaunched === false && guideBase.createdFromTemplateId) {
    await updateManualLaunchFlagForTemplates({
      templateIds: [guideBase.createdFromTemplateId],
    });
  }

  return [guideBase, guide];
}
