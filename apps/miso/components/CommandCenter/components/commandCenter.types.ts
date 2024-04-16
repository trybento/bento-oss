export enum TroubleshootChoice {
  userNotGettingContent = 'userNotGettingContent',
  willUserGetContent = 'willUserGetContent',
  userGettingWrongContent = 'userGettingWrongContent',
}

export const TROUBLESHOOTER_LABELS: Record<TroubleshootChoice, string> = {
  [TroubleshootChoice.userGettingWrongContent]:
    "User is getting an experience they shouldn't",
  [TroubleshootChoice.userNotGettingContent]:
    'User is not getting an experience',
  [TroubleshootChoice.willUserGetContent]:
    'Check if user will get an experience',
};
