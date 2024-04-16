import React, { forwardRef, useMemo } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import WarningOutlineIcon from 'icons/WarningOutline';
import {
  TYPE_BG_COLOR,
  TYPE_COLOR,
} from 'bento-common/components/RichTextEditor/extensions/Callout/CalloutElement';
import { CalloutTypes, ExtendedCalloutTypes } from 'bento-common/types/slate';
import { withTooltip } from './Badge';
import BusinessIcon from '@mui/icons-material/Business';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';

export { CalloutTypes } from 'bento-common/types/slate';

export const CIRCULAR_BADGE_COL_WIDTH = '30px';
export const CIRCULAR_BADGE_PX_SIZE = '24px';

type CircularBadgeProps = {
  calloutType: CalloutTypes | ExtendedCalloutTypes;
  iconHidden?: boolean;
} & BoxProps;

const CircularBadge = forwardRef(
  (
    {
      calloutType = CalloutTypes.Warning,
      width = CIRCULAR_BADGE_PX_SIZE,
      height = CIRCULAR_BADGE_PX_SIZE,
      iconHidden = false,
      children,
      ...props
    }: CircularBadgeProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const IconStyle = useMemo(() => {
      // Add more icons here as needed.
      switch (calloutType) {
        case ExtendedCalloutTypes.Branching:
          return ShuffleIcon;
        case ExtendedCalloutTypes.Analytics:
          return EqualizerIcon;
        case ExtendedCalloutTypes.AccountGuide:
          return BusinessIcon;
        case ExtendedCalloutTypes.UserGuide:
          return PersonOutlineIcon;
        case ExtendedCalloutTypes.Customized:
          return HistoryEduIcon;
        case ExtendedCalloutTypes.DynamicStepGroup:
          return DynamicFeedOutlinedIcon;
        case ExtendedCalloutTypes.Audience:
          return GroupOutlinedIcon;
        case ExtendedCalloutTypes.Inputs:
          return HowToVoteOutlinedIcon;
        case CalloutTypes.Tip:
          return CheckCircleOutlineIcon;
        default:
          return WarningOutlineIcon;
      }
    }, [calloutType]);

    return (
      <Box
        ref={ref}
        mx="0"
        borderRadius="full"
        padding="1"
        backgroundColor={
          TYPE_BG_COLOR[calloutType] || TYPE_BG_COLOR['themeless']
        }
        color={TYPE_COLOR[calloutType] || TYPE_COLOR['themeless']}
        width={width}
        height={height}
        display="flex"
        {...props}
      >
        {!iconHidden && (
          <IconStyle style={{ margin: 'auto', flex: 1, height: 'auto' }} />
        )}
        {children}
      </Box>
    );
  }
);

export default withTooltip<CircularBadgeProps>(CircularBadge);
