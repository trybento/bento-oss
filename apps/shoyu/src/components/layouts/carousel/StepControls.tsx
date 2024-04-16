import React, { useMemo } from 'react';
import cx from 'classnames';
import {
  CtasOrientation,
  InlineContextualGuideStyles,
  StepCtaType,
} from 'bento-common/types';
import {
  guideSelector,
  siblingStepEntityIdsOfStepSelector,
} from '../../../stores/mainStore/helpers/selectors';
import withMainStoreData from '../../../stores/mainStore/withMainStore';
import StepCta from '../../../system/StepCta';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import composeComponent from 'bento-common/hocs/composeComponent';
import withFormFactor from '../../../hocs/withFormFactor';
import CarouselProgress from './CarouselProgress';
import { StepControlsProps } from '../../../lib/guideRenderConfig';
import { buttonToCta } from '../common/StepControls';
import { Guide, StepCTA } from 'bento-common/types/globalShoyuState';
import { getInlineContextPadding } from '../../../lib/helpers';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import withCustomUIContext from '../../../hocs/withCustomUIContext';

type OuterProps = StepControlsProps;

type Props = OuterProps &
  Pick<FormFactorContextValue, 'formFactor' | 'embedFormFactor'> &
  Pick<CustomUIProviderValue, 'inlineContextualStyle'>;

type MainStoreData = {
  guide?: Guide;
  stepEntityIdSiblings: ReturnType<typeof siblingStepEntityIdsOfStepSelector>;
};

const dotsIdx = 1;
export const StepControls: React.FC<Props & MainStoreData> = ({
  formFactor,
  embedFormFactor,
  stepEntityIdSiblings,
  step,
  ctas,
  fullWidth,
  strong,
  orientation,
  guide,
  inlineContextualStyle,
}) => {
  const inlineContextPadding = useMemo(
    () =>
      getInlineContextPadding(
        guide?.formFactorStyle as InlineContextualGuideStyles,
        inlineContextualStyle
      ),
    [guide?.formFactorStyle, inlineContextualStyle]
  );

  const convertedCtas = useMemo(() => {
    return [
      ...ctas.reduce((acc, cta) => {
        const convertedCta =
          cta.type === 'button'
            ? buttonToCta(cta, embedFormFactor)
            : { ...cta };

        /**
         * Itentionally leaving CTAs with empty text
         * to allow types other than "Back" to render
         * on the right side of the navigation dots.
         */
        if (
          convertedCta.type === StepCtaType.back &&
          !stepEntityIdSiblings.previous
        )
          convertedCta.text = '';

        if (
          convertedCta.type === StepCtaType.next &&
          !stepEntityIdSiblings.next
        )
          convertedCta.text = '';

        if (
          convertedCta.text ||
          (!convertedCta.text && orientation === CtasOrientation.spaceBetween)
        )
          acc.push(convertedCta);

        return acc;
      }, [] as StepCTA[]),
    ];
  }, [ctas, step, stepEntityIdSiblings, embedFormFactor, orientation]);

  const ctasBySection = useMemo(() => {
    switch (orientation) {
      case CtasOrientation.left:
        return [convertedCtas, [], []];
      case CtasOrientation.right:
        return [[], [], convertedCtas];
      default:
        return [convertedCtas.slice(0, 1), [], convertedCtas.slice(1)];
    }
  }, [convertedCtas, orientation]);

  if (!step) {
    return null;
  }

  return (
    <div
      className={cx('flex gap-2 justify-between items-center pt-3', {
        'flex-col': fullWidth,
        'w-full': fullWidth,
      })}
      style={{
        paddingLeft: inlineContextPadding?.l,
        paddingRight: inlineContextPadding?.r,
        paddingBottom: inlineContextPadding?.b,
      }}
    >
      {ctasBySection.map((ctaSection, sectionIdx) => {
        return (
          <div
            key={sectionIdx}
            className={cx('bento-step-ctas-wrapper flex-wrap flex gap-4', {
              'flex-1': sectionIdx !== dotsIdx,
              'justify-end': sectionIdx > dotsIdx,
              'flex-none': sectionIdx === dotsIdx,
            })}
          >
            {ctaSection.map((cta, idx) => (
              <StepCta
                key={`cta-${idx}`}
                cta={cta}
                stepEntityId={step?.entityId}
                formFactor={formFactor}
                fullWidth={fullWidth}
                strong={strong}
              />
            ))}
            {sectionIdx === dotsIdx && <CarouselProgress />}
          </div>
        );
      })}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreData<Props, MainStoreData>((state, { step }) => {
    const guide = guideSelector(step?.guide, state);

    return {
      guide,
      stepEntityIdSiblings: siblingStepEntityIdsOfStepSelector(
        state,
        step?.entityId
      ),
    };
  }),
])(StepControls);
