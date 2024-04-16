import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Tooltip, { Place } from 'react-tooltip';
import cx from 'classnames';
import { colord } from 'colord';
import { pick } from 'bento-common/utils/lodash';
import {
  GuideEntityId,
  Step,
  StepEntityId,
  StepState,
  ModalGuide,
  StepCTA,
} from 'bento-common/types/globalShoyuState';
import {
  AlignmentEnum,
  AnnouncementShadow,
  CtasOrientation,
  EmbedFormFactor,
  MediaOrientation,
  ModalPosition,
  ModalSize,
  ModalStyle,
  Theme,
} from 'bento-common/types';
import { isInputStep } from 'bento-common/data/helpers';
import composeComponent from 'bento-common/hocs/composeComponent';
import { stopEvent } from 'bento-common/utils/dom';
import { isEmptyBody } from 'bento-common/utils/bodySlate';
import { isPreviewContent } from 'bento-common/utils/previews';
import { isModalGuide } from 'bento-common/utils/formFactor';
import { ANNOUNCEMENT_ANIMATION_TIME_TAKEN } from 'bento-common/frontend/constants';

import withCustomUIContext from '../hocs/withCustomUIContext';
import { px } from '../lib/helpers';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import SlateContentRenderer from '../system/RichTextEditor/SlateContentRenderer';
import { MODAL_Z_INDEX } from '../lib/constants';
import {
  firstStepOfGuideSelector,
  formFactorGuidesSelector,
} from '../stores/mainStore/helpers/selectors';
import { MainStoreState } from '../stores/mainStore/types';
import useGuideViews from '../stores/mainStore/hooks/useGuideViews';
import useSelectGuideAndStep from '../stores/mainStore/hooks/useSelectGuideAndStep';
import withMainStoreData from '../stores/mainStore/withMainStore';
import StepCta from '../system/StepCta';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import CloseButton from './CloseButton';
import InputFields from './InputFields';
import ExtractedRichContent from './layouts/common/ExtractedRichContent';
import { extractRichContent } from '../lib/richContent';
import { StepCTAPosition } from '../../types/global';
import useVisibilityExposure from '../hooks/useVisibilityExposure';
import withAirTrafficState from '../stores/airTrafficStore/withAirTrafficState';
import { AirTrafficStore } from '../stores/airTrafficStore/types';
import { guidesToShowSelector } from '../stores/airTrafficStore/helpers/selectors';
import useAirTrafficJourney from '../stores/airTrafficStore/hooks/useAirTrafficJourney';

type OuterProps = {};

type MainStoreData = {
  guide?: ModalGuide;
  step?: Step;
  dispatch: MainStoreState['dispatch'];
};

type CustomUIProps = Pick<
  CustomUIProviderValue,
  'paragraphFontSize' | 'paragraphLineHeight' | 'modalsStyle' | 'fontColorHex'
>;

type BeforeAirTrafficStoreDataProps = OuterProps &
  CustomUIProps &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'isPreviewFormFactor' | 'embedFormFactor'
  >;

type AirTrafficData = {
  guidesToShow: GuideEntityId[];
  airTrafficRegister: AirTrafficStore['register'];
};

type BeforeMainStoreDataProps = BeforeAirTrafficStoreDataProps & AirTrafficData;

type ModalContainerProps = BeforeMainStoreDataProps & MainStoreData;

export type ModalComponentProps = {
  ctas: StepCTA[];
  onDismiss: (_e: any, method?: DismissMethod) => void;
  isOpen: boolean | Date;
  textColor?: string;
  dismissible: boolean;
  modalSize: ModalSize | undefined;
  position: ModalPosition;
  onBackgroundClick: () => void | undefined;
  formFactor: string;
  isSaved: boolean;
  formFactorStyle?: ModalStyle;
  stepEntityId?: StepEntityId;
  step: Step;
} & CustomUIProps;

export type OverlayWrapperProps = Pick<
  ModalComponentProps,
  | 'isOpen'
  | 'position'
  | 'onBackgroundClick'
  | 'formFactorStyle'
  | 'modalsStyle'
>;

enum DismissMethod {
  esc = 'esc_key',
  background = 'background_clicked',
  x = 'x_clicked',
}

