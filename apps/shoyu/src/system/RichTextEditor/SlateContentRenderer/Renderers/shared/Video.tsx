import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import { FormFactorStateKey, Step } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';

import { notifyVideoError } from '../../../../../api';
import { isInline } from '../../../../../lib/formFactors';
import VideoLightbox from './VideoLightbox';
import { videoUrlExists } from 'bento-common/frontend/videoHelpers';
import { getNodeStyle } from '../../helpers';
import withCustomUIContext from '../../../../../hocs/withCustomUIContext';
import withMainStoreData from '../../../../../stores/mainStore/withMainStore';
import {
  guideSelector,
  selectedStepForFormFactorSelector,
} from '../../../../../stores/mainStore/helpers/selectors';
import withFormFactor from '../../../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../../../providers/FormFactorProvider';
import { SlateRendererProps, VideoElement } from 'bento-common/types/slate';
import { pick } from 'bento-common/utils/lodash';
import { Theme, VerticalAlignmentEnum } from 'bento-common/types';
import { isVideoGalleryTheme } from 'bento-common/data/helpers';
import { px } from 'bento-common/utils/dom';

interface VideoNode extends Omit<VideoElement, 'fill'> {
  thumbnailOnly?: boolean;
}

export type VideoWrapperProps = SlateRendererProps & {
  node: VideoNode;
  iFrameSrc: string;
  iFrameSrcLightbox: string;
  /** Need this for checking */
  videoUrl: string;
  videoId: string;
};

type Props = VideoWrapperProps & FormFactorContextValue;

type MainStoreData = {
  step: Step | undefined;
  theme: Theme | undefined;
};

type VideoProps = Props & MainStoreData;

type VideoComponentProps = {
  isLightbox?: boolean;
  isFocused?: boolean;
  handleExpand?: () => void;
  formFactor: FormFactorStateKey;
  iFrameSrc: string;
  iFrameSrcLightbox: string;
  theme: Theme | undefined;
  style?: React.CSSProperties;
  playsInline?: boolean;
};

const DEFAULT_WIDTH_PX = 460;
const DEFAULT_HEIGHT_PX = 260;
const aspectRatio = '16 / 9';

const VideoComponent: React.FC<VideoComponentProps> = ({
  isLightbox,
  isFocused,
  handleExpand,
  formFactor,
  iFrameSrc,
  iFrameSrcLightbox,
  style,
  playsInline,
  theme,
}) => {
  const videoDimensionStyles: React.CSSProperties = useMemo(
    () => ({
      maxHeight: '100%',
      maxWidth: '100%',
      aspectRatio,
      margin: 'auto',
      ...(style && pick(style, ['margin', 'marginLeft', 'marginRight'])),
    }),
    [style]
  );

  return (
    <div
      className={`${isLightbox ? 'bento-lightbox-video' : ''}`}
      style={{
        position: 'relative',
        textAlign: 'center',
        margin: 'auto',
        width: '100%',
        aspectRatio,
        ...(!isLightbox &&
        isInline(formFactor) &&
        // Allow videos to expand without restrictions
        // for VideoGallery.
        !isVideoGalleryTheme(theme)
          ? {
              maxWidth: `min(100%, ${px(DEFAULT_WIDTH_PX)}`,
              maxHeight: `min(100%, ${px(DEFAULT_HEIGHT_PX)}`,
            }
          : {}),
        ...(!isLightbox && style),
      }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: isLightbox ? iFrameSrcLightbox : iFrameSrc,
        }}
        style={videoDimensionStyles}
      />
      {!isFocused &&
        !playsInline && ( // This is inside bento tag, where tailwind is present.
          <div
            onClick={handleExpand}
            className={`
              absolute
              h-full
              w-full
              top-0
              left-0
            `}
          >
            <div
              className={`
                transition
                opacity-0
                hover:opacity-100
                cursor-pointer
                text-center
                text-white
                bg-black
                bg-opacity-30
              `}
              style={videoDimensionStyles}
            />
          </div>
        )}
    </div>
  );
};

const Video: React.FC<VideoProps> = ({
  formFactor,
  step,
  node,
  iFrameSrc,
  iFrameSrcLightbox,
  videoUrl,
  videoId,
  theme,
  options,
}) => {
  const style = getNodeStyle(node, options);

  const isTopAligned =
    !options?.verticalMediaAlignment ||
    options?.verticalMediaAlignment === VerticalAlignmentEnum.top;
  const isBottomAligned =
    options?.verticalMediaAlignment === VerticalAlignmentEnum.bottom;
  const isVerticalCenterAligned =
    options?.verticalMediaAlignment === VerticalAlignmentEnum.center;

  const [isFocused, setIsFocused] = React.useState(false);

  useEffect(() => {
    const testUrl = async () => {
      const success = await videoUrlExists(videoUrl, videoId);
      if (!success && step) {
        // TODO: suppress for previews
        notifyVideoError({
          videoId,
          videoUrl,
          stepEntityId: step.entityId,
        });
      }
    };

    testUrl();
  }, []);

  const handleExpand = () => {
    setIsFocused(true);
  };

  const handleClose = () => {
    setIsFocused(false);
  };

  const videoProps: VideoComponentProps = {
    isFocused,
    handleExpand,
    iFrameSrc,
    iFrameSrcLightbox,
    formFactor,
    theme,
  };

  return (
    <div className={cx({ 'flex h-full': options?.carousel })}>
      {isFocused &&
        ReactDOM.createPortal(
          <VideoLightbox handleClose={handleClose}>
            <VideoComponent isLightbox {...videoProps} />
          </VideoLightbox>,
          document.body
        )}
      <VideoComponent
        {...videoProps}
        style={{
          ...style,
          marginTop:
            isBottomAligned || isVerticalCenterAligned ? 'auto' : undefined,
          marginBottom:
            isTopAligned || isVerticalCenterAligned ? 'auto' : undefined,
        }}
        playsInline={node?.playsInline}
      />
    </div>
  );
};

export default composeComponent<VideoWrapperProps>([
  withCustomUIContext,
  withFormFactor,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => {
    const step = selectedStepForFormFactorSelector(state, formFactor);

    return {
      step,
      theme: guideSelector(step?.guide, state)?.theme,
    };
  }),
])(Video);
