import React, { ReactNode, useCallback, useMemo } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverProps,
} from '@chakra-ui/react';
import { graphql } from 'react-relay';
import pick from 'lodash/pick';
import { useRouter } from 'next/router';

import {
  AtLeast,
  CardStyle,
  FormFactorStyle,
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  InlineEmbedState,
  RulesDisplayType,
  Theme,
  VisualTagHighlightSettings,
  VisualTagPulseLevel,
} from 'bento-common/types';
import PopoverContent from 'system/PopoverContent';
import { ExtendedCalloutTypes } from 'bento-common/types/slate';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import {
  GroupTargeting,
  GroupTargetingSegment,
} from 'bento-common/types/targeting';
import Portal from 'bento-common/components/Portal';
import { audienceRuleToAudience } from 'bento-common/utils/targeting';

import QueryRenderer from 'components/QueryRenderer';
import { TemplateDetailsPopoverQuery } from 'relay-types/TemplateDetailsPopoverQuery.graphql';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import colors from 'helpers/colors';
import PreviewTag from 'components/Previews/PreviewTag';
import CYOAImage from 'icons/CYOA';
import { CONTEXTUAL_COMPONENT_OPTIONS } from '../Library/library.constants';
import { formatContextualKey } from '../Library/library.helpers';
import useSelectedAudience, { Audiences } from 'hooks/useSelectedAudience';
import CircularBadge from 'system/CircularBadge';
import { BranchingQuestions } from 'queries/BranchingQuestionsQuery';
import AudienceRulesDisplay from 'components/Templates/AudienceGroupRulesDisplay';
import { getLocationShown } from 'components/TableRenderer/tables.helpers';
import {
  announcementStyleOptions,
  themeOptions,
} from '../Library/LibraryCreateModal/helpers';
import { MuiSvgIcon } from 'types';
import { DETAILS_POPOVER_TRIGGER_DELAY } from 'helpers/constants';
import { isDesignType, isFormFactor } from 'helpers/transformedHelpers';

interface ContainerProps extends PopoverProps {
  templateEntityId: string;
  /** Optional: reduces a server ping if passed. */
  audiences?: Audiences;
  /** Optional: reduces a server ping if passed. */
  branchingQuestions?: BranchingQuestions;
  /** Trigger for popover */
  children?: React.ReactNode;
}

type TemplateDetailsPopoverQueryResponse =
  TemplateDetailsPopoverQuery['response'];

interface Props extends TemplateDetailsPopoverQueryResponse, ContainerProps {}

type LayoutInfo = {
  title: ReactNode;
  ImgComponent: MuiSvgIcon;
};

const getLayoutInfo = ({
  theme,
  formFactorStyle,
  formFactor,
  isCyoa,
}: {
  theme: Theme;
  formFactorStyle: FormFactorStyle;
  formFactor: GuideFormFactor;
  isCyoa: boolean;
}): LayoutInfo => {
  let option: AtLeast<any, 'ImgComponent' | 'title'>;

  /** Modal, banner. */
  option = announcementStyleOptions.find((o) => o.type === formFactor);
  if (option) return pick(option, ['title', 'ImgComponent']);
  /** Sidebar, tooltip, carousel, verticalCard, horizontalCard */
  option = Object.values(CONTEXTUAL_COMPONENT_OPTIONS).find(
    (o) =>
      o.type ===
      formatContextualKey(
        formFactor,
        theme,
        (formFactorStyle as CardStyle).stepBodyOrientation
      )
  );
  if (option) return pick(option, ['title', 'ImgComponent']);
  /** Flat, compact, timeline. */
  option = themeOptions.find((o) => theme !== Theme.nested && o.type === theme);
  if (option) return pick(option, ['title', 'ImgComponent']);

  return isCyoa
    ? { title: 'CYOA', ImgComponent: CYOAImage }
    : pick(
        themeOptions.find((o) => o.type === Theme.nested),
        ['title', 'ImgComponent']
      );
};

