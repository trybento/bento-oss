import React from 'react';
import { ContextTagType } from 'bento-common/types/globalShoyuState';
import VisualTagIcon from 'bento-common/components/VisualTagIcon';

import withCustomUIContext from '../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../providers/CustomUIProvider';
import { ContextTagDimensionsByType } from 'bento-common/data/helpers';

type Props = Pick<
  CustomUIProviderValue,
  | 'tagPrimaryColor'
  | 'tagLightPrimaryColor'
  | 'tagBadgeIconBorderRadius'
  | 'tagBadgeIconPadding'
  | 'tagCustomIconUrl'
>;

export const ContextualIcon = React.forwardRef(
  (
    {
      tagPrimaryColor,
      tagLightPrimaryColor,
      tagBadgeIconBorderRadius,
      tagBadgeIconPadding,
      tagCustomIconUrl,
    }: React.PropsWithChildren<Props>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { width, height } = ContextTagDimensionsByType[ContextTagType.icon];

    return (
      <VisualTagIcon
        primaryColor={tagPrimaryColor}
        bgColor={tagLightPrimaryColor}
        borderRadius={tagBadgeIconBorderRadius}
        padding={tagBadgeIconPadding}
        iconUrl={tagCustomIconUrl}
        width={width}
        height={height}
        ref={ref}
      />
    );
  }
);

export default withCustomUIContext<{}, Props>(ContextualIcon);
