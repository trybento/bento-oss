import React, { useCallback } from 'react';
import {
  forwardRef,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverContentProps,
  PopoverProps,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';

import ConditionalWrap from 'bento-common/components/ConditionalWrap';

export type InteractiveTooltipProps = React.PropsWithChildren<
  PopoverProps &
    PopoverContentProps & {
      label: React.ReactNode;
      /**
       * Whether to use a Portal
       * @see https://chakra-ui.com/docs/components/portal
       * @default true
       */
      withPortal?: boolean;
    }
>;

const defaultProps: Partial<PopoverContentProps> = {
  maxWidth: '200px',
  bgColor: '#000000',
  borderRadius: '6px',
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: 'normal',
  color: 'white',
};

/**
 * Looks like a normal tooltip but allows
 * interaction with its content.
 */
const InteractiveTooltip = forwardRef<InteractiveTooltipProps, 'div'>(
  (
    {
      children,
      label,
      trigger = 'hover',
      placement = 'bottom-start',
      lazyBehavior = 'unmount',
      isLazy,
      withPortal = true,
      ...props
    },
    ref
  ) => {
    const PortalWrapper = useCallback(
      (children: React.ReactNode) => <Portal>{children}</Portal>,
      []
    );

    return (
      <Popover
        trigger={trigger}
        placement={placement}
        isLazy={isLazy}
        lazyBehavior={lazyBehavior}
      >
        <PopoverTrigger>{children}</PopoverTrigger>
        {label && (
          <ConditionalWrap wrap={PortalWrapper} condition={withPortal}>
            <PopoverContent {...props} ref={ref}>
              <PopoverBody>{label}</PopoverBody>
            </PopoverContent>
          </ConditionalWrap>
        )}
      </Popover>
    );
  }
);

InteractiveTooltip.defaultProps = defaultProps;

export default InteractiveTooltip;
