import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { graphql } from 'react-relay';
import tinycolor from 'tinycolor2';
import { BoxProps } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';

import {
  FormFactorStyle,
  Theme,
  GuidePageTargetingType,
  VisualTagStyleSettings,
  GuideCompletionState,
  GuideFormFactor,
  BentoInstance,
} from 'bento-common/types';
import {
  BranchingPathWithResource,
  ContextTagType,
  FullGuide,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { BentoUI, PreviewDataPack } from 'bento-common/types/preview';
import usePrevious from 'bento-common/hooks/usePrevious';
import useRandomKey from 'bento-common/hooks/useRandomKey';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';

import { BentoComponentsEnum, ComposedComponentsEnum } from 'types';
import QueryRenderer from 'components/QueryRenderer';
import {
  DARK_COLOR_THRESHOLD,
  isSidebarToggleInverted,
  massageToggleStyle,
} from '../UISettings/styles.helpers';
import { embedFormFactorForComponent, getPreviewGuide } from './helpers';
import PreviewWindow, { getPreviewContainerId } from './PreviewWindow';
import { isEmptySlate } from 'bento-common/components/RichTextEditor/helpers';
import Box from 'system/Box';
import H4 from 'system/H4';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import { UISettings_all$data } from 'relay-types/UISettings_all.graphql';
import useEventListener from 'hooks/useEventListener';
import IntersectionObserver from 'components/IntersectionObserver';
import { View } from 'bento-common/types/shoyuUIState';
import { isActiveGuidesView } from 'bento-common/frontend/shoyuStateHelpers';
import sampleGuide from 'bento-common/sampleGuides/standardGuide';
import modalGuide from 'bento-common/sampleGuides/modalGuide';
import sub from 'date-fns/sub';
import {
  applyMockedAttributes,
  MockedAttributes,
} from 'hooks/useMockAttributes';
import { PreviewContainerQuery } from 'relay-types/PreviewContainerQuery.graphql';
import { useMockedAttributesProvider } from 'providers/MockedAttributesProvider';
import { useOrganization } from 'providers/LoggedInUserProvider';

export interface PreviewContainerCProps extends BoxProps {
  uiSettings?: BentoUI | Omit<UISettings_all$data, ' $refType'>;
  component: BentoComponentsEnum | ComposedComponentsEnum;
  tagType?: ContextTagType;
  /** Inject a step into the preview data */
  selectedStep?: any;
  /** Force standard theme style */
  contextual?: boolean;
  /** Request branching sample guide or not */
  branching?: boolean;
  sidebarAlwaysExpanded?: boolean;
  formFactorStyle?: FormFactorStyle;
  /** Weather to display the tooltips placement callout */
  showTooltipsPlacementCallout?: boolean;
  /** use if previewing a particular view */
  view?: View;
  mockedAttributes?: MockedAttributes;
  inputGuide?: FullGuide;
  branchingPaths?: BranchingPathWithResource[];
  allowScroll?: boolean;
  tagStyle?: VisualTagStyleSettings;
  lazy?: boolean;
  narrowGuide?: boolean;
  previewBoxProps?: Omit<BoxProps, 'background'>;
}

interface PreviewContainerProps extends PreviewContainerCProps {}

function getPreviewComponent(
  component: BentoComponentsEnum | ComposedComponentsEnum,
  uiPreviewId: string
) {
  const commonAttrs = {
    style: { pointerEvents: 'all' },
    container: `#${getPreviewContainerId(uiPreviewId)}`,
  };
  switch (component) {
    case BentoComponentsEnum.inline:
      return <bento-embed uipreviewid={uiPreviewId} {...commonAttrs} />;
    case BentoComponentsEnum.inlineContext:
      return (
        <bento-embed
          uipreviewid={uiPreviewId}
          embedid={uiPreviewId}
          {...commonAttrs}
        />
      );
    case BentoComponentsEnum.sidebar:
      return <bento-sidebar uipreviewid={uiPreviewId} {...commonAttrs} />;
    case BentoComponentsEnum.modal:
      return <bento-modal uipreviewid={uiPreviewId} {...commonAttrs} />;
    case BentoComponentsEnum.banner:
      return <bento-banner uipreviewid={uiPreviewId} {...commonAttrs} />;
    case BentoComponentsEnum.tooltip:
    case ComposedComponentsEnum.flow:
      return <bento-tooltip uipreviewid={uiPreviewId} {...commonAttrs} />;
    default:
      throw new Error(`Cannot handle component preview: ${component}`);
  }
}

function getEmptyMessage(
  selectedStep: any,
  component: BentoComponentsEnum | ComposedComponentsEnum
) {
  if (
    (
      [
        BentoComponentsEnum.modal,
        BentoComponentsEnum.banner,
        BentoComponentsEnum.tooltip,
      ] as (BentoComponentsEnum | ComposedComponentsEnum)[]
    ).includes(component) &&
    selectedStep &&
    isEmptySlate(selectedStep.bodySlate)
  ) {
    return (
      <Box
        w="full"
        h="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <H4>Add content to see preview.</H4>
      </Box>
    );
  }
  return null;
}

const parseColor = (color: string) => {
  const parsed = tinycolor(color);

  if (!parsed.isValid()) return 'white';

  const withAlpha = !parsed.toHex8String().toLowerCase().endsWith('ff');
  return withAlpha ? parsed.toHex8String() : parsed.toHexString();
};

const patchOrgProperties = (ui) =>
  ({
    ...ui,
    ticketCreationEnabled: ui.helpCenter?.issueSubmission ?? false,
    zendeskChatEnabled: ui.helpCenter?.liveChat ?? false,
  } as BentoUI);

function PreviewContainerComponent({
  uiSettings,
  component,
  tagType,
  tagStyle,
  branching,
  selectedStep,
  contextual,
  sidebarAlwaysExpanded,
  formFactorStyle,
  inputGuide,
  allowScroll = true,
  height = '640px',
  width,
  branchingPaths,
  showTooltipsPlacementCallout,
  lazy = true,
  narrowGuide,
  previewBoxProps = {},
  mockedAttributes,
  view,
  ...boxProps
}: PreviewContainerProps) {
  const { mockedAttributes: globalMockedAttributes } =
    useMockedAttributesProvider();
  const { organization } = useOrganization();

  const patchedUiSettings = useMemo(
    () =>
      applyMockedAttributes(patchOrgProperties(uiSettings), mockedAttributes),
    [uiSettings, mockedAttributes]
  );

  const patchedSelectedStep = useMemo(() => {
    const result =
      Object.keys(globalMockedAttributes || {}).length > 0 && selectedStep
        ? applyMockedAttributes(
            selectedStep,
            Object.entries(globalMockedAttributes).reduce((acc, [k, v]) => {
              const sanitizedKey = k.split('stepPrototypes')[1]?.slice(4) || '';
              if (sanitizedKey) acc[sanitizedKey] = v;
              return acc;
            }, {}),
            ''
          )
        : selectedStep;

    // Mock the entityId if needed.
    if (result && !result.entityId) result.entityId = uuidv4();
    return result;
  }, [selectedStep, globalMockedAttributes]);

  const uiPreviewId = useRandomKey();
  const [canStartPreview, setCanStartPreview] = useState<boolean>(!lazy);
  const [_previewData, setPreviewData] = useState<PreviewDataPack>(undefined);

  const appContainerIdentifier = useMemo(
    () => `#${getPreviewContainerId(uiPreviewId)}`,
    [uiPreviewId]
  );
  const prevComponent = usePrevious(component);
  const emptyMessage = getEmptyMessage(patchedSelectedStep, component);

  const alignLeft =
    (component === BentoComponentsEnum.sidebar &&
      patchedUiSettings?.sidebarSide === 'left') ||
    component === BentoComponentsEnum.context;

  const backgroundColor = useMemo(() => {
    return parseColor(patchedUiSettings?.embedBackgroundHex);
  }, [patchedUiSettings?.embedBackgroundHex]);

  // Parsing to avoid having invalid CSS variables in the embed.
  const cardBackgroundColor = useMemo(() => {
    return parseColor(patchedUiSettings?.cardBackgroundColor);
  }, [patchedUiSettings?.cardBackgroundColor]);

  const updatePreviewData = useCallbackRef(
    debounce(() => {
      if (
        !window?.Bento ||
        !component ||
        !patchedUiSettings ||
        (lazy && !canStartPreview)
      ) {
        return;
      }

      const dataPack: PreviewDataPack = {
        enabledFeatureFlags: (organization?.enabledFeatureFlags ||
          []) as string[],
        guide: inputGuide
          ? {
              ...inputGuide,
              pageTargeting: {
                type: GuidePageTargetingType.anyPage,
              },
              pageTargetingType: GuidePageTargetingType.anyPage,
              pageTargetingUrl: null,
            }
          : getPreviewGuide(
              contextual
                ? component === BentoComponentsEnum.inline
                  ? Theme.card
                  : Theme.nested
                : (patchedUiSettings.theme as Theme),
              component,
              branching,
              {
                ...(patchedSelectedStep && {
                  'modules[0].steps[0]': {
                    ...patchedSelectedStep,
                    state: StepState.incomplete,
                  },
                  firstIncompleteStep: patchedSelectedStep.entityId,
                }),
                formFactorStyle,
              }
            ),
        branchingPaths,
        uiSettings: {
          ...patchedUiSettings,
          appContainerIdentifier, // sanboxed app container
          isSidebarAutoOpenOnFirstViewDisabled: true,
          backgroundColor,
          cardBackgroundColor,
          isEmbedToggleColorInverted:
            isSidebarToggleInverted(patchedUiSettings.toggleStyle) ||
            patchedUiSettings.isEmbedToggleColorInverted,
          toggleStyle: massageToggleStyle(patchedUiSettings.toggleStyle),
          isCyoaOptionBackgroundColorDark:
            tinycolor(
              patchedUiSettings.cyoaOptionBackgroundColor
            ).getBrightness() < DARK_COLOR_THRESHOLD,
        } as BentoUI,
        sidebarAlwaysExpanded: !!sidebarAlwaysExpanded,
        sidebarInitiallyExpanded: true,
        injectInlineEmbed: component === BentoComponentsEnum.inlineContext,
        view,
      };

      if (isActiveGuidesView(view)) {
        dataPack.guide = {
          ...dataPack.guide,
          isSideQuest: false,
          stepsByState: {
            complete: [],
            skipped: [],
            viewed: [],
            incomplete: dataPack.guide.steps.filter((s) => !s.isComplete),
          },
        };

        dataPack.additionalGuides = [sampleGuide, modalGuide].map((g) => {
          const steps = sampleGuide.modules.flatMap((m) => m.steps);
          const yesterdayStr = sub(new Date(), { days: 1 }).toUTCString();
          return {
            ...g,
            completionState: GuideCompletionState.complete,
            isDone: true,
            isComplete: true,
            isViewed: true,
            formFactor: GuideFormFactor.legacy,
            steps,
            stepsInfo: steps,
            completedAt: yesterdayStr as any as Date,
            doneAt: yesterdayStr as any as Date,
          };
        });
      }

      (window.Bento as BentoInstance)?.setPreviewData(
        uiPreviewId,
        dataPack,
        embedFormFactorForComponent[component]
      );

      /**
       * This will intentionally cause a re-render, which
       * is needed to prevent the previews from becoming flaky sometimes
       *
       * @todo find a better solution
       */
      setPreviewData(dataPack);
    }, 100),
    [
      lazy,
      canStartPreview,
      patchedUiSettings,
      component,
      branching,
      appContainerIdentifier,
      patchedSelectedStep,
      contextual,
      sidebarAlwaysExpanded,
      view,
      inputGuide,
      branchingPaths,
      backgroundColor,
      cardBackgroundColor,
      formFactorStyle,
      mockedAttributes,
      organization?.enabledFeatureFlags,
    ],
    { callOnDepsChange: true }
  );

  const handleOnInView = useCallback(() => {
    if (!canStartPreview) {
      setCanStartPreview(true);
    }
  }, [canStartPreview]);

  useEffect(() => {
    return () =>
      (window.Bento as BentoInstance)?.removePreviewData(uiPreviewId);
  }, []);

  useEventListener(
    'window',
    // @ts-ignore
    'bento-initialized',
    updatePreviewData
  );

  return (
    <>
      <Box
        minW="640px"
        maxW="1280px"
        width={width}
        height={height}
        overflow="visible"
        {...boxProps}
      >
        <IntersectionObserver onInView={handleOnInView} />
        <PreviewWindow
          alignLeft={alignLeft}
          background={backgroundColor}
          currentComponent={component}
          uiPreviewId={uiPreviewId}
          uiSettings={patchedUiSettings}
          tagType={tagType}
          tagStyle={tagStyle}
          allowScroll={allowScroll}
          narrowGuide={narrowGuide}
          previewBoxProps={previewBoxProps}
        >
          {prevComponent === component &&
            (emptyMessage ||
              (component &&
                component !== BentoComponentsEnum.context &&
                getPreviewComponent(component, uiPreviewId)))}
        </PreviewWindow>
      </Box>
      {showTooltipsPlacementCallout && (
        <CalloutText calloutType={CalloutTypes.Themeless} my={4}>
          ⚠️ The placement of the tooltip in this preview is just for
          illustrative purposes.
        </CalloutText>
      )}
    </>
  );
}

export const PREVIEW_CONTAINER_QUERY = graphql`
  query PreviewContainerQuery {
    uiSettings {
      ...UISettings_all @relay(mask: false)
    }
  }
`;

export default function PreviewContainer(cProps: PreviewContainerCProps) {
  const queryRendered = useCallback(
    ({ props }) =>
      props && <PreviewContainerComponent {...cProps} {...props} />,
    [cProps]
  );

  return cProps.uiSettings ? (
    <PreviewContainerComponent {...cProps} />
  ) : (
    <QueryRenderer<PreviewContainerQuery>
      query={PREVIEW_CONTAINER_QUERY}
      fetchPolicy="store-and-network"
      render={queryRendered}
    />
  );
}
