import React, { useMemo } from 'react';
import cx from 'classnames';
import { Guide, Module } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { ChecklistStyle, Theme } from 'bento-common/types';
import { hasOnlyOneStep } from 'bento-common/utils/formFactor';

import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import withCustomUIContext from '../hocs/withCustomUIContext';
import withMainStoreData from '../stores/mainStore/withMainStore';
import {
  modulesSelectorOfGuide,
  selectedGuideForFormFactorSelector,
  selectedModuleForFormFactorSelector,
} from '../stores/mainStore/helpers/selectors';
import ResetOnboarding from './ResetOnboarding';
import TransitionWrapper from './TransitionWrapper';
import { getRenderConfig, SeparationBetween } from '../lib/guideRenderConfig';
import withFormFactor from '../hocs/withFormFactor';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import { InlineEmbedContextValue } from '../providers/InlineEmbedProvider';
import withInlineEmbed from '../hocs/withIlnineEmbed';
import { WithSidebarContentWrapperRef } from '../../types/global';

type OuterProps = {
  theme: Theme | undefined;
} & WithSidebarContentWrapperRef;

type BeforeMainStoreDataProps = OuterProps &
  Pick<CustomUIProviderValue, 'backgroundColor'> &
  Pick<
    FormFactorContextValue,
    | 'formFactor'
    | 'embedFormFactor'
    | 'embedFormFactorFlags'
    | 'renderedFormFactor'
    | 'renderedFormFactorFlags'
  > &
  Pick<InlineEmbedContextValue, 'isEverboardingInline'>;

type MainStoreData = {
  guide: Guide | undefined;
  modules: Module[];
  isCyoaGuide: boolean;
  selectedModule: Module | undefined;
};

type ComposedProps = BeforeMainStoreDataProps & MainStoreData;

export const ModulesList: React.FC<ComposedProps> = ({
  guide,
  backgroundColor,
  modules,
  selectedModule,
  theme,
  embedFormFactor,
  embedFormFactorFlags: { isSidebar },
  renderedFormFactor,
  renderedFormFactorFlags: {
    isInline: isInlineRendered,
    isSidebar: isSidebarRendered,
  },
  isCyoaGuide,
  isEverboardingInline,
  sidebarContentWrapperRef,
}) => {
  const {
    stepTransition: transition,
    moduleTransition,
    ModuleCard,
    separation,
    combineModules,
  } = getRenderConfig({
    theme,
    embedFormFactor,
    renderedFormFactor,
    isCyoaGuide,
    view: undefined,
    stepType: undefined,
  });

  const multiModule = useMemo(
    () => !combineModules && modules.length > 1,
    [combineModules, modules.length]
  );

  if (!ModuleCard) {
    throw new Error(`Failed to find a ModuleCard component`);
  }

  return (
    <TransitionWrapper transition={transition}>
      <div
        className="flex flex-col h-full w-full"
        style={{
          backgroundColor: backgroundColor ? backgroundColor : 'white',
        }}
      >
        <div
          className={cx('h-full flex flex-col', {
            'gap-5': !(guide?.formFactorStyle as ChecklistStyle | undefined)
              ?.hideStepGroupTitle,
            'py-4': !isEverboardingInline && isInlineRendered,
            'pb-4 pt-2': isSidebarRendered,
          })}
        >
          {combineModules ? (
            <ModuleCard
              sidebarContentWrapperRef={sidebarContentWrapperRef}
              guide={guide}
              combineModules
              theme={theme}
              multiModule={multiModule}
              showSeparator={separation === SeparationBetween.modules}
              transition={moduleTransition}
              singleStep={hasOnlyOneStep(guide)}
              isSelected
            />
          ) : (
            modules.map((module) => (
              <ModuleCard
                sidebarContentWrapperRef={sidebarContentWrapperRef}
                key={module.entityId}
                guide={guide}
                module={module}
                theme={theme}
                multiModule={multiModule}
                showSeparator={separation === SeparationBetween.modules}
                transition={moduleTransition}
                singleStep={hasOnlyOneStep(guide)}
                isSelected={selectedModule?.entityId === module.entityId}
              />
            ))
          )}
          {isSidebar && <ResetOnboarding className="ml-auto mt-1" />}
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withInlineEmbed,
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { formFactor }): MainStoreData => {
      const guide = selectedGuideForFormFactorSelector(state, formFactor);
      return {
        guide,
        modules: modulesSelectorOfGuide(guide?.entityId, state),
        isCyoaGuide: !!guide?.isCyoa,
        selectedModule: selectedModuleForFormFactorSelector(state, formFactor),
      };
    }
  ),
])(ModulesList);
