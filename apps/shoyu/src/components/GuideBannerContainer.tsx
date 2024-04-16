import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { CtasOrientation, EmbedFormFactor } from 'bento-common/types';
import {
  BannerGuide,
  GuideEntityId,
  Step,
  StepState,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import Banner from 'bento-common/components/Banner';
import { isPreviewContent } from 'bento-common/utils/previews';
import { isBannerGuide } from 'bento-common/utils/formFactor';
import { ANNOUNCEMENT_ANIMATION_TIME_TAKEN } from 'bento-common/frontend/constants';

import {
  firstStepOfGuideSelector,
  formFactorGuidesSelector,
} from '../stores/mainStore/helpers/selectors';
import {
  CustomUIContext,
  CustomUIProviderValue,
} from '../providers/CustomUIProvider';
import useGuideViews from '../stores/mainStore/hooks/useGuideViews';
import useSelectGuideAndStep from '../stores/mainStore/hooks/useSelectGuideAndStep';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { MainStoreState } from '../stores/mainStore/types';
import withSidebarContext from '../hocs/withSidebarContext';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import withCustomUIContext from '../hocs/withCustomUIContext';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import useVisibilityExposure from '../hooks/useVisibilityExposure';
import SlateContentRenderer from '../system/RichTextEditor/SlateContentRenderer';
import StepCta from '../system/StepCta';
import { BANNER_Z_INDEX } from '../lib/constants';
import useAirTrafficJourney from '../stores/airTrafficStore/hooks/useAirTrafficJourney';
import withAirTrafficState from '../stores/airTrafficStore/withAirTrafficState';
import { guidesToShowSelector } from '../stores/airTrafficStore/helpers/selectors';
import { AirTrafficStore } from '../stores/airTrafficStore/types';

type OuterProps = {
  containerEl: HTMLElement | null;
};

type AirTrafficData = {
  airTrafficRegister: AirTrafficStore['register'];
  guidesToShow: GuideEntityId[];
};

type BeforeAirTrafficDataProps = OuterProps &
  FormFactorContextValue &
  CustomUIProviderValue &
  WithLocationPassedProps &
  SidebarProviderValue;

type BeforeMainStoreDataProps = OuterProps &
  AirTrafficData &
  BeforeAirTrafficDataProps;

type MainStoreData = {
  guide?: BannerGuide;
  step?: Step;
  dispatch: MainStoreState['dispatch'];
};

type Props = BeforeMainStoreDataProps & MainStoreData;

const GuideBannerContainer: React.FC<Props> = (
  {
    containerEl,
    guide,
    step,
    formFactor,
    dispatch,
    bannersStyle,
    airTrafficRegister,
  },
  _ref: React.Ref<HTMLDivElement>
) => {
  const { primaryColorHex } = useContext(CustomUIContext);

  /**
   * Whether the modal can be dismissed based on its settings.
   */
  const isDismissible = !!guide?.formFactorStyle?.canDismiss;

  /**
   * Keeps a record of the previously rendered guide to support the following:
   * - register within atc when guides are shown or hidden
   * - end current journey once visibility changes (i.e. banner gets dismissed)
   */
  const prevGuideEntityId = useRef<GuideEntityId | undefined>(undefined);

  /**
   * Internal visibility state used to handle visibility change without short-circuiting
   * animations. This state is usually flipped before store state is mutated.
   */
  const [isOpen, setIsOpen] = useState(true);

  const { endJourney } = useAirTrafficJourney({
    selectedGuideEntityId: step?.guide,
  });

  const handleDismiss = useCallback(() => {
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
  }, [dispatch, step?.entityId, isDismissible, formFactor]);

  const styles = useMemo(() => {
    return {
      bgColor: guide?.formFactorStyle?.backgroundColor || primaryColorHex,
      textColor: guide?.formFactorStyle?.textColor || '#FFFFFF',
      ctasOrientation: guide?.formFactorStyle?.ctasOrientation,
    };
  }, [guide?.formFactorStyle, primaryColorHex]);

  const Content = useMemo(() => {
    if (!step) return null;

    return (
      <>
        {/* Content */}
        <div
          className={cx('bento-banner-step my-auto w-0 flex-1 flex', {
            'flex-col gap-4': styles.ctasOrientation !== CtasOrientation.inline,
            'gap-8': styles.ctasOrientation === CtasOrientation.inline,
          })}
        >
          <div
            className={cx('text-white leading-5', {
              'self-center': styles.ctasOrientation === CtasOrientation.inline,
            })}
            style={{
              color: styles.textColor,
              // @ts-ignore
              '--bento-link-color': styles.textColor,
            }}
          >
            <SlateContentRenderer
              body={step.bodySlate || []}
              options={{ formFactor }}
            />
          </div>
          {(step.ctas || []).length > 0 && (
            <div
              className={cx('flex shrink-0 items-center', {
                'justify-end': styles.ctasOrientation === CtasOrientation.right,
              })}
              style={{ gridGap: '16px' }}
            >
              {step.ctas!.map((cta) => (
                <StepCta
                  key={cta.text}
                  stepEntityId={step.entityId}
                  formFactor={formFactor}
                  cta={cta}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }, [step?.entityId, step?.bodySlate, step?.ctas, styles]);

  useEffect(() => {
    if (isOpen && step) {
      airTrafficRegister({
        guide: step.guide,
        shown: true,
      });

      if (prevGuideEntityId.current !== step.guide) {
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

        // ends the journey after banner is completely hidden
        endJourney({ reason: { dismissSelection: true } });

        // to allow re-opening another banner in the future
        setTimeout(
          () => setIsOpen(true),
          100 // prevents re-rendering before ATC is re-computed
        );
      }, ANNOUNCEMENT_ANIMATION_TIME_TAKEN);
    }
  }, [isOpen]);

  useSelectGuideAndStep(dispatch, formFactor, guide?.entityId, step?.entityId);

  const shouldRender =
    !!guide?.formFactorStyle && !!step?.entityId && !!containerEl;

  useGuideViews(formFactor, shouldRender && isOpen);

  useVisibilityExposure({
    visible: shouldRender && isOpen,
    component: EmbedFormFactor.banner,
  });

  if (!shouldRender) return null;

  return (
    <Banner
      containerEl={containerEl}
      display={guide.formFactorStyle!.bannerType}
      isOpen={isOpen}
      onDismiss={guide.formFactorStyle!.canDismiss ? handleDismiss : undefined}
      placement={guide.formFactorStyle!.bannerPosition}
      styles={{
        bgColor: guide.formFactorStyle!.backgroundColor || primaryColorHex,
        textColor: guide.formFactorStyle!.textColor || '#FFFFFF',
        ...bannersStyle,
      }}
      zIndex={BANNER_Z_INDEX}
    >
      {Content}
    </Banner>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withLocation,
  withSidebarContext,
  withAirTrafficState<BeforeAirTrafficDataProps, AirTrafficData>(
    (state, { embedFormFactor }): AirTrafficData => ({
      airTrafficRegister: state.register,
      guidesToShow: guidesToShowSelector(
        state,
        embedFormFactor // actual embed form factor (not rendered or preview ids)
      ),
    })
  ),
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (
      state,
      { formFactor, guidesToShow, isPreviewFormFactor }
    ): MainStoreData => {
      /**
       * This is what guarantees we wont ever show guides not allowed to show or guides that belong
       * to a different form factor (incl. preview form factors).
       *
       * @todo convert into self-contained selector and unit test it
       */
      const guide = formFactorGuidesSelector<BannerGuide>(
        state,
        formFactor
      ).find(
        (g) =>
          isBannerGuide(g.formFactor) &&
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
])(GuideBannerContainer);
