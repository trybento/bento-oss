import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

import { px } from 'bento-common/utils/dom';

import { CalloutTypes } from 'bento-common/types/slate';
import {
  TYPE_BG_COLOR,
  TYPE_COLOR,
} from './RichTextEditor/extensions/Callout/CalloutElement';

type Props = BoxProps & {
  calloutType?: CalloutTypes;
  withBorder?: boolean;
};

type ShortcutProps = Omit<Props, 'calloutType'>;

export { CalloutTypes } from 'bento-common/types/slate';

export const TipCallout: React.FC<ShortcutProps> = (props) => (
  <CalloutText calloutType={CalloutTypes.Tip} {...props} />
);

export const InfoCallout: React.FC<ShortcutProps> = (props) => (
  <CalloutText calloutType={CalloutTypes.Info} {...props} />
);

export const SuccessCallout: React.FC<ShortcutProps> = (props) => (
  <CalloutText calloutType={CalloutTypes.Success} {...props} />
);

export const WarningCallout: React.FC<ShortcutProps> = (props) => (
  <CalloutText calloutType={CalloutTypes.Warning} {...props} />
);

export const ErrorCallout: React.FC<ShortcutProps> = (props) => (
  <CalloutText calloutType={CalloutTypes.Error} {...props} />
);

const CalloutText: React.FC<Props> = ({
  calloutType = CalloutTypes.Themeless,
  withBorder = true,
  children,
  ...props
}) => {
  return (
    <Box
      mx="0"
      borderRadius="base"
      padding="2"
      pr="8"
      borderLeftWidth={withBorder ? px(5) : 0}
      borderLeftColor={TYPE_COLOR[calloutType]}
      backgroundColor={TYPE_BG_COLOR[calloutType]}
      boxShadow="0px 1px 1px 0px rgba(0, 0, 0, 0.04), 0px 0px 2px 0px rgba(0, 0, 0, 0.08)"
      {...props}
    >
      {children}
    </Box>
  );
};

export default CalloutText;
