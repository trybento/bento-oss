import React from 'react';
import { Tooltip as BaseTooltip, TooltipProps } from '@chakra-ui/react';
import { usePortalRef } from '../providers/PortalRefProvider';

/**
 * Base styles should be kept in sync with `system/PopoverTip`.
 */
const defaultProps: Partial<TooltipProps> = {
  maxWidth: '200px',
  bgColor: '#000000',
  borderRadius: '6px',
  py: 2,
  px: 3,
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: 'normal',
  color: 'white',
};

/**
 * Wrapper on chakra.Tooltip to provide the Bento style.
 * You can override default styles, but you probably shouldn't.
 */
const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, ...props }, ref) => {
    const portalRef = usePortalRef();

    return (
      <BaseTooltip
        ref={ref}
        {...defaultProps}
        {...props}
        portalProps={{ containerRef: portalRef }}
      >
        {children}
      </BaseTooltip>
    );
  }
);

export default Tooltip;
