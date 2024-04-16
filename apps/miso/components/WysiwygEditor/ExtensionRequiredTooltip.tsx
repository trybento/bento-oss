import React from 'react';
import InteractiveTooltip, {
  InteractiveTooltipProps,
} from 'system/InteractiveTooltip';

type Props = Pick<InteractiveTooltipProps, 'withPortal'> & {
  /**
   * Whether to not show the tooltip content (still renders children)
   * @default false
   */
  isDisabled?: boolean;
};

export const ExtensionRequiredTooltipLabel: React.FC = () => {
  return <span>You must first install theBento Chrome extension</span>;
};

const ExtensionRequiredTooltip = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<Props>
>(({ children, isDisabled = false, withPortal }, ref) => {
  if (isDisabled) return <>{children}</>;

  return (
    <InteractiveTooltip
      ref={ref}
      placement="top-end"
      label={<ExtensionRequiredTooltipLabel />}
      withPortal={withPortal}
    >
      <span>{children}</span>
    </InteractiveTooltip>
  );
});

export default ExtensionRequiredTooltip;
