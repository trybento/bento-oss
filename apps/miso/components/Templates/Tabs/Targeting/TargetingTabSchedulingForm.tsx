import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Link,
  Text,
} from '@chakra-ui/react';
import cx from 'classnames';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {
  isPST,
  roundToPSTDayStart,
  roundToPSTHour,
} from 'bento-common/utils/dates';
import { GuideExpirationCriteria, GuideFormFactor } from 'bento-common/types';

import EditorTabSection from '../EditorTabSection';
import Select, { SelectOptions } from 'system/Select';
import {
  dateWithTimeFormatter,
  useDateConstraints,
} from '../templateTabs.helpers';
import { useGuideSchedulingThrottling } from 'hooks/useFeatureFlag';
import Tooltip from 'system/Tooltip';
import RadioGroup from 'system/RadioGroup';
import Radio from 'system/Radio';
import NumberInput from 'system/NumberInput';
import PopoverTip from 'system/PopoverTip';
import DatePicker from '../../../DatePicker';
import { useTemplate } from 'providers/TemplateProvider';
import {
  isAnnouncementGuide,
  isSidebarGuide,
} from 'bento-common/utils/formFactor';

enum GuideExpirationType {
  guideCompletion = 'guide_completion',
  time = 'time',
}

const dateTypeImmediately = {
  label: 'When I launch this guide',
  value: 'immediately',
};
const dateTypeOnDate = { label: 'On a specific date', value: 'onDate' };
const dateTypeWhenPausedManually = {
  label: 'When I pause this guide',
  value: 'whenPausedManually',
};

const startDateTypeOptions = [dateTypeImmediately, dateTypeOnDate];
const startDateTypeOptionsThrottled = [dateTypeOnDate];
const endDateTypeOptions = [dateTypeWhenPausedManually, dateTypeOnDate];

const expireBasedOnOptions: SelectOptions<GuideExpirationCriteria>[] = [
  {
    label: 'days since it was launched',
    value: GuideExpirationCriteria.launch,
  },
  {
    label: 'days since last step completion',
    value: GuideExpirationCriteria.stepCompletion,
  },
];

const selectStyles = {
  container: (provided) => ({
    ...provided,
    flexGrow: 1,
  }),
};

type Props = {
  /** TEMP: render component without the editorSection */
  unwrap?: boolean;
};

