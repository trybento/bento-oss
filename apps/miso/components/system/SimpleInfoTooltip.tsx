import React, { useCallback, useMemo } from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { TooltipProps } from '@chakra-ui/react';
import InteractiveTooltip from './InteractiveTooltip';

// TODO: Support styles props
interface Props extends Pick<TooltipProps, 'placement' | 'onClick'> {
  label: React.ReactNode;
}

/**
 * Simple (i) with rollover tooltip.
 * Default click is disabled to prevent the tooltip
 * clicks from affecting the parent where it lives.
 * Pass null or a fn for onClick to disable that.
 */
const SimpleInfoTooltip = React.forwardRef<HTMLElement, Props>(
  ({ onClick, ...props }: Props, ref: any) => {
    const isClickDisabled = useMemo(() => onClick === undefined, [onClick]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isClickDisabled) e.preventDefault();
        else onClick?.(e);
      },
      [isClickDisabled]
    );

    return (
      <InteractiveTooltip
        placement={props.placement || 'top-start'}
        onClick={handleClick}
        cursor={isClickDisabled ? 'default' : undefined}
        {...props}
      >
        <InfoOutlined fontSize="inherit" />
      </InteractiveTooltip>
    );
  }
);

export default SimpleInfoTooltip;
