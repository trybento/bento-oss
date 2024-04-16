import React, { useMemo } from 'react';
import cx from 'classnames';
import { Step, StepCTA } from 'bento-common/types/globalShoyuState';
import {
  StepType,
  StepCtaType,
  StepCtaStyle,
  Theme,
  EmbedFormFactor,
  GuideFormFactor,
  GuideTypeEnum,
  CtasOrientation,
  FormFactorStyle,
  ChecklistStyle,
} from 'bento-common/types';
import {
  getDefaultCtaSetting,
  getGuideThemeFlags,
  isBranchingStep,
  isRequiredInputStep,
} from 'bento-common/data/helpers';
import { px } from 'bento-common/utils/dom';
import { ButtonElement } from 'bento-common/types/slate';
import composeComponent from 'bento-common/hocs/composeComponent';

import {
  guideSelector,
  isBranchingCompletedByCtaSelector,
  siblingStepEntityIdsOfStepSelector,
} from '../../../stores/mainStore/helpers/selectors';
import withMainStoreData from '../../../stores/mainStore/withMainStore';
import StepCta from '../../../system/StepCta';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import withFormFactor from '../../../hocs/withFormFactor';
import { StepCTAPosition } from '../../../../types/global';
import { getRenderConfig } from '../../../lib/guideRenderConfig';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import withCustomUIContext from '../../../hocs/withCustomUIContext';

type OuterProps = {
  ctas: StepCTA[];
  formatting: StepCTAPosition;
  beforeCompletionHandler: (
    cb: (...args: any[]) => void
  ) => (...a: any[]) => void;
  fullWidth?: boolean;
  strong?: boolean;
  theme: Theme | undefined;
  step: Step | undefined;
  orientation: CtasOrientation | undefined;
};

type Props = OuterProps &
  Pick<CustomUIProviderValue, 'backgroundColor' | 'fontColorHex'> &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'embedFormFactor' | 'renderedFormFactor'
  >;

type MainStoreData = {
  isBranchingCompletedByCta: boolean;
  isCyoaGuide: boolean;
  guideType: GuideTypeEnum;
  formFactorStyle: FormFactorStyle | undefined;
  stepEntityIdSiblings: ReturnType<typeof siblingStepEntityIdsOfStepSelector>;
};

export function buttonToCta(
  button: ButtonElement,
  embedFormFactor: EmbedFormFactor | undefined
): StepCTA {
  return {
    type: button.clickMessage ? StepCtaType.event : StepCtaType.url,
    text: button.buttonText,
    url: button.url,
    eventMessage: button.clickMessage,
    collapseSidebar: button.shouldCollapseSidebar,
    style: button.style || StepCtaStyle.link,
    settings:
      button.settings ||
      getDefaultCtaSetting(embedFormFactor as any as GuideFormFactor),
  };
}

export const StepControls: React.FC<Props & MainStoreData> = ({
  formFactor,
  embedFormFactor,
  renderedFormFactor,
  isCyoaGuide,
  beforeCompletionHandler,
  step,
  guideType,
  formFactorStyle,
  isBranchingCompletedByCta,
  ctas,
  formatting,
  stepEntityIdSiblings,
  fullWidth,
  strong,
  orientation,
  theme,
}) => {
  const { bodyPadding } = getRenderConfig({
    theme,
    embedFormFactor,
    renderedFormFactor,
    isCyoaGuide,
    view: undefined,
    stepType: step?.stepType,
  });

  const { isNested, isTimeline } = getGuideThemeFlags(theme);
  const willHideOnCompletion =
    (formFactorStyle as ChecklistStyle)?.hideCompletedSteps &&
    !isBranchingStep(step?.stepType);

  const processedCtas = useMemo(
    () =>
      ctas
        .filter((cta) => {
          if (cta.type === StepCtaType.back)
            return stepEntityIdSiblings.previous;
          if (cta.type === StepCtaType.next) return stepEntityIdSiblings.next;
          return !step?.isComplete || cta.type !== StepCtaType.skip;
        })
        .map((cta) => {
          const convertedCta =
            step?.isComplete &&
            cta.type === StepCtaType.complete &&
            !isBranchingCompletedByCta
              ? { ...cta, text: 'Mark incomplete' }
              : { ...cta };

          return convertedCta;
        }),
    [ctas, step, stepEntityIdSiblings, isBranchingCompletedByCta]
  );

  const isRequired = useMemo(
    () =>
      step &&
      (step.stepType === StepType.required ||
        isRequiredInputStep(step.stepType, step.inputs)),
    [step]
  );

  /**
   * Used for "space-between" orientation.
   */
  const fillIndex = useMemo(
    () => Math.max(Math.floor(ctas.length / 2), 1),
    [ctas.length]
  );

  if (!step || processedCtas.length === 0) {
    return null;
  }

  return (
    <div
      className={cx(
        'bento-step-ctas-wrapper flex gap-2 flex-wrap items-center',
        {
          'flex-col': fullWidth,
          'w-full': fullWidth,
          'justify-between flex-row-reverse':
            formatting === StepCTAPosition.bottomFixedSpaced,
          'flex-row-reverse': formatting === StepCTAPosition.bottomRight,
          'py-3': processedCtas.length > 0 || isNested,
          'px-4': !isTimeline,
          'justify-end': orientation === CtasOrientation.right,
        }
      )}
      style={{
        paddingLeft: px(bodyPadding?.l || bodyPadding?.x || 0),
        paddingRight: px(bodyPadding?.r || bodyPadding?.x || 0),
      }}
    >
      {processedCtas.map((cta, idx) => (
        <React.Fragment key={`cta-${idx}`}>
          {orientation === CtasOrientation.spaceBetween &&
            idx === fillIndex && <div className="flex-1" />}
          <StepCta
            cta={cta}
            stepEntityId={step.entityId}
            beforeCompletionHandler={beforeCompletionHandler}
            formFactor={formFactor}
            fullWidth={fullWidth}
            strong={strong}
            canIncomplete
          />
        </React.Fragment>
      ))}
      {!step.isComplete && isRequired && isNested && (
        <div
          className={cx('text-xs grow select-none', {
            'mt-1': fullWidth,
            'text-right': !fullWidth,
          })}
        >
          *Required
        </div>
      )}
      {step.isComplete && !willHideOnCompletion && (
        <i className="opacity-60 text-sm shrink-0">
          Completed
          {guideType === GuideTypeEnum.account &&
          (step.completedByUser?.fullName || step.completedByUser?.email)
            ? ` by ${
                step.completedByUser?.fullName || step.completedByUser?.email
              }`
            : ''}{' '}
          on{' '}
          {step.completedAt?.toLocaleDateString('en-us', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </i>
      )}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreData<Props, MainStoreData>((state, { step }) => {
    const guide = guideSelector(step?.guide, state);

    return {
      isBranchingCompletedByCta: isBranchingCompletedByCtaSelector(
        state,
        step?.entityId
      ),
      isCyoaGuide: !!guide?.isCyoa,
      guideType: guide?.type as GuideTypeEnum,
      formFactorStyle: guide?.formFactorStyle,
      stepEntityIdSiblings: siblingStepEntityIdsOfStepSelector(
        state,
        step?.entityId
      ),
    };
  }),
])(StepControls);
