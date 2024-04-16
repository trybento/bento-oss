import React, { useCallback, useContext, useMemo, useState } from 'react';
import cx from 'classnames';
import {
  EmbedTypenames,
  Guide,
  GuideEntityId,
} from 'bento-common/types/globalShoyuState';
import {
  allowedGuideTypesSettings,
  getEmbedFormFactorsForGuide,
  guideListConfig,
  isFinishedGuide,
  isSavedGuide,
  showResourceCenterInline,
  viewToGuideListMap,
} from 'bento-common/data/helpers';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  EmbedFormFactor,
  GuideDesignType,
  GuidesListEnum,
} from 'bento-common/types';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import { View } from 'bento-common/types/shoyuUIState';
import { isActiveGuidesSubView } from 'bento-common/frontend/shoyuStateHelpers';
import { isAnnouncement, isEverboarding } from 'bento-common/data/helpers';

import LeftArrow from '../../icons/leftArrow.svg';
import ListAltIcon from '../../icons/listAlt.svg';
import FileCabinetIcon from '../../icons/fileCabinet.svg';
import CampaignIcon from '../../icons/campaign.svg';
import {
  CustomUIContext,
  CustomUIProviderValue,
} from '../../providers/CustomUIProvider';
import { SidebarProviderValue } from '../../providers/SidebarProvider';
import withMainStoreData from '../../stores/mainStore/withMainStore';
import {
  availableGuidesSelector,
  guidesDetailsSelector,
  lastSerialCyoaInfoSelector,
  previousGuidesSelector,
  selectedGuideForFormFactorSelector,
} from '../../stores/mainStore/helpers/selectors';
import { MainStoreState } from '../../stores/mainStore/types';
import withSidebarContext from '../../hocs/withSidebarContext';
import withFormFactor from '../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../providers/FormFactorProvider';
import SuccessBanner from '../SuccessBanner';
import CYOAPath, { shouldShowSerialCYOA } from '../CYOAPath';
import { px } from '../../lib/helpers';
import {
  getEmbedFormFactorFlags,
  getFormFactorFlags,
} from '../../lib/formFactors';
import useResponsiveCards from '../../hooks/useResponsiveCards';
import withCustomUIContext from '../../hocs/withCustomUIContext';
import { UIStateContextValue } from '../../providers/UIStateProvider';
import withUIState from '../../hocs/withUIState';
import { GuideCard } from './commonComponents';
import QuickLinks from './QuickLinks';
import HelpCenterSearch from './helpCenter/HelpCenterSearch';
import useAirTrafficJourney from '../../stores/airTrafficStore/hooks/useAirTrafficJourney';

const INITIAL_GUIDES_SHOWN = 1;

type GuideListProps = {
  icon?: React.ReactNode;
  title: string;
  formFactor: EmbedFormFactor;
  guides: Guide[];
  guidesDetails: ReturnType<typeof guidesDetailsSelector>;
  guideSelectedHandlers: { [key: string]: () => void };
  onViewAll: (type: GuidesListEnum) => void;
  type: GuidesListEnum;
  viewAll: boolean;
  forcedGuidesShown?: number;
  hideCards?: boolean;
  className?: string;
};

