import { NotificationSettings, StepType } from 'bento-common/types';
import { isBranchingStep } from 'bento-common/data/helpers';
import { Step } from 'src/data/models/Step.model';
import { Template } from 'src/data/models/Template.model';

/** Analyze blocklist of notif settings */
export const shouldSendStepNotification = ({
  step,
  notificationSettings,
}: {
  step: Step;
  notificationSettings: NotificationSettings;
}): boolean => {
  if (notificationSettings.disable) return false;

  const { stepType } = step || {};

  if (stepType === StepType.fyi && notificationSettings.info) return false;

  if (isBranchingStep(stepType) && notificationSettings.branching) return false;

  if (stepType === StepType.input && notificationSettings.input) return false;

  if (
    (stepType === StepType.required || stepType === StepType.optional) &&
    notificationSettings.action
  )
    return false;

  return true;
};

export const getDefaultNotificationSettings = (
  template: Template
): NotificationSettings => {
  if (template.isSideQuest) return { disable: true };

  return {
    info: true,
    action: true,
  };
};
