import {
  DynamicAttributes,
  GuideBaseState,
  GuideState,
  TargetValueType,
} from '.';
import { GroupTargeting, RuleTypeEnum } from './targeting';

/**
 * @todo clean up, a union of assorted strings is really weird
 */
export type RuleResult =
  | { matchedRules: CheckResults[]; failedRules?: CheckResults[] }
  | 'userTarget'
  | 'allTarget'
  | 'blockedByLaunchLog'
  /* Means either user target or all target */
  | '(user guide) matched user user/all targets'
  | '(account guide) matched user/all targets';

export type CheckResults = {
  /** The value of the attribute we got from an entity */
  attrValue: DynamicAttributes[keyof DynamicAttributes];
  /** The value we're comparing to defined in the rule */
  ruleValue: DynamicAttributes[keyof DynamicAttributes];
  ruleType: RuleTypeEnum;
  attribute?: string;
  valueType: TargetValueType;
};

/**
 * Special reasons for a particular launching result
 */
export enum LaunchFailureReason {
  cache = 'caching that would have resulted in skipped checks',
  autoLaunchedAccountGuides = 'auto-launched account guides',
  blocked = 'blocked',
  notAutoLaunched = 'live but not auto-launched',
  notAddedToGuide = 'not added to guide base',
  completed = 'completed',
  pausedManualLaunch = 'pausedManualLaunch',
}

export type LaunchReportPayload = {
  type: 'template' | 'account' | 'accountUser';
  /** Record key is template_{id} */
  checks: Record<
    string,
    {
      result: RuleResult;
      /** Usually the guide's name */
      context: string;
    }
  > & {
    [K in LaunchFailureReason]?: any;
  };
};

export enum LaunchMethod {
  auto = 'auto',
  manual = 'manual',
  /** Launched via actions, like branching or CTA */
  action = 'action',
}

export type LaunchDiagnosticsResult = {
  reports: {
    account?: LaunchReportPayload['checks'][string];
    accountUser?: LaunchReportPayload['checks'][string];
  };
  accountAttributes: DynamicAttributes;
  accountUserAttributes: DynamicAttributes;
  accountEntityId: string;
  accountUserEntityId: string;
  accountName: string;
  accountUserName: string;
  /** These will be the targets matched against, so it may be an audience */
  targets: GroupTargeting;
  /** If the user has the guide, what is its state? */
  guideState?: GuideState;
  obsoletedAt?: string | Date;
  failureReason: LaunchFailureReason | null;
  /**
   * This is not super nuanced a check yet.
   * We may need to support other launch methods in the future by
   *   checking the guide base as well.
   */
  launchMethod?: LaunchMethod;
};
