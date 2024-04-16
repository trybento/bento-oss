import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  InlineWidget,
  PopupModal,
  useCalendlyEventListener,
} from 'react-calendly';
import cx from 'classnames';
import { EmbedLinkStyle, LinkElement } from 'bento-common/types/slate';
import { embedNodeToButtonNode } from 'bento-common/utils/embedSlate';
import composeComponent from 'bento-common/hocs/composeComponent';
import { withStopEvent } from 'bento-common/utils/dom';

import Button from '../Button';
import { EmbedLinkComponentProps } from './types';
import Link from '../Link';
import withMainStoreData from '../../../../../stores/mainStore/withMainStore';
import withFormFactor from '../../../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../../../providers/FormFactorProvider';
import { Step, StepState } from 'bento-common/types/globalShoyuState';
import { MainStoreState } from '../../../../../stores/mainStore/types';
import { selectedStepForFormFactorSelector } from '../../../../../stores/mainStore/helpers/selectors';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import { throttle } from 'bento-common/utils/lodash';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';

type OuterProps = EmbedLinkComponentProps<'calendly'>;

type MainStoreData = {
  step: Step | undefined;
  dispatch: MainStoreState['dispatch'];
};

type Props = OuterProps & Pick<FormFactorContextValue, 'formFactor'>;

function CalendlyEmbedComponent({
  node,
  backgroundColor,
  primaryColorHex,
  fontColorHex,
  dispatch,
  step,
  children,
}: React.PropsWithChildren<Props & MainStoreData>) {
  const { url, style } = node;

  const widgetContainer = useRef<HTMLDivElement>(null);

  const buttonNode = useMemo(() => embedNodeToButtonNode(node), [node]);

  const [calendlyOpen, setCalendlyOpen] = useState<boolean>(false);
  const [isNarrow, setIsNarrow] = useState<boolean>(false);

  const onEventScheduled = useCallback(() => {
    if (step) {
      dispatch({
        type: 'stepChanged',
        step: {
          entityId: step.entityId,
          isComplete: true,
          state: StepState.complete,
          completedAt: new Date(),
        },
      });
    }
  }, [step]);

  const onOpenCalendly = useCallback(
    withStopEvent(() => setCalendlyOpen(true)),
    []
  );
  const onCalendlyClose = useCallback(() => setCalendlyOpen(false), []);

  const checkWidgetWidth = useCallbackRef(
    throttle(() => {
      const isNarrowNow = (widgetContainer.current?.clientWidth ?? 650) < 650;
      if (isNarrow !== isNarrowNow) {
        setIsNarrow(isNarrowNow);
      }
    }, 16),
    [isNarrow]
  );

  useCalendlyEventListener({ onEventScheduled });

  useResizeObserver(checkWidgetWidth, { element: widgetContainer.current });

  useEffect(() => {
    checkWidgetWidth();
  }, []);

  const modal = (
    <PopupModal
      open={calendlyOpen}
      utm={{ utmSource: 'bento' }}
      url={url}
      rootElement={document.body}
      pageSettings={{
        hideLandingPageDetails: true,
        hideEventTypeDetails: true,
        hideGdprBanner: true,
        backgroundColor,
        primaryColor: primaryColorHex,
        textColor: fontColorHex,
      }}
      onModalClose={onCalendlyClose}
    />
  );

  switch (style) {
    case EmbedLinkStyle.inline:
      return (
        <div
          className={cx('overflow-hidden', {
            'h-[652px]': !isNarrow,
            'h-[550px]': isNarrow,
          })}
          ref={widgetContainer}
        >
          <div className={cx('relative', { '-top-12': !isNarrow })}>
            <InlineWidget
              url={url}
              utm={{ utmSource: 'bento' }}
              pageSettings={{
                hideLandingPageDetails: true,
                hideEventTypeDetails: true,
                hideGdprBanner: true,
                backgroundColor,
                primaryColor: primaryColorHex,
                textColor: fontColorHex,
              }}
              styles={{ overflow: 'hidden', height: '700px' }}
            />
          </div>
        </div>
      );
    case EmbedLinkStyle.button:
      return (
        <>
          <Button node={buttonNode} onClick={onOpenCalendly} />
          {modal}
        </>
      );
    default:
      return (
        <>
          <Link node={node as unknown as LinkElement} onClick={onOpenCalendly}>
            {children}
          </Link>
          {modal}
        </>
      );
  }
}

export default composeComponent<OuterProps>([
  withFormFactor,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => ({
    step: selectedStepForFormFactorSelector(state, formFactor),
    dispatch: state.dispatch,
  })),
])(CalendlyEmbedComponent);