export const Section: React.FC<{
  label: ReactNode;
  variant?: 'primary' | 'secondary';
  children?: ReactNode;
}> = ({ label, variant = 'primary', children }) => (
  <Flex gap="4">
    <Box
      w="70px"
      minW="70px"
      fontWeight={variant === 'primary' ? 'bold' : 'normal'}
      color="gray.800"
      fontSize="xs"
    >
      {label}
    </Box>
    <Box
      fontWeight="normal"
      flex="1"
      color={colors.text.secondary}
      fontSize="xs"
    >
      {children}
    </Box>
  </Flex>
);

function TemplateDetailsPopover({
  template,
  templateEntityId,
  orgInlineEmbeds: [orgInlineEmbed],
  uiSettings,
  audiences,
  branchingQuestions,
}: Props) {
  const {
    taggedElements,
    theme,
    formFactor,
    isCyoa,
    formFactorStyle,
    pageTargetingType,
    pageTargetingUrl,
    inlineEmbed,
  } = template;
  const tag = taggedElements?.[0];
  const {
    tagPrimaryColor,
    tagDotSize,
    tagPulseLevel,
    tagBadgeIconBorderRadius,
    tagTextColor,
    tagBadgeIconPadding,
    tagCustomIconUrl,
  } = uiSettings || {};
  const router = useRouter();

  const LayoutInfo = getLayoutInfo({
    theme: theme as Theme,
    formFactor: formFactor as GuideFormFactor,
    formFactorStyle: formFactorStyle as FormFactorStyle,
    isCyoa,
  });

  const { selectedAudience } = useSelectedAudience({
    branchingQuestions,
    audiences,
    targets: template.targets as GroupTargeting,
  });

  const usedAudience = useMemo(() => {
    const audienceEntityId = audienceRuleToAudience(
      template.targets.audiences as GroupTargetingSegment
    );

    if (audienceEntityId)
      return audiences.find((a) => a.entityId === audienceEntityId);
  }, [template.targets, audiences]);

  const locationShown = getLocationShown({
    guideDesignType: template.designType as GuideDesignType,
    pageTargetingType: pageTargetingType as GuidePageTargetingType,
    pageTargetingUrl,
    tagWildcardUrl: taggedElements?.[0]?.wildcardUrl,
    inlineEmbedWildcardUrl: inlineEmbed?.wildcardUrl,
    orgInlineEmbedWildcardUrl: orgInlineEmbed?.wildcardUrl,
    orgInlineEmbedState: orgInlineEmbed?.state as InlineEmbedState,
  });

  const hasLayout =
    isDesignType.onboarding(template.designType) ||
    isFormFactor.sidebar(template.formFactor);

  const handleSeeDetails = useCallback(
    () =>
      usedAudience
        ? window.open(
            `/command-center/audiences/${usedAudience.entityId}`,
            '_blank'
          )
        : router.push(`/library/templates/${templateEntityId}?tab=launching`),
    [templateEntityId, usedAudience]
  );

  const displayAudience = usedAudience || selectedAudience;

  return (
    <Flex flexDir="column">
      <Box fontSize="sm" fontWeight="bold" mb="4" color="gray.800">
        Guide details
      </Box>
      <Flex flexDir="column" gap="6">
        {hasLayout && (
          <Section label="Layout">
            {LayoutInfo.title}
            <LayoutInfo.ImgComponent
              style={{
                width: 'auto',
                height: '64px',
                /** Fixes small gap in SVGs. */
                marginLeft: '-3px',
              }}
            />
          </Section>
        )}
        <Section label="Audience">
          <Accordion
            key={displayAudience?.entityId}
            defaultIndex={displayAudience?.name ? undefined : 0}
            allowToggle
          >
            <AccordionItem border="none">
              <AccordionButton
                display={displayAudience?.name ? 'flex' : 'none'}
                gap="1"
                fontSize="xs"
                p="0"
                mb="1"
              >
                <CircularBadge calloutType={ExtendedCalloutTypes.Audience} />
                <Box>{displayAudience?.name}</Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel p="0">
                <AudienceRulesDisplay
                  targets={
                    (usedAudience?.targets ??
                      template.targets) as GroupTargeting
                  }
                  gap="2"
                  type={RulesDisplayType.plain}
                  onSeeDetails={handleSeeDetails}
                  hideBlockedAccounts
                  compact
                  forceSeeDetails={!!usedAudience}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Section>
        <Flex flexDir="column" gap="1">
          <Section label="Location">
            {!locationShown &&
            pageTargetingType === GuidePageTargetingType.anyPage ? (
              'Any page'
            ) : (
              <Flex flexDir="column" gap="4" fontSize="xs">
                <Flex flexDir="column" gap="1" overflowWrap="anywhere">
                  <Box>Specific page</Box>
                  {locationShown ? (
                    wildcardUrlToDisplayUrl(locationShown)
                  ) : (
                    <i>Not set</i>
                  )}
                </Flex>
                {pageTargetingType === GuidePageTargetingType.visualTag && (
                  <Flex flexDir="column" gap="1">
                    <Box>Visual tag</Box>
                    {tag ? (
                      <Flex>
                        <PreviewTag
                          type={tag?.type as any}
                          primaryColor={tagPrimaryColor}
                          textColor={tagTextColor}
                          dotSize={tagDotSize}
                          tagPulseLevel={tagPulseLevel as VisualTagPulseLevel}
                          padding={tagBadgeIconPadding}
                          borderRadius={tagBadgeIconBorderRadius}
                          customIconUrl={tagCustomIconUrl}
                          style={tag?.style as VisualTagHighlightSettings}
                          mini
                        />
                      </Flex>
                    ) : (
                      'None'
                    )}
                  </Flex>
                )}
              </Flex>
            )}
          </Section>
        </Flex>
      </Flex>
    </Flex>
  );
}

