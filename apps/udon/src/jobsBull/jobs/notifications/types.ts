import { StepCompletedByType } from 'src/data/models/Step.model';
import { InputWithAnswer } from 'src/graphql/InputStep/types';

export type AddGuideToAccountArgs = {
  accountName: string;
  guideName: string;
  guideUrl: string;
  customerUrl: string;
};

export type NotificationBatchedData_guide = {
  guideUrl: string;
  steps?: {
    completedBy?: string;
    orgUserName?: string;
    stepName: string;
    updatedByAttrs?: { [key: string]: string };
  }[];
};

export interface NotificationBatchedData_accountGuide
  extends NotificationBatchedData_guide {
  accountName: string;
  customerUrl: string;
  guideName: string;
}

export type NotificationBatchedFlatData = {
  primaryContactName?: string;
  accountGuides?: {
    [name: string]: NotificationBatchedData_accountGuide;
  };
};
export interface QueueCompletedNotificationPayload {
  stepEntityId: string;
  completedByType: StepCompletedByType;
  completedByUserId?: number | null;
  completedByAccountUserId?: number;
  updatedByAttributes?: { [key: string]: string };
  updatedByChoice?: string;
  inputsWithAnswers?: InputWithAnswer[];
}

/** The data that would've gone to courier but we queue up instead */
export type StepBatchData = {
  step: { name: string; branchingQuestion?: string };
  guide: { name: string };
  account: { name: string; customerUrl: string };
  accountUser?: { fullName: string };
  orgUser?: { fullName: string };
  primaryContact?: { fullName: string };
  guideUrl: string;
  updatedByAttributes?: { [x: string]: string };
  updatedByChoice?: string;
  inputsWithAnswers?: InputWithAnswer[];
};
