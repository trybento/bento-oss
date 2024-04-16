import { EventHookType, WebhookType } from 'bento-common/types';
import { InputWithAnswer } from 'src/graphql/InputStep/types';

export { WebhookState } from 'src/data/models/Integrations/Webhook.model';

export type WebhookPayload =
  | PingPayload
  | GuideEventPayload
  | StepViewedPayload
  | StepCompletedPayload;

export type WebhookPayloadMap = {
  [EventHookType.GuideCompleted]: GuideEventPayload;
  [EventHookType.GuideViewed]: GuideEventPayload;
  [EventHookType.StepCompleted]: StepCompletedPayload;
  [EventHookType.StepViewed]: StepViewedPayload;
};

type BasePayload = {
  /** Clients use External Id */
  accountId: string | null;
  accountName: string | null;
  /** Clients use External Id */
  userId: string | null;
  userEmail: string | null;
};

type PingPayload = BasePayload & {
  eventType: EventHookType.Ping;
  data: {
    message?: string;
  };
};

type GuideEventPayload = BasePayload & {
  eventType: EventHookType.GuideCompleted | EventHookType.GuideViewed;
  data: {
    guideEntityId?: string;
    guideName?: string;
  };
};

type StepPayloadData = {
  stepEntityId: string;
  stepName?: string;
  guideEntityId?: string;
  guideName?: string;
  orderIndex?: number;
};

type StepViewedPayload = BasePayload & {
  eventType: EventHookType.StepViewed;
  data: StepPayloadData;
};

/** Simplified version of StepCompletedByType */
export enum StepCompletedByPayloadType {
  auto = 'auto',
  manual = 'manual',
}

type StepCompletedPayload = Omit<StepViewedPayload, 'eventType'> & {
  eventType: EventHookType.StepCompleted;
  data: StepPayloadData & {
    inputAnswers?: InputWithAnswer[];
    branchingChoices?: { question?: string; choice?: string };
    completedByType?: StepCompletedByPayloadType;
  };
};

type ModifiedPayload = WebhookPayload & {
  timestamp: string;
  eventId: string;
};

export type WebhookDestinationData = {
  webhookUrl: string;
  secretKey?: string;
  webhookType: WebhookType;
};

export type EventHookPayload = {
  /** If we want to override any db e.g. for a test */
  destinationOpts?: WebhookDestinationData;
  payload: ModifiedPayload;
  organizationId: number;
};

export { EventHookType } from 'bento-common/types';
