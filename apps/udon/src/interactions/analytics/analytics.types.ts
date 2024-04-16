import { EmbedViewSource } from 'shared/types';
import { Events, InternalTrackEvents } from 'bento-common/types';

/** Map event type to expected payload */
export interface Payloads {
  [InternalTrackEvents.guideViewingStarted]: GuideViewingEventPayload;
  [InternalTrackEvents.guideViewingEnded]: GuideViewingEventPayload;
  [InternalTrackEvents.stepViewingEnded]: StepViewingEventPayload;
  [InternalTrackEvents.stepViewingStarted]: StepViewingEventPayload;
  [InternalTrackEvents.quickLinkClicked]: QuickLinkClickedPayload;
  [InternalTrackEvents.userFeedback]: UserFeedbackPayload;
  [InternalTrackEvents.audienceEvent]: AudienceEventPayload;
  [InternalTrackEvents.integrationSync]: IntegrationSyncPayload;
  [Events.adminFocused]: BasePayload;
  [Events.analyticsVisited]: BasePayload;
  [Events.emailSent]: NotificationPayload;
  [Events.stepCompleted]: StepCompletedPayload;
  [Events.ctaClicked]: StepCtaClickedPayload;
  [Events.accountUserAppActivity]: BasePayload;
  [Events.savedForLater]: GuideViewingEventPayload;
  [Events.dismissed]: GuideViewingEventPayload;
  [Events.gptEvent]: GptEventPayload;
  [Events.troubleshootEvent]: TroubleshootEventPayload;
  [Events.helpCenterSearched]: BasePayload;
  [Events.troubleshootVisited]: TroubleshootVisitedPayload;
  [Events.templateBootstrapped]: TemplateBootstrapPayload;
  [Events.troubleshootVisited]: TroubleshootVisitedPayload;
}

/* === SUB-TYPES === */

export interface AudienceEventPayload extends BasePayload {
  /** Sub category of event, such as save/edit */
  subEvent: string;
  /** Location where event was performed */
  location?: string;
  audienceEntityId?: string;
  /** Record of entityId: state */
  affectedTemplateEntityIds?: Record<string, string>;
}

export interface IntegrationSyncPayload extends BasePayload {
  integration: string;
  status: any;
}

export interface TroubleshootVisitedPayload extends BasePayload {
  ref: string;
}

export interface UserFeedbackPayload extends BasePayload {
  /** What the feedback is for */
  target: string;
  /** Feedback answer */
  answer: string;
  requestId?: string;
}

export interface TroubleshootEventPayload extends BasePayload {
  event: 'Targeting troubleshooter';
  subEvent: 'User selection' | 'Results';
  requestId?: string;
  payload?: any;
}

/**
 * Event keys focused around guide generation
 */
interface GptGuideGenerationEvent extends BasePayload {
  generateTime?: number;
  numChoice: number;
  transcriptLength?: number;
  method: 'link' | 'articleText' | 'transcript' | 'autoflow';
  templateId?: number;
}

export interface GptEventPayload extends GptGuideGenerationEvent {
  /** A GPT invocation event */
  event: 'Generate request' | 'Snazzy GPT' | 'Targeting GPT';
  /** A sub-step of one of the above major events */
  subEvent?: string;
  requestUser: string;
  /** To track across multiple events */
  requestId?: string;
  /** Generic payload dump since GPT use cases vary */
  payload?: any;
}

export interface TemplateBootstrapPayload extends BasePayload {
  sourceTemplate: number;
  createdTemplate: number;
}

export interface QuickLinkClickedPayload {
  data: {
    title: string;
    url: string;
  };
  accountUserEntityId: string;
  organizationEntityId: string;
}

export interface DraggedPosition {
  x: number;
  y: number;
  windowWidth: number;
  windowHeight: number;
  scrollX: number;
  scrollY: number;
}

export type Handler = <K extends keyof Payloads>(
  eventName: K,
  payload: Payloads[K]
) => void;

/* === PAYLOADS === */
export interface BasePayload {
  accountUserEntityId?: string;
  userEntityId?: string;
  organizationEntityId: string;
}

export interface GuideViewingEventPayload {
  guideEntityId: string;
  data?: {
    viewedFrom?: EmbedViewSource;
  };
  accountUserEntityId: string;
  organizationEntityId: string;
}

export interface StepViewingEventPayload {
  stepEntityId: string;
  viewedFrom?: EmbedViewSource;
  accountUserEntityId: string;
  organizationEntityId: string;
}

export interface StepCompletedPayload {
  accountUserEntityId?: string;
  userEntityId?: string;
  organizationEntityId: string;
  stepEntityId: string;
}

export interface StepCtaClickedPayload extends StepCompletedPayload {
  data?: {
    /** GuideBaseStepCta's entityId */
    ctaEntityId: string;
    ctaText: string;
  };
}

export interface NotificationPayload extends BasePayload {
  organizationEntityId: string;
  accountUserEntityId: string;
  stepEntityId: string;
  guideEntityId: string;
  data: {
    /** Template ID */
    eventId: string;
    /** Type of notification */
    eventName: string;
  };
}
