import React from 'react';
import { NpsSurveyState } from 'bento-common/types/netPromoterScore';
import Badge, { BadgeStyle } from 'system/Badge';

export const NPS_SURVEY_STATUS_COL_WIDTH = '100px';

type NpsSurveyStatusProps = {
  state: NpsSurveyState;
};

const STATE_BADGE_VARIANT: {
  [key in NpsSurveyState]: BadgeStyle;
} = {
  [NpsSurveyState.draft]: BadgeStyle.inactive,
  [NpsSurveyState.live]: BadgeStyle.active,
  [NpsSurveyState.stopped]: BadgeStyle.warning,
};

const BADGE_LABEL: { [key in NpsSurveyState]: string } = {
  [NpsSurveyState.draft]: 'DRAFT',
  [NpsSurveyState.live]: 'LIVE',
  [NpsSurveyState.stopped]: 'STOPPED',
};

const TOOLTIP_LABEL: { [key in NpsSurveyState]: string } = {
  [NpsSurveyState.draft]:
    'This survey has not yet been launched to any accounts or users.',
  [NpsSurveyState.live]:
    'This survey is actively being launched to accounts or users.',
  [NpsSurveyState.stopped]:
    'New users will not get this survey, but existing users will continue to see it.',
};

const NpsSurveyStatus: React.FC<NpsSurveyStatusProps> = ({ state }) => {
  if (!state) {
    return null;
  }

  return (
    <Badge
      minWidth="75px"
      label={BADGE_LABEL[state]}
      variant={STATE_BADGE_VARIANT[state]}
      tooltip={TOOLTIP_LABEL[state]}
      iconRight
    />
  );
};

export default NpsSurveyStatus;
