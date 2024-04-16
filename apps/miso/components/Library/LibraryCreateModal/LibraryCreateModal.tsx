import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  RadioGroupProps,
  Accordion,
  FormHelperText,
  Link,
  Text,
  Flex,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import {
  ContextualComponentType,
  CreateGuideVariationEnum,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  StepBodyOrientation,
  Theme,
  OnCreateBehavior,
} from 'bento-common/types';
import {
  GuideCreateType,
  GUIDE_STYLE_LABELS,
  isNestedTheme,
  LibraryCreateEnum,
  LibraryCreateTooltipType,
  OnboardingEnum,
  ONBOARDING_LABELS,
  slugify,
  THEME_LABELS,
  TOOLTIP_LABELS,
} from 'bento-common/data/helpers';
import ModalBody from 'system/ModalBody';
import useToast from 'hooks/useToast';
import Box from 'system/Box';
import Button from 'system/Button';
import Radio from 'system/Radio';
import Badge, { BadgeStyle } from 'system/Badge';
import RadioGroup from 'system/RadioGroup';
import * as CreateTemplateMutation from 'mutations/CreateTemplate';
import {
  CONTEXTUAL_COMPONENT_OPTIONS,
  TEMPLATE_SCOPE_OPTIONS,
} from '../library.constants';
import CircularBadge from 'system/CircularBadge';
import ModalOptionsContainer from '../ModalOptionsContainer';
import { useOrganization } from 'providers/LoggedInUserProvider';
import {
  formatContextualKey,
  getPredefinedTemplateValues,
} from '../library.helpers';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';
import OptionCard, { OptionCardImgPosition } from './OptionCard';
import colors from 'helpers/colors';
import SimpleSelector from './SimpleSelector';
import {
  announcementStyleOptions,
  getDefaultThemeForCreateType,
  onboardingOptions,
  templateTypeOptions,
  themeOptions,
  tooltipOptions,
} from './helpers';
import { DYNAMIC_ACCORDION_ITEM_DELAY_MS } from 'utils/constants';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import ExtensionRequiredTooltip from 'components/WysiwygEditor/ExtensionRequiredTooltip';
import { useRouter } from 'next/router';

const EXTENSION_INSTALLED_REFRESH_MS = 2_000;

const componentTypes = Object.keys(CONTEXTUAL_COMPONENT_OPTIONS);

enum CreateNewStep {
  templateType = 'templateType',
  name = 'name',
}

const defaultTheme = Theme.flat;
const defaultScope = GuideTypeEnum.account;

interface TemplateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AnnouncementFormFactor = GuideFormFactor.banner | GuideFormFactor.modal;

type AccordionHelpers = {
  isHidden?: boolean;
  openHook?: (isHidden: boolean) => void;
};

export function GuideScopeSelector({
  defaultValue,
  selectedTemplateType,
  onChange,
  isHidden,
}: {
  defaultValue?: string;
  selectedTemplateType: GuideTypeEnum;
  onChange: (value: string) => void;
} & AccordionHelpers) {
  return (
    <ModalOptionsContainer
      header="Checklist scope"
      selectedLabel={TEMPLATE_SCOPE_OPTIONS[selectedTemplateType].label}
      isHidden={isHidden}
    >
      <RadioGroup
        defaultValue={defaultValue}
        onChange={onChange}
        alignment="vertical"
      >
        {Object.keys(TEMPLATE_SCOPE_OPTIONS).map((scopeType, i) => (
          <Box
            key={`template-scope-${i}`}
            backgroundColor="white"
            p="4"
            position="relative"
          >
            <Radio value={scopeType} w="full">
              <HStack w="full">
                <Box pl="2">
                  <Box>{TEMPLATE_SCOPE_OPTIONS[scopeType].label}</Box>

                  <Box fontSize="sm" color="gray.600">
                    {TEMPLATE_SCOPE_OPTIONS[scopeType].description}
                  </Box>
                </Box>
                <CircularBadge
                  calloutType={TEMPLATE_SCOPE_OPTIONS[scopeType].iconType}
                  width="35px"
                  height="35px"
                  position="absolute"
                  right="4"
                />
              </HStack>
            </Radio>
          </Box>
        ))}
      </RadioGroup>
    </ModalOptionsContainer>
  );
}

