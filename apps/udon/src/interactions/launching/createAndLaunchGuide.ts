import { GuideState, GuideTypeEnum } from 'bento-common/types';

import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Template } from 'src/data/models/Template.model';
import { createGuideBase } from '../createGuideBase';
import createGuideFromGuideBase from '../createGuideFromGuideBase';
import { launchGuideBase } from '../launching/launchGuideBase';

type Args = {
  account: Account;
  accountUser: AccountUser;
  template: Template;
  launchFromAccountGuide?: boolean;
  /** Whether this was launched from another guide (but not branching) */
  isDestination?: boolean;
};

export default async function createAndLaunchGuide({
  account,
  accountUser,
  template,
  launchFromAccountGuide = false,
  isDestination = false,
}: Args): Promise<Guide | null> {
  /** If we are launching user guides from an account guide path */
  const originIsAccountTargetIsUser =
    launchFromAccountGuide && template.type === GuideTypeEnum.user;
  const destinationIsAccountGuide = template.type === GuideTypeEnum.account;

  const createdGuideBase = await createGuideBase({
    account,
    templateEntityId: template.entityId,
    excludeFromUserTargeting: !(
      launchFromAccountGuide ||
      destinationIsAccountGuide ||
      originIsAccountTargetIsUser
    ),
  });

  /* If we targeted an account guide, regardless of origin guide, this will launch all */
  await launchGuideBase({ guideBase: createdGuideBase });

  let createdGuide: Guide | null;

  if (launchFromAccountGuide || template.type === GuideTypeEnum.account) {
    createdGuide = await Guide.findOne({
      where: { createdFromGuideBaseId: createdGuideBase.id },
    });

    /* If we targeted user guide with an account origin guide it is handled by the originIsAccountTargetIsUser property above */
  } else {
    const now = new Date();

    createdGuide = await createGuideFromGuideBase({
      guideBase: createdGuideBase,
      state: GuideState.active,
      launchedAt: now,
      checkForInactiveForAccountUserId: accountUser.id,
    });
  }

  if (createdGuide) {
    await GuideParticipant.upsert(
      {
        organizationId: createdGuideBase.organizationId,
        guideId: createdGuide.id,
        accountUserId: accountUser.id,
        isDestination,
      },
      {
        returning: false,
        conflictFields: ['guide_id', 'account_user_id'] as any,
      }
    );
  }

  return createdGuide;
}
