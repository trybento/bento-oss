import { Attributes } from 'src/interactions/recordEvents/recordAndSetCustomAttributes';
import { BentoApiKeyType } from 'src/data/models/SegmentApiKey.model';
import { DataSource } from 'bento-common/types';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

/** Explicitly declare which behaviors to run */
type BehaviorOptions = {
  /**
   * Whether to perform account checks
   * @default false
   */
  checkAccounts?: boolean;
  /**
   * Whether to perform account user checks
   * @default false
   */
  checkAccountUsers?: boolean;
  /**
   * Whether to record custom attributes for both account/User
   * @default true
   **/
  recordAttributes?: boolean;
  /**
   * Whether the account changed (e.g. is new or attrs changed)
   * @default false
   */
  accountChanged?: boolean;
  /**
   * Whether the account user changed (e.g. is new or attrs changed)
   * @default false
   */
  accountUserChanged?: boolean;
  /**
   * Whether to emit socket events to the accountUser
   * @default true
   */
  emitSocketEvents?: boolean;
};

export interface HandleIdentifyChecksPayload {
  /** Bento initialization Id */
  initId?: string;
  accountEntityId?: string;
  accountUserEntityId?: string;
  accountAttributes?: Attributes;
  accountUserAttributes?: Attributes;
  integrationType?: BentoApiKeyType;
  eventName?: string;
  behavior: BehaviorOptions;
  /**
   * Determines whether or not we wanna generate a launch report
   * @todo move into `behavior` namespace
   **/
  withLaunchReport?: boolean;
}

/** Get data source according to what integration provided the data */
export const getDataSourceType = (integrationType?: BentoApiKeyType) => {
  switch (integrationType) {
    case BentoApiKeyType.api:
      return DataSource.api;
    default:
      return DataSource.snippet;
  }
};

/**
 * Queue a job and enforce typings
 *    If no accountUserEntityId is provided, we can't autocomplete steps
 *    Providing the attributes for an account or accountUser will run its associated checks
 */
export const queueIdentifyChecks = async (
  jobPayload: HandleIdentifyChecksPayload
) => {
  const { accountEntityId, accountUserEntityId, behavior, eventName } =
    jobPayload;

  if (!accountEntityId && !accountUserEntityId) return;

  if (!eventName && !behavior.checkAccountUsers && !behavior.checkAccounts)
    return;

  await queueJob({
    jobType: JobType.HandleIdentifyChecks,
    ...jobPayload,
  });
};
