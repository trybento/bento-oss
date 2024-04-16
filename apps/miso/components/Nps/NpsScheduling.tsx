import React, { useCallback, useMemo } from 'react';
import { Flex, FormControl, FormLabel, Text } from '@chakra-ui/react';
import cx from 'classnames';

import {
  NpsEndingType,
  NpsStartingType,
  NpsSurveyState,
} from 'bento-common/types/netPromoterScore';
import { roundToPSTDayStart } from 'bento-common/utils/dates';

import Select, { SelectOptions } from 'system/Select';
import Box from 'system/Box';
import { useNpsProvider } from './NpsProvider';
import DatePicker from 'components/DatePicker';
import { useDateConstraints } from 'components/Templates/Tabs/templateTabs.helpers';
import { selectStyles } from './helpers';
import NumberInput from 'system/NumberInput';
import { useSelectedOption } from 'utils/helpers';

type Props = {
  disabled?: boolean;
};

const startingOptions: SelectOptions<NpsStartingType>[] = [
  {
    value: NpsStartingType.manual,
    label: 'When I launch it',
  },
  {
    value: NpsStartingType.dateBased,
    label: 'On a specific day',
  },
];
const endingOptions: SelectOptions<NpsEndingType>[] = [
  {
    label: 'When I stop it',
    value: NpsEndingType.manual,
  },
  {
    label: 'On a specific day',
    value: NpsEndingType.dateBased,
  },
  {
    label: 'After a number of responses',
    value: NpsEndingType.answerBased,
  },
];

const NpsScheduling: React.FC<Props> = ({ disabled }) => {
  const {
    startingType,
    startingTypeChange,
    endingType,
    endingTypeChange,
    startAt,
    startAtChange,
    endAt,
    endAtChange,
    state,
    endAfterTotalAnswers,
    endAfterTotalAnswersChange,
  } = useNpsProvider();

  const { minStartDate, minEndDate } = useDateConstraints(startAt);
  const isLaunched = state === NpsSurveyState.live;

  const handleStartAtChange = useCallback(
    (date) => {
      startAtChange(date ? roundToPSTDayStart(date).toISOString() : null);
    },
    [startAtChange]
  );

  const handleEndAtChange = useCallback(
    (date) => {
      endAtChange(date ? roundToPSTDayStart(date).toISOString() : null);
    },
    [endAtChange]
  );

  const handleStartingTypeChange = useCallback(
    (opt: SelectOptions<NpsStartingType>) => {
      startingTypeChange(opt.value);
    },
    [startingTypeChange]
  );

  const handleEndingTypeChange = useCallback(
    (opt: SelectOptions<NpsEndingType>) => {
      endingTypeChange(opt.value);
    },
    [endingTypeChange]
  );

  const selectedStartingType = useSelectedOption(startingOptions, startingType);
  const selectedEndingType = useSelectedOption(endingOptions, endingType);

  const selectedStartAt = useMemo(
    () => (startAt ? new Date(startAt) : null),
    [startAt]
  );
  const selectedEndAt = useMemo(
    () => (endAt ? new Date(endAt) : null),
    [endAt]
  );

  return (
    <Flex gap="8">
      <FormControl>
        <FormLabel htmlFor="npsStartAtType">Start launching</FormLabel>
        <Flex gap={2}>
          <Select
            inputId="npsStartAtType"
            options={startingOptions}
            isDisabled={disabled}
            value={selectedStartingType}
            onChange={handleStartingTypeChange}
            styles={selectStyles}
          />
          {startingType === NpsStartingType.dateBased && (
            <Box
              w="110px"
              className={cx({
                disabled: disabled,
              })}
            >
              <DatePicker
                selectedDate={selectedStartAt}
                minDate={minStartDate}
                disabled={disabled}
                onChange={handleStartAtChange}
                placeholderText="Select date"
              />
            </Box>
          )}
        </Flex>
        {isLaunched ? (
          <Text fontSize="sm" mt={1} color="gray.600">
            This survey is currently launched
          </Text>
        ) : null}
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="npsEndAtType">Stop launching</FormLabel>
        <Flex gap={2}>
          <Select
            inputId="npsEndAtType"
            options={endingOptions}
            isDisabled={disabled}
            value={selectedEndingType}
            onChange={handleEndingTypeChange}
            styles={selectStyles}
          />
          {endingType === NpsEndingType.dateBased ? (
            <Box
              w="110px"
              className={cx({
                disabled: disabled,
              })}
            >
              <DatePicker
                selectedDate={selectedEndAt}
                minDate={minEndDate}
                disabled={disabled}
                onChange={handleEndAtChange}
                placeholderText="Select date"
              />
            </Box>
          ) : endingType === NpsEndingType.answerBased ? (
            <Box>
              <NumberInput
                inputMode="numeric"
                min={0}
                onChange={endAfterTotalAnswersChange}
                value={endAfterTotalAnswers ?? 1000}
              />
            </Box>
          ) : null}
        </Flex>
      </FormControl>
    </Flex>
  );
};

export default NpsScheduling;
