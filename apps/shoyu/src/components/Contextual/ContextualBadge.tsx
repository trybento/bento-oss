import React, { useContext } from 'react';
import cx from 'classnames';
import { ContextTagType } from 'bento-common/types/globalShoyuState';

import ContextualDot from './ContextualDot';
import {
  CustomUIContext,
  CustomUIProviderValue,
} from '../../providers/CustomUIProvider';
import { px } from '../../lib/helpers';
import VisualTagIcon from 'bento-common/components/VisualTagIcon';
import withCustomUIContext from '../../hocs/withCustomUIContext';
import { ContextTagDimensionsByType } from 'bento-common/data/helpers';

type OuterProps = {
  type: ContextTagType;
  text: string | undefined;
};

type Props = OuterProps &
  Pick<
    CustomUIProviderValue,
    | 'tagBadgeIconPadding'
    | 'tagBadgeIconBorderRadius'
    | 'tagCustomIconUrl'
    | 'tagPrimaryColor'
    | 'tagLightPrimaryColor'
  >;

const ContextualBadge = React.forwardRef(
  ({ type, text }: OuterProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      tagBadgeIconPadding,
      tagLightPrimaryColor,
      tagPrimaryColor,
      tagTextColor,
      tagBadgeIconBorderRadius,
      tagCustomIconUrl,
    } = useContext(CustomUIContext);

    const { height, padding } = ContextTagDimensionsByType[type];

    const hasIcon = type !== ContextTagType.badge;

    // Prevent CLS while the text is loading.
    if (!text) return null;

    return (
      <div
        className={cx('flex', 'font-semibold', 'text-xs', 'whitespace-nowrap', {
          /** Badge glow: Disabled until it has its own setting. */
          // 'bento-context-animated shimmer': !hasIcon,
        })}
        style={{
          borderRadius: px(tagBadgeIconBorderRadius),
          height: px(height + tagBadgeIconPadding * 2),
          padding: `${px(tagBadgeIconPadding)} ${px(
            tagBadgeIconPadding + padding
          )}`,
          background: hasIcon ? tagLightPrimaryColor : tagPrimaryColor,
          color: hasIcon ? tagPrimaryColor : tagTextColor,
        }}
        ref={ref}
      >
        <div className="flex items-center content-center m-auto fill-current">
          {hasIcon && (
            <div className="mr-1">
              {type === ContextTagType.badgeDot ? (
                <ContextualDot size={6} />
              ) : (
                <VisualTagIcon
                  primaryColor={tagPrimaryColor}
                  bgColor={tagLightPrimaryColor}
                  borderRadius={tagBadgeIconBorderRadius}
                  padding={tagBadgeIconPadding}
                  iconUrl={tagCustomIconUrl}
                />
              )}
            </div>
          )}
          {text}
        </div>
      </div>
    );
  }
);

export default withCustomUIContext<OuterProps, Props>(ContextualBadge);
