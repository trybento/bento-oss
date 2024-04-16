import {
  LaunchFailureReason,
  LaunchMethod,
} from 'bento-common/types/diagnostics';
import {
  GuideBaseState,
  GuideState,
  SelectedModelAttrs,
} from 'bento-common/types';

import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Guide, GuideScope } from 'src/data/models/Guide.model';
import { Template } from 'src/data/models/Template.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Account } from 'src/data/models/Account.model';

type FailureReasonArgs = {
  launchMethod: LaunchMethod;
  guideBase: null | SelectedModelAttrs<
    GuideBase,
    'id' | 'excludeFromUserTargeting' | 'state'
  >;
  participant: null | TroubleshootFocusedParticipant;
  accountUser: TroubleshootFocusedAccountUser;
};

export type TroubleshootFocusedParticipant = SelectedModelAttrs<
  GuideParticipant,
  'id' | 'obsoletedAt'
> & {
  guide: SelectedModelAttrs<Guide, 'state' | 'completedAt'> & {
    createdFromTemplate: Template;
  };
};

/**
 * Gets failure reasons that are not related to targeting specifically
 */
export const getFailureReason = ({
  launchMethod,
  guideBase,
  participant,
  accountUser,
}: FailureReasonArgs): LaunchFailureReason | null => {
  const hasGuideBase = !!guideBase;
  const guideState = participant?.guide?.state;
  const guideBaseState = guideBase?.state;

  let failureReason: LaunchFailureReason | null = null;

  if (accountUser.account.blockedAt) {
    failureReason = LaunchFailureReason.blocked;
  } else if (launchMethod !== LaunchMethod.auto && !hasGuideBase) {
    /** Manually launched guide that likely wasn't targeted to participant */
    failureReason = LaunchFailureReason.notAutoLaunched;
  } else if (
    launchMethod !== LaunchMethod.auto &&
    hasGuideBase &&
    guideState !== GuideState.active
  ) {
    /** Manually launched guide where user wasn't added to guide base */
    failureReason =
      guideBaseState === GuideBaseState.paused
        ? LaunchFailureReason.pausedManualLaunch
        : LaunchFailureReason.notAddedToGuide;
  } else if (participant?.guide?.completedAt) {
    /** User already completed guide */
    failureReason = LaunchFailureReason.completed;
  }

  return failureReason;
};

/**
 * Gets participant with elements relevant to debugging guide launches
 */
export const getFocusedParticipant = ({
  accountUserId,
  organizationId,
  templateEntityId,
}: {
  templateEntityId: string;
  accountUserId: number;
  organizationId: number;
}): Promise<null | TroubleshootFocusedParticipant> =>
  GuideParticipant.findOne({
    where: {
      organizationId,
      accountUserId,
    },
    attributes: ['id', 'obsoletedAt'],
    include: [
      {
        model: Guide.scope({
          method: [
            GuideScope.withTemplate,
            {
              required: true,
              where: {
                entityId: templateEntityId,
              },
            },
          ],
        }),
        required: true,
        attributes: ['state', 'completedAt'],
      },
    ],
  }) as Promise<TroubleshootFocusedParticipant | null>;

type TroubleshootFocusedAccountUser = SelectedModelAttrs<
  AccountUser,
  'entityId' | 'id'
> & {
  account: SelectedModelAttrs<Account, 'id' | 'blockedAt'>;
};

export const getFilteredAccountUser = ({
  accountEntityId,
  accountUserEntityId,
  organizationId,
}: {
  accountUserEntityId: string;
  accountEntityId: string;
  organizationId: number;
}) =>
  AccountUser.findOne({
    where: {
      entityId: accountUserEntityId,
      organizationId,
    },
    include: [
      {
        model: Account,
        where: {
          entityId: accountEntityId,
        },
        attributes: ['id', 'blockedAt'],
        required: true,
      },
    ],
    attributes: ['entityId', 'id'],
  }) as Promise<null | TroubleshootFocusedAccountUser>;