const TEMPLATE_DETAILS_QUERY = graphql`
  query TemplateDetailsPopoverQuery($templateEntityId: EntityId!) {
    uiSettings {
      tagPrimaryColor
      tagTextColor
      tagDotSize
      tagPulseLevel
      tagBadgeIconPadding
      tagBadgeIconBorderRadius
      tagCustomIconUrl
    }
    template: findTemplate(entityId: $templateEntityId) {
      formFactor
      isCyoa
      designType
      description
      theme
      pageTargetingType
      pageTargetingUrl
      formFactorStyle {
        ...Guide_formFactorStyle @relay(mask: false)
      }
      taggedElements(checkFirstStepSupport: true) {
        entityId
        url
        wildcardUrl
        elementSelector
        type
        style {
          ...EditTag_taggedElementStyle @relay(mask: false)
        }
      }
      inlineEmbed {
        ...InlineEmbed_inlineEmbedWithTemplateId @relay(mask: false)
      }
      ...Template_targets @relay(mask: false)
    }
    orgInlineEmbeds: inlineEmbeds {
      entityId
      url
      wildcardUrl
      state
    }
  }
`;

export default function TemplateDetailsPopoverQueryRenderer(
  cProps: ContainerProps
) {
  const {
    templateEntityId,
    children,
    branchingQuestions,
    audiences,
    ...popoverProps
  } = cProps;
  if (!templateEntityId) return null;

  return (
    <Popover
      trigger="hover"
      placement="bottom-start"
      lazyBehavior="unmount"
      openDelay={DETAILS_POPOVER_TRIGGER_DELAY}
      isLazy
      {...popoverProps}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <Portal>
        <PopoverContent w="400px" disableClickPropagation>
          <PopoverBody>
            <QueryRenderer<TemplateDetailsPopoverQuery>
              query={TEMPLATE_DETAILS_QUERY}
              variables={{
                templateEntityId: cProps.templateEntityId,
              }}
              render={({ props }) => {
                return props?.template ? (
                  <TemplateDetailsPopover {...props} {...cProps} />
                ) : (
                  <Box my="2">
                    <BentoLoadingSpinner />
                  </Box>
                );
              }}
            />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
