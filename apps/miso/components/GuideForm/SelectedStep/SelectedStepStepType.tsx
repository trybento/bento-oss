import { Box, BoxProps, Switch, Text } from '@chakra-ui/react';
import { isInputStep } from 'bento-common/data/helpers';
import { StepType } from 'bento-common/types';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import {
  MODULE_ALIAS_SINGULAR,
  STEP_TYPE_LABELS,
  STEP_TYPE_SUB_LABELS,
} from 'helpers/constants';
import React, { useCallback, useMemo } from 'react';
import Select, {
  OptionWithSubLabel,
  SelectOptions,
  ExtendedSelectOptions,
} from 'system/Select';
import Tooltip from 'system/Tooltip';
import { isOptionalStep } from 'utils/helpers';

const STEP_TYPE_OPTIONS: ExtendedSelectOptions[] = [
  {
    label: STEP_TYPE_LABELS[StepType.required],
    subLabel: STEP_TYPE_SUB_LABELS[StepType.required],
    value: StepType.required,
  },
  {
    label: STEP_TYPE_LABELS[StepType.fyi],
    subLabel: STEP_TYPE_SUB_LABELS[StepType.fyi],
    value: StepType.fyi,
  },
  {
    label: STEP_TYPE_LABELS[StepType.input],
    subLabel: STEP_TYPE_SUB_LABELS[StepType.input],
    value: StepType.input,
  },
  {
    label: STEP_TYPE_LABELS[StepType.branching],
    subLabel: `Conditionally add a guide or ${MODULE_ALIAS_SINGULAR}, based on user choice`,
    value: StepType.branching,
  },
];

/** Text that appears in the toggle next to the step type */
const STEP_TYPE_SUBTEXT = {
  [StepType.required]:
    'All required steps must be completed before the next guide is shown',
  [StepType.optional]:
    'A user can choose to skip this step and still get the next guide',
  ['accountRequired']:
    'New users will be taken through this account guide until all steps are completed',
};

interface SelectedStepStepTypeProps {
  stepType: StepType;
  onTypeChange: (value: SelectOptions) => void;
  disabled?: boolean;
  accountGuideEditor?: boolean;
  stepTypeAllowList?: StepType[];
  hideRequiredToggle?: boolean;
}

type Props = SelectedStepStepTypeProps & BoxProps;

const SelectedStepStepType: React.FC<Props> = ({
  stepType,
  onTypeChange,
  disabled,
  accountGuideEditor,
  hideRequiredToggle,
  stepTypeAllowList = [],
  ...boxProps
}) => {
  const dropdownValue: SelectOptions = useMemo(() => {
    let _stepType;
    switch (stepType) {
      case StepType.optional:
        _stepType = StepType.required;
        break;

      case StepType.branchingOptional:
        _stepType = StepType.branching;
        break;

      default:
        _stepType = stepType;
        break;
    }

    return {
      label: STEP_TYPE_LABELS[_stepType],
      value: _stepType,
    };
  }, [stepType]);

  const allowedStepTypes = useMemo(() => {
    if (stepTypeAllowList.length === 0) return STEP_TYPE_OPTIONS;

    return STEP_TYPE_OPTIONS.filter((opt) =>
      stepTypeAllowList.includes(opt.value as StepType)
    );
  }, [stepTypeAllowList]);

  const handleOptionalToggleChange = useCallback(() => {
    let _stepType;

    switch (stepType) {
      case StepType.branching:
        _stepType = StepType.branchingOptional;
        break;

      case StepType.branchingOptional:
        _stepType = StepType.branching;
        break;

      case StepType.optional:
        _stepType = StepType.required;
        break;

      case StepType.required:
      default:
        _stepType = StepType.optional;
        break;
    }

    onTypeChange({ value: _stepType, label: '' });
  }, [onTypeChange, stepType]);

  return (
    <Box {...boxProps}>
      <Text fontSize="sm" fontWeight="bold" color="#4A5568">
        Step type
      </Text>
      <Box display="flex" flexDir="row">
        <Box mt="2" flex="1">
          <Select
            placeholder="Select a step type"
            isSearchable={false}
            value={dropdownValue}
            options={allowedStepTypes}
            onChange={onTypeChange}
            isDisabled={disabled}
            components={{ Option: OptionWithSubLabel() }}
          />
        </Box>
        {!hideRequiredToggle && (
          <Box mt="4" ml="8" color="gray.600" fontWeight="semibold" w="115px">
            {stepType !== StepType.fyi && !isInputStep(stepType) && (
              <Tooltip
                label={
                  accountGuideEditor && stepType === StepType.required
                    ? STEP_TYPE_SUBTEXT.accountRequired
                    : STEP_TYPE_SUBTEXT[stepType]
                }
                placement="top-start"
              >
                <Box>
                  <Switch
                    size="md"
                    isChecked={!isOptionalStep(stepType)}
                    onChange={handleOptionalToggleChange}
                    isDisabled={disabled}
                    mr="3"
                  />
                  {isOptionalStep(stepType) ? 'Optional' : 'Required'}
                </Box>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default withTemplateDisabled<Props>(SelectedStepStepType);
