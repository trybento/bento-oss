import { GuideBaseState, GuideState } from 'bento-common/types';

import { disableTransaction } from 'src/data';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Template } from 'src/data/models/Template.model';
import { logger } from 'src/utils/logger';
import createGuideFromGuideBase from '../createGuideFromGuideBase';
import NoContentError from 'src/errors/NoContentError';
import createAndLaunchGuide from '../launching/createAndLaunchGuide';

export type Args = {
  account: Account;
  accountUser: AccountUser;
  activeGuideBase: GuideBase | null;
  template: Template;
  /** Whether this guide is launched from another but not branching */
  isDestination?: boolean;
};

export default async function createAndLaunchAccountGuide({
  account,
  accountUser,
  activeGuideBase,
  template,
  isDestination = false,
}: Args): Promise<Guide | null> {
  if (activeGuideBase) {
    const existingGuide = await Guide.findOne({
      where: {
        createdFromGuideBaseId: activeGuideBase.id,
      },
    });

    if (!existingGuide) {
      throw new Error('Expected guide does not exist');
    }

    if ((existingGuide.state as unknown as GuideState) !== GuideState.active) {
      /* Case where user was only participant and set to inactive */
      await existingGuide.update({ state: GuideState.active });
    }

    await GuideParticipant.upsert(
      {
        organizationId: existingGuide.organizationId,
        guideId: existingGuide.id,
        accountUserId: accountUser.id,
        isDestination,
      },
      {
        returning: false,
        conflictFields: ['guide_id', 'account_user_id'] as any,
      }
    );

    return existingGuide;
  }

  const createdGuide = await createAndLaunchGuide({
    account,
    accountUser,
    launchFromAccountGuide: true,
    template,
    isDestination,
  });

  return createdGuide;
}
