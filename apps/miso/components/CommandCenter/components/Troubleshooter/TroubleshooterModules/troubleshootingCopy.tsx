import React from 'react';

import { LaunchMethod } from 'bento-common/types/diagnostics';
import { ENG_CALENDLY_URL } from 'bento-common/frontend/constants';
import Link from 'system/Link';

import { TroubleshootTemplateSelectedQuery$data } from 'relay-types/TroubleshootTemplateSelectedQuery.graphql';
import { isDesignType, isFormFactor } from 'helpers/transformedHelpers';
import { GuidePageTargetingType } from 'bento-common/types';
import InlineLink from 'components/common/InlineLink';

/**
 * @todo move in other copy combos and reasons and rename the current ones to be more specific
 */
export enum FailureReason {
  targeting = 'targeting',
  blocked = 'blocked',
  expiry = 'expiry',
  obsoleted = 'obsoleted',
  notAutoLaunched = 'notAutoLaunched',
  notAddedToGuide = 'notAddedToGuide',
  completed = 'completed',
  pausedManualLaunch = 'pausedManualLaunch',
}

/**
 * Main copy for why a launch failed
 */
export const FAIL_REASONS: Record<FailureReason, string> = {
  [FailureReason.blocked]: 'Account is blocked',
  [FailureReason.expiry]:
    "Guide has expired for this user because they haven't engaged with the guide at all within the expiration timing",
  [FailureReason.obsoleted]:
    'User no longer matches the targeting rules. The guide was obsoleted for that user.',
  [FailureReason.targeting]: "Targeting rules don't match",
  [FailureReason.notAutoLaunched]:
    "This guide isn't set to automatically launch, and wasn't launched specifically for this account. Please check whether it is triggered by other guides.",
  [FailureReason.notAddedToGuide]:
    "This guide is currently launched manually to specific accounts, or launched via another guide. This user might not match the user-level targeting rules, or hasn't taken actions that triggers this guide.",
  [FailureReason.completed]:
    'This user has already seen and completed this guide.',
  [FailureReason.pausedManualLaunch]:
    'Looks like the guide has stopped launching for new users in this account.',
};

/** Gets hash of recommendations based on reason a launch failed */
export const FAIL_RECS = ({
  contentEntityId,
  accountEntityId,
}: {
  contentEntityId: string;
  accountEntityId: string;
  launchMethod: LaunchMethod;
}) => ({
  [FailureReason.pausedManualLaunch]: [
    <>
      If you want this account to get the guide, you need to include it in the
      targeting rules for the{' '}
      <Link
        color="blue.500"
        href={`/library/templates/${contentEntityId}?tab=launching`}
        isExternal
      >
        template
      </Link>{' '}
      and auto-launch it.
    </>,
  ],
  [FailureReason.completed]: [
    <>
      To have all users in the account view this guide again, reset it from the
      account's{' '}
      <Link
        color="blue.500"
        href={`/customers/${accountEntityId}/guides`}
        isExternal
      >
        guide table
      </Link>
      . <b>This will reset the guide's progress for all account users.</b>
    </>,
  ],
  [FailureReason.notAddedToGuide]: [
    <>
      If the guide was manually launched, check the{' '}
      <Link
        color="blue.500"
        href={`/library/templates/${contentEntityId}?tab=launching`}
        isExternal
      >
        user targeting
      </Link>{' '}
      to make sure it includes your user
    </>,
    <>
      If the guide was launched by other guides, make sure the user has engaged
      with other guides to get this guide
    </>,
    <>
      After investigating, if you still aren’t seeing the guide, please reach
      out to{' '}
      <Link color="blue.500" href={ENG_CALENDLY_URL} isExternal>
        support
      </Link>
    </>,
  ],
  [FailureReason.blocked]: [
    <>
      Manage your blocked accounts{' '}
      <Link
        color="blue.500"
        href={'/command-center?tab=blocked%20accounts'}
        isExternal
      >
        here
      </Link>
    </>,
  ],
  [FailureReason.expiry]: [
    <>
      If you want this user to receive the guide again you will need to
      duplicate the{' '}
      <Link
        color="blue.500"
        href={`/library/templates/${contentEntityId}`}
        isExternal
      >
        guide
      </Link>
      , target the guide to the specific user and launch the guide
    </>,
  ],
  [FailureReason.obsoleted]: [
    <>
      If you want this user to receive the guide again you will need to
      duplicate the{' '}
      <Link
        color="blue.500"
        href={`/library/templates/${contentEntityId}`}
        isExternal
      >
        guide
      </Link>
      , target the guide to the specific user and launch the guide
    </>,
  ],
  [FailureReason.targeting]: [
    <>
      Adjust the{' '}
      <Link
        color="blue.500"
        href={`/library/templates/${contentEntityId}?tab=launching`}
        isExternal
      >
        targeting rules
      </Link>{' '}
      for this guide to target desired user and account
    </>,
    <>
      Or, manually launch guide to{' '}
      <Link
        color="blue.500"
        href={`/customers/${accountEntityId}/guides`}
        isExternal
      >
        account
      </Link>{' '}
      and user
    </>,
  ],
  [FailureReason.notAutoLaunched]: [
    <>
      If the guide was launched by other guides, make sure the user has engaged
      with the other guides
    </>,
    <>
      If you want to see this guide without having to interact with another
      guide,{' '}
      <Link
        color="blue.500"
        href={`/library/templates/${contentEntityId}?tab=launching`}
        isExternal
      >
        auto-launch
      </Link>{' '}
      it
    </>,
    <>
      If you interacted with the other guides launching this guide, and still
      aren’t seeing it, please reach out to{' '}
      <Link color="blue.500" href={ENG_CALENDLY_URL} isExternal>
        support
      </Link>
    </>,
  ],
});

type ContentDetail = TroubleshootTemplateSelectedQuery$data['template'];

type GeneralRecsArgs = {
  contentDetails: ContentDetail;
  accountEntityId: string;
  accountName: string;
};

/**
 * Get recommendations relevant to the guide type
 */
export const getGeneralRecommendations = ({
  contentDetails,
  accountEntityId,
  accountName,
}: GeneralRecsArgs) => {
  const base: React.ReactNode[] = [
    <>
      Reach out to your admins with the guide URL and user email if the problem
      persists
    </>,
  ];

  const isOnboarding = isDesignType.onboarding(contentDetails.designType);
  const isModal = isFormFactor.modal(contentDetails.formFactor);
  const isDismissible =
    isDesignType.announcement(contentDetails.designType) ||
    isFormFactor.tooltip(contentDetails.formFactor);
  const guideListContextual =
    isFormFactor.sidebar(contentDetails.formFactor) &&
    contentDetails.pageTargetingType === GuidePageTargetingType.anyPage;

  if (isModal) base.unshift(<>Modals are throttled to 1x session</>);

  if (isDismissible) {
    base.unshift(
      <>
        You can reset this guide for{' '}
        <InlineLink
          href={`/customers/${accountEntityId}/guides`}
          label={accountName}
        />{' '}
        by hovering over the guide name and accessing the menu
      </>
    );
    base.unshift(
      <>
        It's possible the user saw and dismissed the guide, in which case they
        won't get it again
      </>
    );
  }

  if (guideListContextual)
    base.unshift(
      <>
        This guide is set to only show up in the guides list. Please check the
        resource center
      </>
    );

  if (isOnboarding)
    base.unshift(
      <>
        Onboarding guides are unlocked one at a time, so the user may not get
        this guide until they've completed earlier ones
      </>
    );

  return base;
};
