import React, { useMemo } from 'react';
import cx from 'classnames';
import { Guide, Module, Step } from 'bento-common/types/globalShoyuState';
import { COMPLETION_STYLE_CLASSES } from 'bento-common/utils/constants';
import composeComponent from 'bento-common/hocs/composeComponent';

import EmojiSpacingFixWrapper from 'bento-common/components/EmojiSpacingFixWrapper';
import DetailedProgress from '../../DetailedProgress';
import CircleIndex, { CircleIndexSize } from '../../CircleIndex';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import withFormFactor from '../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import { Theme } from 'bento-common/types';
import { getGuideThemeFlags } from 'bento-common/data/helpers';
import withMainStoreData from '../../../stores/mainStore/withMainStore';
import { guideSelector } from '../../../stores/mainStore/helpers/selectors';

type OuterProps = {
  guide?: Guide;
  module?: Module;
  combineModules?: boolean;
  theme: Theme;
  index?: number;
  hideIndex?: boolean;
  hideProgress?: boolean;
  selectedStep?: Step;
  showGetStartedButton?: boolean;
  onClick?: React.HTMLProps<HTMLDivElement>['onClick'];
  isSelected: boolean;
};

type MainStoreData = {
  guide: Guide | undefined;
};

type Props = MainStoreData &
  OuterProps &
  Pick<CustomUIProviderValue, 'stepCompletionStyle' | 'primaryColorHex'> &
  Pick<
    FormFactorContextValue,
    'renderedFormFactorFlags' | 'embedFormFactorFlags'
  >;

export const CommonModuleHeader: React.FC<Props> = ({
  guide,
  module,
  combineModules,
  selectedStep,
  index,
  hideIndex,
  hideProgress,
  renderedFormFactorFlags: { isInline, isSidebar },
  embedFormFactorFlags: { isSidebar: isSidebarEmbed, isInline: isInlineEmbed },
  stepCompletionStyle,
  primaryColorHex,
  theme,
  showGetStartedButton,
  onClick,
  isSelected,
}) => {
  const isComplete = module ? module.isComplete : guide?.isComplete;
  const _hideIndex = hideIndex || (guide?.modules?.length || 0) <= 1;

  const { isNested, isTimeline } = getGuideThemeFlags(theme);

  const progressFlags = useMemo(() => {
    const flags = {
      detailedProgress: !hideProgress && (!isComplete || isTimeline),
      getStartedButton: showGetStartedButton,
    };
    return Object.values(flags).some(Boolean) ? flags : null;
  }, [hideProgress, isComplete, isTimeline, showGetStartedButton]);

  return (
    <div
      className={cx('m-0.5 cursor-pointer', {
        'px-2': isInline && isNested,
        'pb-4': isInlineEmbed && isTimeline && !isSelected,
      })}
      onClick={onClick}
    >
      <div className="flex justify-between w-full items-center">
        <div className="grid grid-flow-col truncate flex items-center">
          {!_hideIndex && (
            <CircleIndex
              className="bento-step-group-circular-index"
              isComplete={isComplete}
              index={index! + 1}
              size={isInline ? CircleIndexSize.lg : CircleIndexSize.md}
            />
          )}
          {module?.name && (
            <div
              className={cx('bento-step-group-title truncate font-medium', {
                'text-lg': isInline,
                'text-base': !isInline,
                'ml-2': !_hideIndex,
                [COMPLETION_STYLE_CLASSES[stepCompletionStyle]]: isComplete,
              })}
              title={module.name}
            >
              <EmojiSpacingFixWrapper text={module.name} />
            </div>
          )}
        </div>
      </div>
      {progressFlags && (
        <div className="flex justify-between items-center mt-3">
          {progressFlags.detailedProgress && (
            <DetailedProgress
              totalNumSteps={module?.totalStepsCount ?? guide?.totalSteps ?? 0}
              numCompletedSteps={
                module?.completedStepsCount ?? guide?.completedStepsCount ?? 0
              }
              theme={theme}
              module={module}
              combineModules={combineModules}
              selectedStep={selectedStep}
              showStepsCompleted={!isTimeline || isSidebarEmbed}
              showProgress={
                !isTimeline ||
                isInline ||
                (isSidebar &&
                  (module?.steps?.length ?? guide?.steps?.length ?? 0) > 1)
              }
            />
          )}
          {progressFlags.getStartedButton && (
            <button
              className="relative fade-before-20-card rounded whitespace-nowrap hover:opacity-80 px-2 font-semibold text-sm transition h-8 text-white"
              style={{ backgroundColor: primaryColorHex, width: '109px' }}
            >
              Get started
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreData<Props, MainStoreData>((state, { guide, module }) => {
    return {
      guide: guide || guideSelector(module?.guide, state),
    };
  }),
])(CommonModuleHeader);
