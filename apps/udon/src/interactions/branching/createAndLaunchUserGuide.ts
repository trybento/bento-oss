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

export default async function createAndLaunchUserGuide({
  account,
  accountUser,
  activeGuideBase,
  template,
  isDestination = false,
}: Args): Promise<Guide> {
  if (activeGuideBase) {
    let existingOrCreatedGuide: Guide | null = await Guide.findOne({
      where: {
        createdFromGuideBaseId: activeGuideBase.id,
      },
      include: [
        {
          required: true,
          model: GuideParticipant,
          where: { accountUserId: accountUser.id },
          attributes: ['id'],
        },
      ],
    });

    if (!existingOrCreatedGuide) {
      existingOrCreatedGuide = await createGuideFromGuideBase({
        guideBase: activeGuideBase,
        state: GuideState.active,
        launchedAt: new Date(),
        checkForInactiveForAccountUserId: accountUser.id,
      });
    }

    await GuideParticipant.upsert(
      {
        guideId: existingOrCreatedGuide.id,
        accountUserId: accountUser.id,
        organizationId: activeGuideBase.organizationId,
        isDestination,
      },
      {
        returning: false,
        conflictFields: ['guide_id', 'account_user_id'] as any,
      }
    );

    return existingOrCreatedGuide;
  }

  /* Find existing in case of serial cyoa */
  const existing = await GuideParticipant.findOne({
    where: {
      accountUserId: accountUser.id,
      organizationId: template.organizationId,
    },
    include: [
      {
        model: Guide,
        where: {
          createdFromTemplateId: template.id,
        },
        required: true,
      },
    ],
  });

  if (existing) return existing.guide;

  try {
    const createdGuide = (await createAndLaunchGuide({
      account,
      accountUser,
      template,
      launchFromAccountGuide: false,
      isDestination,
    }))!;

    return createdGuide;
  } catch (e: any) {
    /* Check for paused guide to throw proper error */
    await disableTransaction(async () => {
      const pausedGuideBase = await GuideBase.findOne({
        where: {
          createdFromTemplateId: template.id,
          accountId: account.id,
          state: GuideBaseState.paused,
        },
        attributes: ['id'],
      });

      if (pausedGuideBase) {
        logger.error(
          `[createAndLaunchFromUserGuide] Branching to paused guide: oId:${template.organizationId} ${pausedGuideBase.entityId}`
        );
        throw new NoContentError(pausedGuideBase.id, 'guide base');
      }
    });

    throw e;
  }
}