export default function TargetingTabSchedulingForm({ unwrap }: Props) {
  const {
    template,
    launchSchedule,
    setLaunchSchedule,
    expirationCriteria,
    setExpirationCriteria,
    canEditTemplate,
  } = useTemplate();

  const throttlingEnabled = useGuideSchedulingThrottling();

  /**
   * NOTE: Announcements and sidebar contextual guides shouldn't have the ability to expire,
   * therefore we shouldn't show the expiry controls for them.
   */
  const canShowExpiryControls = useMemo(
    () =>
      !isAnnouncementGuide(template.formFactor as GuideFormFactor) &&
      !(
        template.isSideQuest &&
        isSidebarGuide(template.formFactor as GuideFormFactor)
      ),
    [template.formFactor, template.isSideQuest]
  );

  const { minStartDate, minEndDate } = useDateConstraints(
    launchSchedule.enableAutoLaunchAt
  );

  const selectedStartDate = useMemo<Date | null>(
    () =>
      launchSchedule.enableAutoLaunchAt &&
      new Date(launchSchedule.enableAutoLaunchAt),
    [launchSchedule.enableAutoLaunchAt]
  );
  const formattedStartDate = useMemo(
    () =>
      selectedStartDate &&
      dateWithTimeFormatter.format(
        throttlingEnabled
          ? roundToPSTHour(3, selectedStartDate)
          : selectedStartDate
      ),
    [selectedStartDate]
  );

  const selectedEndDate = useMemo<Date | null>(
    () =>
      launchSchedule.disableAutoLaunchAt &&
      new Date(launchSchedule.disableAutoLaunchAt),
    [launchSchedule.disableAutoLaunchAt]
  );
  const formattedEndDate = useMemo(
    () => dateWithTimeFormatter.format(selectedEndDate),
    [selectedEndDate]
  );

  const handleScheduleStartTypeChange = useCallback(
    (value) => {
      if (value === dateTypeImmediately) {
        setLaunchSchedule('enableAutoLaunchAt', null);
      } else {
        setLaunchSchedule('enableAutoLaunchAt', minStartDate.toISOString());
      }
    },
    [minStartDate]
  );

  const handleScheduleStartChange = useCallback((date) => {
    setLaunchSchedule(
      'enableAutoLaunchAt',
      date ? roundToPSTDayStart(date).toISOString() : null
    );
  }, []);

  const handleScheduleEndTypeChange = useCallback(
    (value) => {
      if (value === dateTypeWhenPausedManually) {
        setLaunchSchedule('disableAutoLaunchAt', null);
      } else {
        setLaunchSchedule('disableAutoLaunchAt', minEndDate.toISOString());
      }
    },
    [minEndDate]
  );

  const handleScheduleEndChange = useCallback((date) => {
    setLaunchSchedule(
      'disableAutoLaunchAt',
      date ? roundToPSTDayStart(date).toISOString() : null
    );
  }, []);

  const isPstTz = useMemo(() => isPST(), []);

  const handleExpirationTypeChange = useCallback(
    (type: GuideExpirationType) => {
      console.debug('[TargetingTab] type changed', { type });

      switch (type) {
        case GuideExpirationType.guideCompletion:
          setExpirationCriteria(GuideExpirationCriteria.never, null);
          break;

        case GuideExpirationType.time:
        default:
          setExpirationCriteria(GuideExpirationCriteria.launch, 60);
          break;
      }
    },
    [setExpirationCriteria]
  );

  const handleExpireBasedAfterChange = useCallback(
    (value: number) => {
      setExpirationCriteria(expirationCriteria.basedOn, value);
    },
    [setExpirationCriteria, expirationCriteria.basedOn]
  );

  const handleExpireBasedOnChange = useCallback(
    ({ value }: SelectOptions<GuideExpirationCriteria>) => {
      setExpirationCriteria(value, expirationCriteria.after);
    },
    [setExpirationCriteria, expirationCriteria.after]
  );

  const expirationType: GuideExpirationType =
    expirationCriteria.basedOn === GuideExpirationCriteria.never
      ? GuideExpirationType.guideCompletion
      : GuideExpirationType.time;

  const expireBasedOnSelectedOption = useMemo<SelectOptions>(
    () =>
      expireBasedOnOptions.find((o) => o.value === expirationCriteria.basedOn),
    [expirationCriteria.basedOn]
  );

  useEffect(() => {
    if (
      launchSchedule.disableAutoLaunchAt &&
      new Date(launchSchedule.disableAutoLaunchAt) < minEndDate
    ) {
      setLaunchSchedule('disableAutoLaunchAt', minEndDate.toISOString());
    }
  }, [launchSchedule.enableAutoLaunchAt, minEndDate]);

  useEffect(() => {
    if (
      launchSchedule.disableAutoLaunchAt &&
      new Date(launchSchedule.disableAutoLaunchAt) < minEndDate
    ) {
      setLaunchSchedule('disableAutoLaunchAt', minEndDate.toISOString());
    }
  }, [launchSchedule.enableAutoLaunchAt, minEndDate]);

  const Content = (
    <Flex gap={8} flexDirection="column">
      {/* Start and pause criteria */}
      <Flex gap={4}>
        <FormControl>
          <FormLabel htmlFor="templateEnableAutoLaunchAtType">
            Start launching
          </FormLabel>
          <Flex gap={2}>
            <Select
              inputId="templateEnableAutoLaunchAtType"
              options={
                throttlingEnabled
                  ? startDateTypeOptionsThrottled
                  : startDateTypeOptions
              }
              isDisabled={template.isAutoLaunchEnabled || !canEditTemplate}
              value={
                launchSchedule.enableAutoLaunchAt || throttlingEnabled
                  ? dateTypeOnDate
                  : dateTypeImmediately
              }
              onChange={handleScheduleStartTypeChange}
              styles={selectStyles}
            />
            {(!!launchSchedule.enableAutoLaunchAt || throttlingEnabled) && (
              <Box
                w="110px"
                className={cx({
                  disabled: !canEditTemplate || template.isAutoLaunchEnabled,
                })}
              >
                <DatePicker
                  selectedDate={selectedStartDate}
                  minDate={minStartDate}
                  disabled={!canEditTemplate || template.isAutoLaunchEnabled}
                  onChange={handleScheduleStartChange}
                  placeholderText="Select date"
                />
              </Box>
            )}
          </Flex>
          {template.isAutoLaunchEnabled ? (
            <Text fontSize="sm" mt={1} color="gray.600">
              This guide is currently launched
            </Text>
          ) : (
            !!launchSchedule.enableAutoLaunchAt && (
              <Text fontSize="sm" mt={1} color="gray.600">
                Guides will launch after {formattedStartDate}
                {!isPstTz && (
                  <Tooltip
                    placement="top"
                    label={`Scheduled launches begin at ${
                      throttlingEnabled ? '3AM' : '12AM'
                    } PST`}
                  >
                    <Box
                      as="span"
                      display="inline-block"
                      ml="1"
                      mt="1"
                      verticalAlign="top"
                    >
                      <InfoOutlined
                        fontSize="inherit"
                        style={{ verticalAlign: 'top' }}
                      />
                    </Box>
                  </Tooltip>
                )}
              </Text>
            )
          )}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="templateDisableAutoLaunchAtType">
            Stop launching
          </FormLabel>
          <Flex gap={2}>
            <Select
              inputId="templateDisableAutoLaunchAtType"
              options={endDateTypeOptions}
              value={
                launchSchedule.disableAutoLaunchAt
                  ? dateTypeOnDate
                  : dateTypeWhenPausedManually
              }
              isDisabled={!canEditTemplate}
              onChange={handleScheduleEndTypeChange}
              styles={selectStyles}
            />
            {!!launchSchedule.disableAutoLaunchAt && (
              <Box w="110px">
                <DatePicker
                  selectedDate={selectedEndDate}
                  minDate={minEndDate}
                  disabled={!canEditTemplate}
                  onChange={handleScheduleEndChange}
                  placeholderText="Select date"
                />
              </Box>
            )}
          </Flex>
          {!!launchSchedule.disableAutoLaunchAt && (
            <Text fontSize="sm" mt={1} color="gray.600">
              Guides will be paused after {formattedEndDate}
              {!isPstTz && (
                <Tooltip
                  placement="top"
                  label="Scheduled pauses process at 12AM PST"
                >
                  <Box
                    as="span"
                    display="inline-block"
                    ml="1"
                    mt="1"
                    verticalAlign="top"
                  >
                    <InfoOutlined
                      fontSize="inherit"
                      style={{ verticalAlign: 'top' }}
                    />
                  </Box>
                </Tooltip>
              )}
            </Text>
          )}
        </FormControl>
      </Flex>
      {/* Expiration criteria */}
      {canShowExpiryControls && (
        <Flex gap={4} flexDirection="column">
          <Flex direction="column" gap="2">
            <FormLabel htmlFor="guideExpirationType">
              When should this guide be hidden?
            </FormLabel>
            <RadioGroup
              id="guideExpirationType"
              defaultValue={GuideExpirationType.guideCompletion}
              alignment="horizontal"
              value={expirationType}
              onChange={handleExpirationTypeChange}
            >
              <Radio
                value={GuideExpirationType.guideCompletion}
                label="After user completes this guide"
              />
              <Radio
                value={GuideExpirationType.time}
                label="After a period of time"
              />
            </RadioGroup>
          </Flex>
          {[
            GuideExpirationCriteria.launch,
            GuideExpirationCriteria.stepCompletion,
          ].includes(expirationCriteria.basedOn) && (
            <Flex direction="column" gap="2">
              <FormLabel htmlFor="expireAfter">
                After what period of time?
                <PopoverTip placement="top" withPortal>
                  <Link
                    href="https://help.trybento.co/en/articles/7981047-guide-expiration"
                    target="_blank"
                  >
                    Learn more here
                  </Link>
                </PopoverTip>
              </FormLabel>
              <Flex gap={2}>
                <Box className="w-24">
                  <NumberInput
                    id="expireAfter"
                    defaultValue={60}
                    inputMode="numeric"
                    onChange={handleExpireBasedAfterChange}
                    value={expirationCriteria.after}
                    min={1}
                    max={999}
                    neverEmpty
                    minimalist
                    keepWithinRange
                    hideStepper
                  />
                </Box>
                <Select
                  inputId="expireBasedOn"
                  options={expireBasedOnOptions}
                  value={expireBasedOnSelectedOption}
                  onChange={handleExpireBasedOnChange}
                  styles={selectStyles}
                  className="max-w-xs"
                  isClearable={false}
                />
              </Flex>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );

  /** @todo fully deprecate editor tab section once launching revamp is GA */
  return unwrap ? (
    Content
  ) : (
    <EditorTabSection
      header="Duration: How long should it be live?"
      helperText="Any users who match your audience criteria during your launch window will receive this guide."
    >
      {Content}
    </EditorTabSection>
  );
}
