import env from '@beam-australia/react-env';
import { GuidePageTargetingType, InlineEmbedState } from 'bento-common/types';

import { LaunchDiagnosticsResult } from 'bento-common/types/diagnostics';
import { isDesignType } from 'helpers/transformedHelpers';

import { TroubleshootTemplateSelectedQuery$data } from 'relay-types/TroubleshootTemplateSelectedQuery.graphql';
import { ExtendedSelectOptions } from 'system/Select';

const API_HOST = env('API_HOST');
const LAUNCH_DIAGNOSTICS_ENDPOINT = `${API_HOST}/diagnostics/launching-lookup`;

export type ContentSelection = {
  entityId: string;
  contentType: 'nps' | 'guide';
  /* For display purposes across steps */
  name: string;
  Icon: ExtendedSelectOptions['Icon'];
};

/**
 * Common props for each different type of diagnostic
 */
export type TroubleshootModuleProps = {
  onReset: () => void;
};

/**
 * Return attributes that have failed to match
 * and also the attributes/targeting for us to
 *   display if necessary
 */
export const testLaunchingRules = async ({
  accessToken,
  accountEntityId,
  accountUserEntityId,
  templateEntityId,
}: {
  templateEntityId: string;
  accountUserEntityId: string;
  accountEntityId: string;
  accessToken: string;
}) => {
  const res = await fetch(LAUNCH_DIAGNOSTICS_ENDPOINT, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      accountUserEntityId,
      accountEntityId,
      templateEntityId,
    }),
  });

  const json = (await res.json()) as LaunchDiagnosticsResult;

  const { reports, ...rest } = json;

  const accountMismatches =
    typeof reports.account?.result === 'object'
      ? reports.account.result.failedRules
      : [];
  const accountUserMismatches =
    typeof reports.accountUser?.result === 'object'
      ? reports.accountUser.result.failedRules
      : [];

  return {
    accountMismatches,
    accountUserMismatches,
    ...rest,
  };
};

type ContentDetail = TroubleshootTemplateSelectedQuery$data['template'];

/**
 * Whether or not we should check page targeting for a guide
 */
export const shouldCheckLocation = (contentDetail: ContentDetail) => {
  /** No active inline embed (sidebar only) and onboarding */
  if (
    !contentDetail.locationShown &&
    isDesignType.onboarding(contentDetail.designType)
  )
    return false;

  /** Non-onboarding guide only in guides list or not-targeted */
  if (
    (isDesignType.everboarding(contentDetail.designType) ||
      isDesignType.announcement(contentDetail.designType)) &&
    contentDetail.pageTargetingType === GuidePageTargetingType.anyPage
  )
    return false;

  return true;
};
