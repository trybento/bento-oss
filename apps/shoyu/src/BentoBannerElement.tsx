import React, { useState } from 'react';
import { EmbedFormFactor } from 'bento-common/types';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { debounce } from 'bento-common/utils/lodash';
import useDomObserver from 'bento-common/hooks/useDomObserver';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';

import NpsSurveyProvider from './providers/NpsSurveyProvider';
import CommonComponentProviders, {
  WebComponentProps,
} from './components/CommonComponentProviders';
import GuideBannerContainer from './components/GuideBannerContainer';
import NpsBannerContainer from './components/NpsBannerContainer';

type OuterProps = WebComponentProps & {
  /**
   * CSS selector pointing to the outermost container to which apply the margin necessary
   * to handle "inline" banners.
   *
   * Only used by previews to not affect a specific container instead of the document.body.
   *
   * @default undefined
   */
  container?: string;
};

const BentoBannerElement: React.FC<OuterProps> = ({
  container,
  uipreviewid,
}) => {
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);

  const updateContainerEl = useCallbackRef(
    debounce(
      () =>
        setContainerEl(
          container
            ? (document.querySelector(container) as HTMLElement | null)
            : document.body
        ),
      100,
      { maxWait: 200 }
    ),
    [container],
    { callOnDepsChange: true }
  );

  useDomObserver(updateContainerEl, {
    disabled: !container,
  });

  useResizeObserver(updateContainerEl, { disabled: !container });

  return (
    <CommonComponentProviders
      formFactor={EmbedFormFactor.banner}
      uipreviewid={uipreviewid}
      isSideQuest
    >
      {/* For guides */}
      <GuideBannerContainer containerEl={containerEl} />
      {/* For surveys */}
      <NpsSurveyProvider>
        <NpsBannerContainer containerEl={containerEl} />
      </NpsSurveyProvider>
    </CommonComponentProviders>
  );
};

export default BentoBannerElement;
