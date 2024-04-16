import React from 'react';
import CircularBadge, { CalloutTypes } from 'system/CircularBadge';
import InteractiveTooltip from 'system/InteractiveTooltip';

export type Props = Exclude<
  React.ComponentProps<typeof InteractiveTooltip>,
  'children'
>;

const ConflictingFlowCtaWarning: React.FC<Props> = (props) => {
  return (
    <InteractiveTooltip {...props}>
      <span className="flex align-middle">
        <CircularBadge calloutType={CalloutTypes.Warning} />
      </span>
    </InteractiveTooltip>
  );
};

export default ConflictingFlowCtaWarning;
