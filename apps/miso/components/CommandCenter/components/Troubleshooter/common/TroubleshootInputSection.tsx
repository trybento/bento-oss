import React from 'react';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';

import Box from 'system/Box';

type Props = React.PropsWithChildren<{
  showArrow?: boolean;
}>;

/**
 * Layout helper for consistent input area cards
 */
const TroubleshootInputSection: React.FC<Props> = ({ showArrow, children }) => {
  return (
    <Box display="flex" w="full">
      <Box
        transform="scaleX(-1)"
        w="8"
        display="flex"
        justifyContent="flex-end"
      >
        {showArrow && <KeyboardReturnOutlinedIcon />}
      </Box>
      <Box flexGrow="1">{children}</Box>
    </Box>
  );
};

export default TroubleshootInputSection;
