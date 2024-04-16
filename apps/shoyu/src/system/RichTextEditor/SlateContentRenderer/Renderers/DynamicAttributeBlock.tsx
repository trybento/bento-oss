import React from 'react';
import {
  DynamicAttributeBlockElement,
  SlateRendererProps,
} from 'bento-common/types/slate';
import cx from 'classnames';
import { selectedGuideForFormFactorSelector } from '../../../../stores/mainStore/helpers/selectors';
import composeComponent from 'bento-common/hocs/composeComponent';
import { Guide } from 'bento-common/types/globalShoyuState';
import withFormFactor from '../../../../hocs/withFormFactor';
import withMainStoreData from '../../../../stores/mainStore/withMainStore';
import { FormFactorContextValue } from '../../../../providers/FormFactorProvider';
import {
  AlignmentEnum,
  CardStyle,
  StepBodyOrientation,
  VerticalAlignmentEnum,
} from 'bento-common/types';

interface DynamicAttributeBlockProps extends SlateRendererProps {
  node: DynamicAttributeBlockElement;
}

type MainStoreData = {
  guide: Guide | undefined;
};

type Props = DynamicAttributeBlockProps & FormFactorContextValue;

function DynamicAttributeBlock({
  children,
  node,
  guide,
  options,
}: Props & MainStoreData) {
  const isTopAligned =
    !options?.verticalMediaAlignment ||
    options?.verticalMediaAlignment === VerticalAlignmentEnum.top;
  const isBottomAligned =
    options?.verticalMediaAlignment === VerticalAlignmentEnum.bottom;
  const isVerticalCenterAligned =
    options?.verticalMediaAlignment === VerticalAlignmentEnum.center;
  const isLeftAligned =
    options?.horizontalMediaAlignment === AlignmentEnum.left;
  const isRightAligned =
    options?.horizontalMediaAlignment === AlignmentEnum.right;

  const formFactorStyle = guide?.formFactorStyle as CardStyle;

  return (
    <div className="flex h-full">
      <div
        className={cx('leading-none font-bold', {
          'ml-auto': isRightAligned,
          'mr-auto': isLeftAligned,
          'my-4':
            formFactorStyle?.stepBodyOrientation ===
            StepBodyOrientation.vertical,
          'mx-auto': !isRightAligned && !isLeftAligned,
          'mt-auto': isBottomAligned || isVerticalCenterAligned,
          'mb-auto':
            (isTopAligned || isVerticalCenterAligned) &&
            formFactorStyle?.stepBodyOrientation ===
              StepBodyOrientation.horizontal,
        })}
        style={{
          overflowWrap: 'anywhere',
          color: formFactorStyle?.mediaTextColor,
          fontSize: formFactorStyle?.mediaFontSize,
        }}
      >
        {node.text}
      </div>
      {children}
    </div>
  );
}

export default composeComponent<DynamicAttributeBlockProps>([
  withFormFactor,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => ({
    guide: selectedGuideForFormFactorSelector(state, formFactor),
  })),
])(DynamicAttributeBlock);