const GuideList: React.FC<GuideListProps> = ({
  icon,
  title,
  formFactor,
  guides,
  guidesDetails,
  forcedGuidesShown = 0,
  guideSelectedHandlers,
  onViewAll,
  type,
  viewAll,
  hideCards,
}) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const { primaryColorHex } = useContext(CustomUIContext);

  const guidesShown =
    (hideCards ? 0 : INITIAL_GUIDES_SHOWN) + forcedGuidesShown;

  const splitGuides = useMemo(
    () => [guides.slice(0, guidesShown), guides.slice(guidesShown)],
    [guides, guidesShown]
  );

  const { isSidebar } = getFormFactorFlags(formFactor);

  const { colsClass, minWidth } = useResponsiveCards({
    containerRef,
    formFactor,
    defaultFullWidth: true,
  });

  const toggleViewAll = useCallback(() => {
    onViewAll(type);
  }, [type, onViewAll]);

  const showHeader = isSidebar ? !viewAll : true;

  return (
    <div
      ref={setContainerRef}
      className={cx(
        'flex flex-col',
        {
          /** Expand to all columns */
          'col-[1_/-1]': hideCards,
          'gap-4': viewAll || (guides.length > 0 && splitGuides[0].length > 0),
        },
        'bento-resource-center-section-wrapper'
      )}
      style={{
        animation: viewAll ? 'fadeIn 1s' : undefined,
      }}
    >
      {showHeader && (
        <div className="flex gap-2.5 text-base font-semibold bento-resource-center-card-header">
          {!!icon && (
            <div
              className={cx('my-auto text-gray-600')}
              onClick={viewAll ? toggleViewAll : undefined}
            >
              {icon}
            </div>
          )}
          <div
            className="truncate bento-resource-center-section-title-text"
            title={title}
          >
            {title}
          </div>
          {splitGuides[1].length > 0 && !viewAll && (
            <div
              className="text-xs ml-auto flex cursor-pointer  hover:opacity-80"
              style={{ color: primaryColorHex }}
              onClick={toggleViewAll}
            >
              <div className="my-auto whitespace-nowrap select-none">
                View all
              </div>
            </div>
          )}
        </div>
      )}
      {guides.length > 0 ? (
        <>
          <div
            className={cx('grid gap-3 flex-1', {
              [colsClass]: viewAll,
            })}
          >
            {splitGuides[0].concat(viewAll ? splitGuides[1] : []).map((g) => (
              <GuideCard
                key={g.entityId}
                guide={g}
                guideDetails={guidesDetails[g.entityId]}
                onClick={guideSelectedHandlers[g.entityId]}
                style={{ minWidth }}
                className="bento-resource-center-card-wrapper"
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-8 mt-8 italic text-gray-400">
          <div className="m-auto">You have no guides at this moment</div>
        </div>
      )}
    </div>
  );
};

type OuterProps = {
  /**
   * Used to prevent floating elements anchored to the bottom
   * from blocking elements in this component.
   */
  overriddenMarginBottomPx?: number;
};

type BeforeMainStoreDataProps = OuterProps &
  UIStateContextValue &
  Pick<
    CustomUIProviderValue,
    | 'sidebarVisibility'
    | 'allGuidesStyle'
    | 'primaryColorHex'
    | 'fontColorHex'
    | 'quickLinks'
    | 'helpCenter'
    | 'kbSearchEnabled'
    | 'inlineEmptyBehaviour'
  > &
  Pick<SidebarProviderValue, 'setIsSidebarExpanded' | 'isSidebarExpanded'> &
  WithLocationPassedProps &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'embedFormFactorFlags' | 'renderedFormFactor'
  >;

type MainStoreData = {
  availableGuides: Guide[];
  previousGuides: ReturnType<typeof previousGuidesSelector>;
  dispatch: MainStoreState['dispatch'];
  guide: Guide | undefined;
  guidesDetails: ReturnType<typeof guidesDetailsSelector>;
  serialCyoaData: ReturnType<typeof lastSerialCyoaInfoSelector>;
};

type ActiveGuidesProps = BeforeMainStoreDataProps &
  FormFactorContextValue &
  MainStoreData;

export const ActiveGuides: React.FC<ActiveGuidesProps> = ({
  availableGuides,
  previousGuides,
  dispatch,
  allGuidesStyle,
  primaryColorHex,
  fontColorHex,
  serialCyoaData,
  guidesDetails,
  view,
  uiActions,
  setIsSidebarExpanded,
  sidebarVisibility,
  formFactor,
  embedFormFactorFlags: { isInline, isSidebar },
  renderedFormFactorFlags: { isInline: isInlineRendered },
  renderedFormFactor,
  quickLinks,
  helpCenter,
  overriddenMarginBottomPx,
  kbSearchEnabled,
  inlineEmptyBehaviour,
}) => {
  const expandedList = view !== View.activeGuides && viewToGuideListMap[view];
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const isShowingSerialCYOA = useMemo(
    () =>
      allowedGuideTypesSettings(sidebarVisibility, formFactor).cyoa &&
      shouldShowSerialCYOA(serialCyoaData, sidebarVisibility, formFactor),
    [serialCyoaData, sidebarVisibility, formFactor]
  );

  const { startJourney } = useAirTrafficJourney({
    selectedGuideEntityId: undefined,
  });

  const guideSelectedHandlers = useMemo(
    () =>
      Object.fromEntries(
        [
          ...availableGuides,
          ...previousGuides.onboarding,
          ...previousGuides.announcements,
        ].map((g) => [
          g.entityId,
          () => {
            dispatch({
              type: 'guideSelected',
              guide: g.entityId as GuideEntityId,
              formFactor:
                g.designType === GuideDesignType.onboarding
                  ? formFactor
                  : getEmbedFormFactorsForGuide(g, formFactor)[0],
            });

            /**
             * If we're selected a previously completed or saved guide that happens to be a modal,
             * it then means we must start a journey in order to allow it to show up once again.
             *
             * NOTE: We currently don't show banners, tooltips or flow-type guides here therefore
             * those are not considered.
             */
            const guideIs = getEmbedFormFactorFlags(
              g.formFactor as unknown as EmbedFormFactor
            );
            if (guideIs.isModal && (isFinishedGuide(g) || isSavedGuide(g))) {
              startJourney({
                type: EmbedTypenames.guide,
                selectedGuide: g.entityId,
                selectedModule: g.modules?.[0],
                selectedStep: g.steps?.[0],
                selectedPageUrl: window.location.href,
                endingCriteria: {
                  dismissSelection: true,
                  closeSidebar: false,
                  navigateAway: true,
                },
              });
            }

            if (g?.isSideQuest && isAnnouncement(g.designType)) {
              setIsSidebarExpanded(false);
            }
          },
        ])
      ),
    [availableGuides, previousGuides, formFactor, dispatch]
  );

  const { colsClass, cols } = useResponsiveCards({
    containerRef,
    /** Passing 'inline' for full responsiveness. */
    formFactor: EmbedFormFactor.inline,
    maxInlineCols: 3,
  });

  const gridClasses = useMemo(
    () =>
      cx('grid', 'mb-4', 'mr-2', 'content-start', 'gap-x-4', {
        [colsClass]: !expandedList,
      }),
    [colsClass, expandedList]
  );

  const guideLists: (GuideListProps & { shouldHide: boolean })[] =
    useMemo(() => {
      return [
        {
          icon: <ListAltIcon className="resource-center-icon-w" />,
          guides: availableGuides,
          forcedGuidesShown: availableGuides.filter(
            (g) => isEverboarding(g.designType) && !isFinishedGuide(g)
          ).length,
          type: GuidesListEnum.onboarding,
          shouldHide: false,
        },
        {
          icon: <FileCabinetIcon className="resource-center-icon-w" />,
          guides: previousGuides.onboarding,
          type: GuidesListEnum.previousOnboarding,
        },
        {
          icon: <CampaignIcon className="resource-center-icon-w" />,
          guides: previousGuides.announcements,
          type: GuidesListEnum.previousAnnouncement,
        },
      ].map((args) => ({
        formFactor: renderedFormFactor!,
        guidesDetails,
        title: allGuidesStyle[guideListConfig[args.type].key],
        guideSelectedHandlers,
        onViewAll: (type: GuidesListEnum) => {
          uiActions.handleShowMoreActiveGuides(type);
        },
        viewAll: args.type === expandedList,
        shouldHide: args.guides.length === 0,
        hideCards: !args.forcedGuidesShown && isShowingSerialCYOA && cols === 1,
        ...args,
        ...(expandedList && {
          shouldHide: expandedList !== args.type,
          icon: <LeftArrow className="w-5 cursor-pointer hover:opacity-80" />,
          title: allGuidesStyle[guideListConfig[GuidesListEnum.all].key],
        }),
      }));
    }, [
      availableGuides,
      previousGuides,
      expandedList,
      renderedFormFactor,
      guidesDetails,
      guideSelectedHandlers,
      uiActions,
      isInline,
      isShowingSerialCYOA,
      cols,
      allGuidesStyle,
    ]);

  /**
   * Hide RC elements and only allow success state for inlines
   */
  const rcEnabled = isSidebar || showResourceCenterInline(inlineEmptyBehaviour);

  return (
    <div
      className="mb-4 pb-4 border-gray-100"
      style={{
        display: 'inline-grid',
        width: '100%',
        animation: 'fadeIn 1s',
        marginBottom: overriddenMarginBottomPx
          ? px(overriddenMarginBottomPx)
          : undefined,
      }}
    >
      {availableGuides.length + previousGuides.total === 0 ? (
        <>
          <SuccessBanner
            renderingStyle="inline"
            className={cx({ 'mt-4': isInlineRendered })}
          />
          <CYOAPath />
        </>
      ) : (
        <>
          <div className="bento-resource-center-header-wrapper">
            {isInlineRendered && rcEnabled && (
              <div
                className={cx(
                  'text-2xl font-semibold',
                  'bento-resource-center-title-text',
                  {
                    'mb-6': !isShowingSerialCYOA || isActiveGuidesSubView(view),
                  }
                )}
              >
                {allGuidesStyle[guideListConfig[viewToGuideListMap[view]!].key]}
              </div>
            )}
            {view === View.activeGuides && (
              <>
                <SuccessBanner
                  renderingStyle="inline"
                  className={cx({
                    'my-4': isInlineRendered,
                    'mb-4': !isInlineRendered,
                  })}
                />
                <CYOAPath />
              </>
            )}
          </div>
          {isSidebar && !expandedList && (
            <HelpCenterSearch
              helpCenter={helpCenter}
              kbSearchEnabled={kbSearchEnabled}
            />
          )}
          {rcEnabled && (
            <div className={cx(gridClasses, 'gap-y-10')} ref={setContainerRef}>
              {guideLists.map(
                ({ shouldHide, ...listProps }) =>
                  !shouldHide && (
                    <GuideList key={`${listProps.type}-list`} {...listProps} />
                  )
              )}
            </div>
          )}

          {!expandedList && rcEnabled && (
            <QuickLinks
              quickLinks={quickLinks}
              isSidebar={isSidebar}
              primaryColorHex={primaryColorHex}
              fontColorHex={fontColorHex}
              className={cx(gridClasses, 'gap-y-4', {
                'mt-10': !isSidebar,
                'mt-8': isSidebar,
              })}
            />
          )}
        </>
      )}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withLocation,
  withUIState,
  withCustomUIContext,
  withSidebarContext,
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { appLocation, formFactor, sidebarVisibility }) => {
      const availableGuides = availableGuidesSelector(
        state,
        appLocation.href,
        formFactor
      );
      const previousGuides = previousGuidesSelector(
        state,
        sidebarVisibility,
        appLocation.href,
        formFactor
      );

      return {
        guide: selectedGuideForFormFactorSelector(state, formFactor),
        serialCyoaData: lastSerialCyoaInfoSelector(state, formFactor),
        guidesDetails: guidesDetailsSelector(state, [
          ...availableGuides,
          ...previousGuides.onboarding,
          ...previousGuides.announcements,
        ]),
        availableGuides,
        previousGuides,
        dispatch: state.dispatch,
      };
    }
  ),
])(ActiveGuides);
