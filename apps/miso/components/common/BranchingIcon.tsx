import React from 'react';
import { Box } from '@chakra-ui/react';

import ShuffleIcon from 'icons/Shuffle';

type Props = {
  style?: React.CSSProperties;
  label?: string;
};

const BranchingIcon: React.FC<Props> = ({ style }) => {
  return (
    <Box display="flex">
      <ShuffleIcon
        style={
          style || {
            width: '15px',
            height: '15px',
            display: 'inline',
            marginLeft: '2px',
            marginTop: 'auto',
            marginBottom: 'auto',
          }
        }
      />
    </Box>
  );
};

export default BranchingIcon;