export function ContextualComponentSelector({
  selectedComponentType,
  selectedOrientation,
  selectedTheme,
  onChange,
  isHidden,
  openHook,
}: {
  selectedComponentType: ContextualComponentType;
  selectedOrientation: StepBodyOrientation | null;
  selectedTheme: Theme | null;
  onChange: (
    formFactor: GuideFormFactor,
    orientation: StepBodyOrientation | null,
    theme: Theme | null
  ) => void;
} & AccordionHelpers) {
  openHook?.(isHidden);

  const selectedKey = useMemo(
    () =>
      formatContextualKey(
        selectedComponentType,
        selectedTheme,
        selectedOrientation
      ),
    [selectedComponentType, selectedOrientation, selectedTheme]
  );

  const handleChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { type } = e.currentTarget.dataset;
      const predefinedTemplateValues = getPredefinedTemplateValues(type);
      if (predefinedTemplateValues)
        onChange(
          predefinedTemplateValues.formFactor,
          predefinedTemplateValues.orientation || null,
          predefinedTemplateValues.theme || null
        );
    },
    [onChange]
  );

  // Reset initial value.
  useEffect(() => {
    const predefinedTemplateValues = getPredefinedTemplateValues(
      componentTypes[0]
    );
    if (predefinedTemplateValues)
      onChange(
        predefinedTemplateValues.formFactor,
        predefinedTemplateValues.orientation || null,
        predefinedTemplateValues.theme || null
      );
  }, [componentTypes]);

  return (
    <ModalOptionsContainer
      header="Contextual guide type"
      selectedLabel={CONTEXTUAL_COMPONENT_OPTIONS[selectedKey]?.title || ''}
      isHidden={isHidden}
    >
      <Box display="flex" flexDir="row" gap={4} flexWrap="wrap">
        {componentTypes.map((opt, i) => {
          const slug = slugify(CONTEXTUAL_COMPONENT_OPTIONS[opt].title);
          return (
            <OptionCard
              id={`contextual-type-${slug}`}
              key={`contextual-type-${i}-${slug}`}
              {...CONTEXTUAL_COMPONENT_OPTIONS[opt]}
              isSelected={
                selectedKey === CONTEXTUAL_COMPONENT_OPTIONS[opt].type
              }
              onClick={handleChange}
              p="0"
              maxWidth="260px"
            />
          );
        })}
      </Box>
    </ModalOptionsContainer>
  );
}

export type GuideThemeSelectorProps = {
  defaultValue: Theme;
  selectedGuideTheme: Theme;
  orgDefault: Theme;
  orgName: string;
  onChange: (value: Theme) => void;
  isChangingTheme?: {
    from: Theme;
    to: Theme;
  };
} & AccordionHelpers;

export const GuideThemeSelector = ({
  defaultValue,
  selectedGuideTheme,
  onChange,
  orgDefault,
  orgName,
  isChangingTheme: _isChangingTheme,
  isHidden,
}: GuideThemeSelectorProps) => {
  const handleChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { type } = e.currentTarget.dataset;
      onChange(type as Theme);
    },
    [onChange]
  );

  return (
    <ModalOptionsContainer
      header="Checklist layout"
      selectedLabel={THEME_LABELS[selectedGuideTheme]}
      isHidden={isHidden}
    >
      <Box
        display="grid"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        gridGap="2"
      >
        {themeOptions.map(({ title, ...restOption }, i) => (
          <Box
            key={`template-theme-${i}`}
            position="relative"
            flex="1"
            alignSelf="stretch"
          >
            <OptionCard
              key={`template-use-case-${i}`}
              {...restOption}
              title={
                <>
                  {title}
                  {restOption.type === orgDefault && (
                    <Badge
                      label={`${orgName} default`}
                      variant={BadgeStyle.active}
                      ml="1"
                      my="auto"
                    />
                  )}
                </>
              }
              isSelected={defaultValue === restOption.type}
              onClick={handleChange}
              imagePos={OptionCardImgPosition.inline}
              p="0"
            />
          </Box>
        ))}
      </Box>
    </ModalOptionsContainer>
  );
};

const AnnouncementStyleSelector: React.FC<
  Omit<RadioGroupProps, 'children'> & AccordionHelpers
