import React, { useMemo } from 'react';
import cx from 'classnames';
import { isSidebarEmbed } from 'bento-common/utils/formFactor';
import {
  ChecklistStyle,
  GuideHeaderType,
  MediaOrientation,
} from 'bento-common/types';
import composeComponent from 'bento-common/hocs/composeComponent';

import { StepWrapperProps } from '../../../lib/guideRenderConfig';
import TransitionWrapper from '../../TransitionWrapper';
import ExtractedRichContent from '../common/ExtractedRichContent';
import TimelineProgress from './TimelineProgress';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';

type OuterProps = StepWrapperProps;

type Props = OuterProps & Pick<CustomUIProviderValue, 'sidebarHeader'>;

function TimelineStepWrapper({
  step: selectedStep,
  extractedNodes,
  transition,
  children,
  embedFormFactor,
  multiModule,
  singleStep,
  style,
  sidebarHeader,
  combineModules,
  imageWidth,
  allowMarginlessImages,
  extractedNodesContainerStyle,
}: React.PropsWithChildren<Props>) {
  const isSidebar = isSidebarEmbed(embedFormFactor);
  const hasExtractedNodes = useMemo(
    () =>
      extractedNodes &&
      Object.values(extractedNodes).some((nodes) => nodes.length > 0),
    [extractedNodes]
  );

  const topSpacingClass: string = useMemo(
    () =>
      [GuideHeaderType.simple, GuideHeaderType.striped].includes(
        sidebarHeader.type
      )
        ? ''
        : 'mt-3',
    [sidebarHeader.type]
  );

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {(isSidebar || !multiModule) && !singleStep && (
        <TimelineProgress
          selectedStep={selectedStep}
          className={cx(topSpacingClass, { 'ml-4': isSidebar })}
          combineModules={combineModules}
        />
      )}
      <div
        className={cx('grow overflow-hidden', {
          [topSpacingClass]: singleStep,
        })}
      >
        <TransitionWrapper
          transition={transition}
          expanded
          key={selectedStep?.entityId}
        >
          <div
            className={cx('flex gap-4 w-full h-full', {
              'flex-row-reverse':
                (style as ChecklistStyle)?.mediaOrientation ===
                MediaOrientation.Left,
            })}
          >
            <div className="grow overflow-hidden">{children}</div>
            {hasExtractedNodes && (
              <div className="shrink-0" style={extractedNodesContainerStyle}>
                <ExtractedRichContent
                  extractedNodes={extractedNodes!}
                  width={imageWidth}
                  allowMarginless={allowMarginlessImages}
                  mediaOrientation={(style as ChecklistStyle)?.mediaOrientation}
                />
              </div>
            )}
          </div>
        </TransitionWrapper>
      </div>
    </div>
  );
}

export default composeComponent<OuterProps>([withCustomUIContext])(
  TimelineStepWrapper
);
