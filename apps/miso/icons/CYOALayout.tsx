import React from 'react';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';
import { SvgIconProps } from '@mui/material';

const CYOALayoutIcon: React.FC<SvgIconProps> = ({ style, ...props }) => (
  <CallSplitOutlinedIcon style={{ rotate: '90deg', ...style }} {...props} />
);

export default CYOALayoutIcon;