> = ({ onChange, defaultValue, isHidden, openHook }) => {
  openHook?.(isHidden);

  const selectedLabel = useMemo(() => {
    return (
      announcementStyleOptions.find((o) => o.type === defaultValue)?.title || ''
    );
  }, [defaultValue]);

  const handleChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { type } = e.currentTarget.dataset;
      onChange(type as Theme);
    },
    [onChange]
  );

  return (
    <ModalOptionsContainer
      header="Announcement type"
      selectedLabel={selectedLabel}
      isHidden={isHidden}
    >
      <Box display="flex" flexDir="row" gap={4}>
        {announcementStyleOptions.map((opt, i) => (
          <OptionCard
            key={`template-use-case-${i}`}
            {...opt}
            isSelected={defaultValue === opt.type}
            onClick={handleChange}
            flex="none"
            flexBasis="280px"
            p="0"
          />
        ))}
      </Box>
    </ModalOptionsContainer>
  );
};

export default function LibraryCreateModal({
  isOpen,
  onClose,
}: TemplateDetailsModalProps) {
  const router = useRouter();
  const extension = useChromeExtensionInstalled();

  useEffect(() => {
    if (!extension.installed) {
      const interval = window.setInterval(
        extension.refresh,
        EXTENSION_INSTALLED_REFRESH_MS
      );

      return () => window.clearInterval(interval);
    }
  }, [extension.installed]);

  const uiSettings = useUISettings('store-or-network');
  const defaultOnboardingTheme = (uiSettings?.theme as Theme) || defaultTheme;
  const {
    organization: { name: orgName },
  } = useOrganization();

  const toast = useToast();

  const [selectedType, setSelectedType] = useState<null | GuideCreateType>(
    null
  );
  const [accordionIndex, setAccordionIndex] = useState<number>(0);
  /* Determine accordion auto-expand */
  const [autoOpen, setAutoOpen] = useState(true);
  const [stepOrientation, setStepOrientation] =
    useState<StepBodyOrientation | null>(null);
  const [selectedTemplateType, setSelectedTemplateType] =
    useState<null | GuideTypeEnum>(defaultScope);
  const [announcementFormFactor, setAnnouncementFormFactor] =
    useState<AnnouncementFormFactor>(GuideFormFactor.modal);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    defaultOnboardingTheme
  );
  const [name, setName] = useState(null);

  const [onboardingType, setOnboardingType] = useState<OnboardingEnum | null>(
    null
  );
  const [tooltipType, setTooltipType] =
    useState<LibraryCreateTooltipType | null>(LibraryCreateTooltipType.tooltip);
  const [contextualComponentType, setContextualComponentType] =
    useState<null | ContextualComponentType>(GuideFormFactor.sidebar);
  const [step, setStep] = useState<CreateNewStep>(CreateNewStep.templateType);

  const isOnboarding = selectedType === LibraryCreateEnum.guide;
  const isOnboardingChecklist =
    isOnboarding && onboardingType === OnboardingEnum.guide;
  const isCyoa = isOnboarding && onboardingType === OnboardingEnum.cyoa;

  const isTooltipOrFlow = selectedType === LibraryCreateEnum.tooltipsAndFlows;
  const isTooltipGuide =
    isTooltipOrFlow && tooltipType === LibraryCreateTooltipType.tooltip;
  const isFlow =
    isTooltipOrFlow && tooltipType === LibraryCreateTooltipType.flow;

  const isContextualSelection =
    selectedType === LibraryCreateEnum.everboarding || isTooltipOrFlow;

  const isCard = selectedTheme === Theme.card;

  const isCarousel = selectedTheme === Theme.carousel;
  const isVideoGallery = selectedTheme === Theme.videoGallery;

  const isContextualChecklist =
    selectedType === LibraryCreateEnum.everboarding &&
    isNestedTheme(selectedTheme);

  const showTemplateNameHelper = !isTooltipOrFlow;

  const showBuildWithAI =
    isOnboardingChecklist || isContextualChecklist || isFlow;

  const showBuildInApp = isTooltipOrFlow;

  const showCreateOption =
    step === CreateNewStep.templateType && (showBuildWithAI || showBuildInApp);

  const showSettings = useMemo(
    () => ({
      scope: isOnboarding,
      onboardingOptions: isOnboarding,
      tooltipOptions: isTooltipOrFlow,
      theme: isOnboardingChecklist,
      name: false,
    }),
    [isOnboarding, isOnboardingChecklist, isTooltipOrFlow]
  );

  const [onCreateBehavior, setOnCreateBehavior] = useState<
    OnCreateBehavior | undefined
  >();

  const handleNextOrCreate = useCallback(async () => {
    const customNameAllowed = isContextualSelection || isOnboarding || isFlow;

    if (customNameAllowed && step === CreateNewStep.templateType) {
      setStep(CreateNewStep.name);
      return;
    }

    const contextualGuideTargetingType = isTooltipOrFlow
      ? GuidePageTargetingType.visualTag
      : isContextualSelection
      ? contextualComponentType === GuideFormFactor.inline
        ? GuidePageTargetingType.inline
        : contextualComponentType === GuideFormFactor.sidebar
        ? GuidePageTargetingType.specificPage
        : GuidePageTargetingType.visualTag
      : undefined;

    const result = await CreateTemplateMutation.commit({
      variation:
        stepOrientation === StepBodyOrientation.vertical
          ? CreateGuideVariationEnum.vertical
          : CreateGuideVariationEnum.horizontal,
      // @ts-ignore
      templateData: {
        isCyoa: isCyoa,
        theme: selectedTheme,
        type: selectedTemplateType,
        ...(isCyoa && {
          /**
           * Needs to be flat layout to prevent users from
           *   editing/adding/removing step groups
           */
          theme: defaultTheme,
        }),
        ...((isContextualSelection || isOnboarding) && { name }),
        ...(isContextualSelection && {
          type: GuideTypeEnum.user,
          formFactor: isTooltipGuide
            ? GuideFormFactor.tooltip
            : contextualComponentType,
          isSideQuest: true,
          description: '',
          pageTargetingType: contextualGuideTargetingType,
        }),
        ...(selectedType === LibraryCreateEnum.announcements && {
          type: GuideTypeEnum.user,
          formFactor: announcementFormFactor,
          isSideQuest: true,
        }),
        ...(isFlow && {
          type: GuideTypeEnum.user,
          formFactor: GuideFormFactor.flow,
          isSideQuest: true,
        }),
      },
    });

    const createdTemplate = result?.createTemplate?.template;

    if (createdTemplate) {
      router.push(
        `/library/templates/${createdTemplate.entityId}${
          onCreateBehavior ? `?behavior=${onCreateBehavior}` : ''
        }`
      );

      const typeOption =
        templateTypeOptions.find((opt) => opt.type === selectedType) ||
        templateTypeOptions[0];

      toast({
        title: `${typeOption.title} template created!`,
        isClosable: true,
        status: 'success',
      });
    }

    onClose();
  }, [
    selectedType,
    selectedTemplateType,
    stepOrientation,
    announcementFormFactor,
    contextualComponentType,
    selectedTheme,
    isCyoa,
    isContextualSelection,
    isTooltipGuide,
    isTooltipOrFlow,
    isFlow,
    name,
    step,
    onCreateBehavior,
  ]);

  const handleBuildInApp = useCallback(() => {
    setOnCreateBehavior(OnCreateBehavior.openVisualBuilder);
    handleNextOrCreate();
  }, [handleNextOrCreate]);

  const handleBuildWithAI = useCallback(() => {
    setOnCreateBehavior(OnCreateBehavior.openAiModal);
    handleNextOrCreate();
  }, [handleNextOrCreate]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNextOrCreate();
      }
    },
    [handleNextOrCreate]
  );

  const handleGoBack = useCallback(() => {
    setStep(CreateNewStep.templateType);
    setName('');
  }, [step, contextualComponentType]);

  const handleAccordionChange = useCallback(
    (expandedIndex: number) => {
      if (accordionIndex === expandedIndex) return;
      // Delay used to avoid having two items expanded
      // at the same time which may cause a scrollbar to
      // briefly appear in small screens.
      let delayMs = 10;
      if (accordionIndex !== -1) {
        delayMs = DYNAMIC_ACCORDION_ITEM_DELAY_MS;
        setAccordionIndex(-1);
      }
      setTimeout(() => setAccordionIndex(expandedIndex), delayMs);
    },
    [accordionIndex]
  );

  const handleStyleSelection = useCallback(
    (value: GuideCreateType) => {
      setSelectedType(value);
      setSelectedTheme(
        getDefaultThemeForCreateType(value, defaultOnboardingTheme)
      );

      const predefinedTemplateValues = getPredefinedTemplateValues(value);
      if (predefinedTemplateValues) {
        handleContextualComponentSelection(
          predefinedTemplateValues.formFactor as ContextualComponentType,
          predefinedTemplateValues.orientation,
          predefinedTemplateValues.theme
        );
      } else {
        setAutoOpen(true);
      }
    },
    [setAutoOpen, defaultOnboardingTheme]
  );

  const handleScopeSelection = useCallback((value: GuideTypeEnum) => {
    setSelectedTemplateType(value);
  }, []);

  const handleThemeSelection = useCallback((value: Theme) => {
    setSelectedTheme(value);
  }, []);

  const handleAnnouncementStyleSelection = useCallback((value: string) => {
    setAnnouncementFormFactor(value as AnnouncementFormFactor);
  }, []);

  const handleContextualComponentSelection = useCallback(
    (
      formFactor: ContextualComponentType,
      orientation: StepBodyOrientation | null,
      theme: Theme | null
    ) => {
      setContextualComponentType(formFactor);
      setStepOrientation(orientation);
      setSelectedTheme(theme);
    },
    []
  );

  const incompleteForm = useMemo(
    () => !selectedType || (isOnboarding && !onboardingType),
    [selectedType, step, name, isOnboarding, onboardingType]
  );

  /**
   * Pass down to auto open when unhidden
   * Currently only pass to guide subtype settings as those are the only
   *   ones that should auto expand when a guide type is selected
   * `i` needs to be the proper accordion index to select the correct section
   */
  const handleOpenHook = useCallback(
    (i: number) => (isHidden: boolean) => {
      if (!isHidden && autoOpen) {
        handleAccordionChange(i);
        setAutoOpen(false);
      }
    },
    [autoOpen, handleAccordionChange]
  );

  const modalTitle = useMemo(() => {
    let type = '';

    if (step === CreateNewStep.name) {
      if (isContextualChecklist || isOnboardingChecklist) {
        type = 'checklist';
      } else if (isCyoa) {
        type = 'CYOA';
      } else if (isCard) {
        type = 'card';
      } else if (isCarousel) {
        type = 'carousel';
      } else if (isVideoGallery) {
        type = 'video gallery';
      } else if (isTooltipGuide) {
        type = 'tooltip';
      } else if (isFlow) {
        type = 'flow';
      }
    }

    return `Create new ${type}`;
  }, [
    step,
    isContextualChecklist,
    isOnboardingChecklist,
    isCyoa,
    isCard,
    isCarousel,
    isVideoGallery,
    isTooltipGuide,
    isFlow,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      autoFocus={false}
      size={step === 'name' ? 'xl' : '4xl'}
      id="library-create-new"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        {step === CreateNewStep.templateType ? (
          <ModalBody>
            <Accordion
              defaultIndex={0}
              allowToggle
              onChange={handleAccordionChange}
              index={accordionIndex}
              allowMultiple={false}
            >
              <SimpleSelector
                header="Guide type"
                selectedValue={selectedType as any}
                onChange={handleStyleSelection}
                labels={GUIDE_STYLE_LABELS}
                options={templateTypeOptions as any}
              />
              <AnnouncementStyleSelector
                onChange={handleAnnouncementStyleSelection}
                defaultValue={announcementFormFactor}
                isHidden={selectedType !== LibraryCreateEnum.announcements}
                openHook={handleOpenHook(1)}
              />
              <SimpleSelector
                header="Tooltip and flows type"
                selectedValue={tooltipType}
                onChange={setTooltipType}
                labels={TOOLTIP_LABELS}
                options={tooltipOptions}
                isHidden={!showSettings.tooltipOptions}
                openHook={handleOpenHook(2)}
              />
              <SimpleSelector
                header="Onboarding type"
                selectedValue={onboardingType}
                onChange={setOnboardingType}
                labels={ONBOARDING_LABELS}
                options={onboardingOptions}
                isHidden={!showSettings.onboardingOptions}
                openHook={handleOpenHook(3)}
              />
              <ContextualComponentSelector
                selectedComponentType={contextualComponentType}
                selectedOrientation={stepOrientation}
                selectedTheme={selectedTheme}
                onChange={handleContextualComponentSelection}
                isHidden={selectedType !== LibraryCreateEnum.everboarding}
                openHook={handleOpenHook(4)}
              />
              <GuideScopeSelector
                selectedTemplateType={selectedTemplateType}
                defaultValue={defaultScope}
                onChange={handleScopeSelection}
                isHidden={!showSettings.scope}
              />
              <GuideThemeSelector
                selectedGuideTheme={selectedTheme}
                defaultValue={selectedTheme}
                onChange={handleThemeSelection}
                orgDefault={uiSettings?.theme as Theme}
                orgName={orgName}
                isHidden={!showSettings.theme}
              />
              <ModalOptionsContainer
                header="Guide name"
                selectedLabel={''}
                isHidden={!showSettings.name}
              >
                <Input
                  type="text"
                  id="new-template-name"
                  placeholder="Enter the name of your guide"
                  fontSize="sm"
                  value={name}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              </ModalOptionsContainer>
            </Accordion>
            {/* Inspiration library callout */}
            {!selectedType && (
              <Box className="flex gap-1 items-center my-4 border border-gray-200 p-4 rounded-md">
                <LightbulbOutlinedIcon
                  fontSize="small"
                  style={{ color: colors.bento.bright }}
                />
                <Text>Not sure where to start?</Text>
                <Link
                  href="https://www.trybento.co/inspiration?utm_source=bento_app&utm_medium=website"
                  target="_blank"
                  className="flex gap-1 items-center font-semibold"
                  color="bento.bright"
                >
                  <Text>View our inspiration gallery</Text>
                  <OpenInNewIcon fontSize="small" />
                </Link>
              </Box>
            )}
            {/* end */}
          </ModalBody>
        ) : (
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="new-template-name">Title</FormLabel>
              <Input
                type="text"
                autoFocus
                id="new-template-name"
                placeholder="e.g. Have you tried using feature X?"
                fontSize="sm"
                value={name}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              {showTemplateNameHelper && (
                <FormHelperText fontSize="xs">
                  Visible to your users. You can change it later.
                </FormHelperText>
              )}
            </FormControl>
          </ModalBody>
        )}
        <ModalFooter borderTop="1px solid #EDF2F7">
          <Flex gap="2" w="full" justifyContent="flex-end" alignItems="center">
            {showCreateOption ? (
              <>
                {showBuildWithAI && (
                  <ExtensionRequiredTooltip
                    isDisabled={!isFlow || extension.installed}
                    withPortal={false}
                  >
                    <Button
                      variant="secondary"
                      onClick={handleBuildWithAI}
                      isDisabled={
                        incompleteForm || (isFlow && !extension.installed)
                      }
                      fontWeight="bold"
                    >
                      ✨Build with AI
                    </Button>
                  </ExtensionRequiredTooltip>
                )}
                {!showBuildInApp && (
                  <Button
                    variant="solid"
                    isDisabled={incompleteForm}
                    onClick={handleNextOrCreate}
                  >
                    Next
                  </Button>
                )}
                {showBuildInApp && (
                  <ExtensionRequiredTooltip
                    isDisabled={extension.installed}
                    withPortal={false}
                  >
                    <Button
                      isDisabled={incompleteForm || !extension.installed}
                      onClick={handleBuildInApp}
                    >
                      Next
                    </Button>
                  </ExtensionRequiredTooltip>
                )}
              </>
            ) : (
              <>
                {step !== CreateNewStep.templateType && (
                  <Button variant="secondary" onClick={handleGoBack}>
                    Back
                  </Button>
                )}
                <Button
                  isDisabled={incompleteForm}
                  onClick={handleNextOrCreate}
                >
                  {!(isContextualSelection || isOnboarding || isFlow) ||
                  step === CreateNewStep.name
                    ? 'Create'
                    : 'Next'}
                </Button>
              </>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
