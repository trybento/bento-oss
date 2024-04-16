import React, { useMemo } from 'react';
import cx from 'classnames';
import {
  CtasOrientation,
  InlineContextualGuideStyles,
} from 'bento-common/types';
import { guideSelector } from '../../../stores/mainStore/helpers/selectors';
import withMainStoreData from '../../../stores/mainStore/withMainStore';
import StepCta from '../../../system/StepCta';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import composeComponent from 'bento-common/hocs/composeComponent';
import withFormFactor from '../../../hocs/withFormFactor';
import { StepControlsProps } from '../../../lib/guideRenderConfig';
import { buttonToCta } from '../common/StepControls';
import { Guide } from 'bento-common/types/globalShoyuState';
import { getInlineContextPadding } from '../../../lib/helpers';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';

type OuterProps = StepControlsProps;

type Props = OuterProps &
  Pick<CustomUIProviderValue, 'inlineContextualStyle'> &
  Pick<FormFactorContextValue, 'formFactor' | 'embedFormFactor'>;

type MainStoreData = {
  guide?: Guide;
};

export const StepControls: React.FC<Props & MainStoreData> = ({
  formFactor,
  embedFormFactor,
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

  const processedCtas = useMemo(
    () =>
      ctas.map((cta) => {
        const convertedCta =
          cta.type === 'button'
            ? buttonToCta(cta, embedFormFactor)
            : { ...cta };

        return convertedCta;
      }),
    [ctas, step, embedFormFactor, orientation]
  );

  return (
    <div
      className={cx(
        'bento-step-ctas-wrapper flex gap-2 flex-wrap items-center',
        {
          'flex-col': fullWidth,
          'w-full': fullWidth,
          'justify-end': orientation === CtasOrientation.right,
          'justify-between': orientation === CtasOrientation.spaceBetween,
          'pt-3': processedCtas.length > 0,
        }
      )}
      style={{
        paddingLeft: inlineContextPadding?.l,
        paddingRight: inlineContextPadding?.r,
        paddingBottom: inlineContextPadding?.b,
      }}
    >
      {processedCtas.map((cta, idx) => (
        <StepCta
          key={`cta-${idx}`}
          cta={cta}
          stepEntityId={step?.entityId}
          formFactor={formFactor}
          fullWidth={fullWidth}
          strong={strong}
        />
      ))}
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
    };
  }),
])(StepControls);
