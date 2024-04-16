import React from 'react';
import {
  PopoverContent as DefaultPopoverContent,
  PopoverContentProps,
} from '@chakra-ui/react';

const PopoverContent: React.FC<
  React.PropsWithChildren<
    { disableClickPropagation?: boolean } & PopoverContentProps
  >
> = ({ disableClickPropagation, ...props }) => {
  const overridenProps: Partial<PopoverContentProps> = React.useMemo(() => {
    return disableClickPropagation
      ? {
          onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
            props.onClick?.(e);
          },
          cursor: 'default',
        }
      : {};
  }, [disableClickPropagation, props.onClick]);

  return <DefaultPopoverContent {...props} {...overridenProps} />;
};

export default PopoverContent;