const EMBED_FORM_FACTOR = EmbedFormFactor.modal;

const CONTENT_CTAS_GAP = 12;

const EXTRACTED_MEDIA_GAP = 24;

export const OverlayWrapper: React.FC<
  React.PropsWithChildren<OverlayWrapperProps>
> = ({
  children,
  isOpen,
  position,
  formFactorStyle,
  modalsStyle,
  onBackgroundClick,
}) => {
  const [withOverlay, overlayBackgroundColor] = useMemo(() => {
    return [
      !!formFactorStyle?.hasBackgroundOverlay,
      formFactorStyle?.hasBackgroundOverlay
        ? colord(modalsStyle.backgroundOverlayColor)
            .alpha(modalsStyle.backgroundOverlayOpacity / 100.0)
            .toRgbString()
        : undefined,
    ];
  }, [modalsStyle, formFactorStyle?.hasBackgroundOverlay]);

  /**
   * Modals without an overlay shouldn't block the user from interacting with the rest of the page,
   * and shouldn't capture the `click` event to dismiss the modal.
   */
  if (!withOverlay) {
    return (
      <div
        className={cx(
          'bento-modal',
          'absolute',
          'overflow-hidden',
          'h-fit',
          'w-fit',
          'max-w-full',
          'flex',
          {
            'm-auto inset-0': position === ModalPosition.center,
            'left-0 top-0': position === ModalPosition.topLeft,
            'top-0 right-0': position === ModalPosition.topRight,
            'bottom-0 left-0': position === ModalPosition.bottomLeft,
            'bottom-0 right-0': position === ModalPosition.bottomRight,
          }
        )}
        style={{
          zIndex: MODAL_Z_INDEX,
          maxHeight: 'min(90%, 90dvh)',
        }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cx(
        'bento-modal',
        'fixed',
        'inset-0',
        'overflow-hidden',
        'h-full',
        'w-full',
        'flex',
        'transition-opacity',
        `duration-${ANNOUNCEMENT_ANIMATION_TIME_TAKEN}`,
        {
          'opacity-0': !isOpen,
          'opacity-100': isOpen,
          'items-center justify-center': position === ModalPosition.center,
          'items-start justify-start': position === ModalPosition.topLeft,
          'items-start justify-end': position === ModalPosition.topRight,
          'items-end justify-start': position === ModalPosition.bottomLeft,
          'items-end justify-end': position === ModalPosition.bottomRight,
        }
      )}
      style={{
        zIndex: MODAL_Z_INDEX,
        background: overlayBackgroundColor,
      }}
      role="dialog"
      aria-modal="true"
      onClick={onBackgroundClick}
    >
      {children}
    </div>
  );
};

export const ModalComponent: React.FC<ModalComponentProps> = ({
  isOpen,
  position,
  ctas,
  fontColorHex,
  onBackgroundClick,
  formFactorStyle,
  onDismiss,
  modalSize,
  dismissible,
  formFactor,
  isSaved,
  paragraphLineHeight,
  paragraphFontSize,
  step,
  stepEntityId,
  modalsStyle,
}) => {
  const isLeftOriented =
    formFactorStyle?.mediaOrientation === MediaOrientation.Left;

  const {
    sanitizedStepBody,
    extractedNodes,
    allowMarginlessImages,
    hasExtractedNodes,
    edgeToEdgePositions,
  } = useMemo(() => {
    const richContentData = extractRichContent(
      EMBED_FORM_FACTOR,
      Theme.nested,
      formFactorStyle?.stepBodyOrientation!,
      formFactorStyle?.verticalMediaOrientation,
      StepCTAPosition.bottom,
      step
    );
    const bodySlate = richContentData.sanitizedStepBody || [];

    return {
      ...richContentData,
      sanitizedStepBody: bodySlate,
      isEmpty: isEmptyBody(bodySlate),
    };
  }, [step, formFactorStyle]);

  const width = useMemo(() => {
    switch (modalSize) {
      case ModalSize.medium:
        return 560;
      case ModalSize.small:
        return 480;
      case ModalSize.large:
      default:
        return 640;
    }
  }, [modalSize]);

  const [tooltipPosition, tooltipOffset] = useMemo<[Place, number]>(() => {
    switch (position) {
      case ModalPosition.topLeft:
        return ['right', 12];
      case ModalPosition.topRight:
        return ['left', 8];

      case ModalPosition.bottomLeft:
      case ModalPosition.bottomRight:
      case ModalPosition.center:
      default:
        return ['top', 12];
    }
  }, [position]);

  const slateOptions = useMemo(
    () => ({
      formFactor: EMBED_FORM_FACTOR,
      allowExpand: { image: true },
      maxDimensions: { image: { height: '40vh' } },
      alignment: {
        h1: AlignmentEnum.center,
        h2: AlignmentEnum.center,
      },
      allowMarginlessImages: true,
      horizontalMediaAlignment: formFactorStyle?.horizontalMediaAlignment,
    }),
    [formFactorStyle]
  );

  const paddingsPx = useMemo(
    () => ({
      y: px(modalsStyle.paddingY),
      x: px(modalsStyle.paddingX),
    }),
    [modalsStyle]
  );

  const contentPaddings = useMemo(
    () => ({
      r:
        hasExtractedNodes && !isLeftOriented
          ? EXTRACTED_MEDIA_GAP
          : modalsStyle.paddingX,
      l:
        hasExtractedNodes && isLeftOriented
          ? EXTRACTED_MEDIA_GAP
          : modalsStyle.paddingX,
    }),
    [hasExtractedNodes, isLeftOriented, modalsStyle]
  );

  return (
    <OverlayWrapper
      isOpen={isOpen}
      position={position}
      formFactorStyle={formFactorStyle}
      modalsStyle={modalsStyle}
      onBackgroundClick={onBackgroundClick}
    >
      <div
        className={cx(
          'overflow-hidden',
          'bg-white',
          'text-left',
          'transition-all',
          `duration-${ANNOUNCEMENT_ANIMATION_TIME_TAKEN}`,
          'm-1',
          'h-auto',
          'max-w-screen-md',
          'flex',
          'relative',
          {
            'shadow-xl': modalsStyle.shadow === AnnouncementShadow.standard,
            'flex-row-reverse': isLeftOriented,
          }
        )}
        style={{
          maxHeight: 'min(90%, 90dvh)',
          width: px(width),
          backgroundColor: formFactorStyle?.backgroundColor,
          color: formFactorStyle?.textColor,
          borderRadius: px(modalsStyle.borderRadius),
          ...(!isOpen && isSaved
            ? { transform: 'scale(30%) translate(180vw)' }
            : {}),
        }}
        onClick={stopEvent}
      >
        <div className={cx('w-full', 'flex', 'flex-col')}>
          <div
            className={cx(
              'overflow-auto',
              'bento-modal-content',
              'flex',
              'gap-4',
              'w-full',
              'h-full',
              {
                'flex-row-reverse': isLeftOriented,
              }
            )}
            style={{
              fontSize: px(paragraphFontSize),
              lineHeight: px(paragraphLineHeight),
            }}
          >
            <div
              className={cx('grow h-full')}
              style={{
                paddingTop: edgeToEdgePositions.first
                  ? undefined
                  : paddingsPx.y,
                paddingBottom: edgeToEdgePositions.last
                  ? undefined
                  : ctas.length > 0
                  ? px(CONTENT_CTAS_GAP)
                  : paddingsPx.y,
              }}
            >
              <SlateContentRenderer
                body={sanitizedStepBody}
                options={slateOptions}
                spacing={{
                  rPadding: contentPaddings.r,
                  lPadding: contentPaddings.l,
                }}
              />
            </div>
          </div>
          {isInputStep(step?.stepType) && (
            <div className="mb-4" style={{ padding: `0 ${paddingsPx.x}` }}>
              <InputFields step={step} />
            </div>
          )}
          {ctas.length > 0 && (
            <div
              className={cx(
                'bento-step-ctas-wrapper',
                'flex',
                'align-middle',
                'gap-4',
                {
                  'justify-end':
                    formFactorStyle?.ctasOrientation === CtasOrientation.right,
                  'justify-between':
                    formFactorStyle?.ctasOrientation ===
                    CtasOrientation.spaceBetween,
                }
              )}
              style={{
                paddingRight: contentPaddings.r,
                paddingLeft: contentPaddings.l,
                paddingTop: paddingsPx.y,
                paddingBottom: paddingsPx.y,
              }}
            >
              {ctas.map((cta, idx) => (
                <StepCta
                  key={`cta-${idx}`}
                  stepEntityId={stepEntityId}
                  cta={cta}
                  formFactor={formFactor}
                />
              ))}
            </div>
          )}
        </div>

        {hasExtractedNodes && (
          <div
            className={cx('shrink-0 align-self-start')}
            style={{
              width: formFactorStyle?.imageWidth,
              maxWidth: `calc(50% - ${paddingsPx.x})`,
              paddingTop: edgeToEdgePositions.horizontal
                ? undefined
                : paddingsPx.y,
              paddingBottom: edgeToEdgePositions.horizontal
                ? undefined
                : paddingsPx.y,
              paddingLeft:
                isLeftOriented && !edgeToEdgePositions.horizontal
                  ? paddingsPx.x
                  : undefined,
              paddingRight:
                !isLeftOriented && !edgeToEdgePositions.horizontal
                  ? paddingsPx.x
                  : undefined,
            }}
          >
            <ExtractedRichContent
              extractedNodes={extractedNodes}
              allowMarginless={allowMarginlessImages}
              {...pick(formFactorStyle || ({} as ModalStyle), [
                'mediaOrientation',
                'verticalMediaAlignment',
                'horizontalMediaAlignment',
                'mediaFontSize',
                'mediaTextColor',
              ])}
            />
          </div>
        )}
        {dismissible && (
          <CloseButton
            color={fontColorHex}
            withBackground={
              edgeToEdgePositions.first ||
              (edgeToEdgePositions.horizontal && !isLeftOriented)
            }
            onDismiss={onDismiss}
            data-for="closeModalTooltip"
            data-tip="Close"
            data-test-id="modal-close-btn"
          />
        )}
      </div>
      {dismissible && (
        // @ts-ignore
        <Tooltip
          id="closeModalTooltip"
          effect="solid"
          place={tooltipPosition}
          delayShow={500}
          offset={{ [tooltipPosition]: tooltipOffset }}
          className="toggle-tooltip"
        />
      )}
    </OverlayWrapper>
  );
};

const ModalContainer: React.FC<ModalContainerProps> = ({
  guide,
  step,
  dispatch,
  formFactor,
  airTrafficRegister,
  ...rest
}) => {
  /**
   * Whether the modal can be dismissed based on its settings.
   */
  const isDismissible = !!guide?.formFactorStyle?.canDismiss;

  /**
   * Keeps a record of the previously rendered guide to support the following:
   * - register within atc when guides are shown or hidden
   * - register new guide as seen for throttling purposes
   * - end current journey once visibility changes (i.e. modal gets dismissed)
   */
  const prevGuideEntityId = useRef<GuideEntityId | undefined>(undefined);

  /**
   * Internal visibility state used to handle visibility change without short-circuiting
   * animations. This state is usually flipped before store state is mutated.
   */
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { endJourney } = useAirTrafficJourney({
    selectedGuideEntityId: step?.guide,
  });

  const handleDismiss = useCallback(
    (_e, _method: DismissMethod = DismissMethod.x) => {
      if (!isDismissible) return;

      if (step) {
        dispatch({
          type: 'stepChanged',
          step: {
            entityId: step.entityId,
            state: StepState.skipped,
          },
        });
      }

      setIsOpen(false);
    },
    [dispatch, step, isDismissible]
  );

  const handleEsc = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        void handleDismiss(undefined, DismissMethod.esc);
      }
    },
    [handleDismiss]
  );

  const handleBackgroundDismiss = useCallback(() => {
    handleDismiss(undefined, DismissMethod.background);
  }, [handleDismiss]);

  const position = useMemo<ModalPosition>(
    () => guide?.formFactorStyle?.position || ModalPosition.center,
    [guide?.formFactorStyle?.position]
  );

  useEffect(() => {
    document.body?.addEventListener('keydown', handleEsc);
    return () => {
      document.body?.removeEventListener('keydown', handleEsc);
    };
  }, [handleEsc, document.body]);

  /**
   * Keeps a record to when the modal was initially saved at,
   * which is then used to hide the modal after the user clicked into the "save for later" CTA,
   * allowing the modal to perform its going away animation.
   *
   * Later on, we will use this to set the modal as NOT open.
   */
  const initiallySavedAt = useMemo(() => guide?.savedAt, [guide?.entityId]);

  useEffect(() => {
    if (isOpen && initiallySavedAt?.getTime() !== guide?.savedAt?.getTime()) {
      setIsOpen(false);
    }
  }, [guide?.savedAt]);

  /**
   * If the current guide that we're showing is different than previous,
   * then we want to mark that the user has seen it for the purposes of throttling.
   *
   * ATC seen registered here to avoid any competing animations/conditions
   */
  useEffect(() => {
    if (isOpen && step) {
      airTrafficRegister({
        guide: step.guide,
        shown: true,
      });

      if (prevGuideEntityId.current !== step.guide) {
        dispatch({
          type: 'modalSeen',
          guide: step.guide,
        });

        prevGuideEntityId.current = step.guide;
      }
    }
  }, [
    step?.entityId, // in case the current step changes
    isOpen, // in case visibility changes
  ]);

  /**
   * When visibility is changed to hide the modal, this will
   * set a timeout to clear the modal selection.
   *
   * This is needed to not short-circuit the "going away" animation.
   */
  useEffect(() => {
    if (!isOpen && prevGuideEntityId.current) {
      setTimeout(() => {
        airTrafficRegister({
          guide: prevGuideEntityId.current!,
          shown: false,
        });

        // ends the journey after modal is completely hidden
        endJourney({ reason: { dismissSelection: true } });

        // to allow re-opening another modal in the future
        setTimeout(
          () => setIsOpen(true),
          100 // prevents re-rendering before ATC is re-computed
        );
      }, ANNOUNCEMENT_ANIMATION_TIME_TAKEN);
    }
  }, [isOpen]);

  useSelectGuideAndStep(dispatch, formFactor, guide?.entityId, step?.entityId);

  const shouldRender = !!step?.entityId;

  useGuideViews(formFactor, shouldRender && isOpen);

  useVisibilityExposure({
    visible: shouldRender && isOpen,
    component: EmbedFormFactor.modal,
  });

  if (!shouldRender) return null;

  return (
    <ModalComponent
      isOpen={isOpen}
      position={position}
      onBackgroundClick={handleBackgroundDismiss}
      onDismiss={handleDismiss}
      modalSize={guide?.formFactorStyle?.modalSize}
      formFactor={formFactor}
      stepEntityId={step.entityId}
      ctas={step.ctas || []}
      formFactorStyle={guide?.formFactorStyle as ModalStyle}
      dismissible={isDismissible}
      isSaved={!!guide?.savedAt}
      step={step}
      {...rest}
    />
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withAirTrafficState<BeforeAirTrafficStoreDataProps, AirTrafficData>(
    (state, { embedFormFactor }): AirTrafficData => ({
      airTrafficRegister: state.register,
      guidesToShow: guidesToShowSelector(
        state,
        embedFormFactor // actual embed form factor (not rendered or preview ids)
      ),
    })
  ),
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { guidesToShow, formFactor, isPreviewFormFactor }) => {
      /**
       * This is what guarantees we wont ever show guides not allowed to show or guides that belong
       * to a different form factor (incl. preview form factors).
       *
       * @todo convert into self-contained selector and unit test it
       */
      const guide = formFactorGuidesSelector<ModalGuide>(
        state,
        formFactor // can be a preview id
      ).find(
        (g) =>
          isModalGuide(g.formFactor) &&
          isPreviewContent(g) === isPreviewFormFactor &&
          guidesToShow.includes(g.entityId)
      );

      return {
        guide,
        step: firstStepOfGuideSelector(state, guide?.entityId),
        dispatch: state.dispatch,
      };
    }
  ),
])(ModalContainer);
