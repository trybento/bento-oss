import React from 'react';
import Badge, { BadgeStyle } from 'system/Badge';
import { SplitTestState } from 'bento-common/types';

export const SPLIT_TEST_STATUS_COL_WIDTH = '100px';

type SplitTestStatusProps = {
  state: SplitTestState;
};

const STATE_BADGE_VARIANT: {
  [key in SplitTestState]: BadgeStyle;
} = {
  [SplitTestState.live]: BadgeStyle.active,
  [SplitTestState.draft]: BadgeStyle.inactive,
  [SplitTestState.stopped]: BadgeStyle.warning,
  [SplitTestState.none]: BadgeStyle.inactive,
  [SplitTestState.deleted]: BadgeStyle.error,
};

const BADGE_LABEL: { [key in SplitTestState]: string } = {
  [SplitTestState.live]: 'LIVE',
  [SplitTestState.draft]: 'DRAFT',
  [SplitTestState.stopped]: 'STOPPED',
  [SplitTestState.none]: 'NONE',
  [SplitTestState.deleted]: 'DELETED',
};

const TOOLTIP_LABEL: { [key in SplitTestState]: string } = {
  [SplitTestState.live]:
    'This split test is actively being launched to accounts or users.',
  [SplitTestState.draft]:
    'This split test is not yet launched to any accounts or users.',
  [SplitTestState.stopped]:
    'New users will not get this split test, but existing users will continue to see it.',
  [SplitTestState.none]: '',
  [SplitTestState.deleted]: 'This split test has been deleted.',
};

const SplitTestStatus: React.FC<SplitTestStatusProps> = ({ state }) => {
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

export default SplitTestStatus;
