import React, { useMemo } from 'react';
import cx from 'classnames';
import { Step } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { MainStoreState } from '../stores/mainStore/types';
import withMainStoreData from '../stores/mainStore/withMainStore';
import TextInput, { TextInputAs } from 'bento-common/components/TextInput';
import DateInput from 'bento-common/components/DateInput';
import NumberCardsInput from 'bento-common/components/NumberCardsInput';
import { selectedGuideForFormFactorSelector } from '../stores/mainStore/helpers/selectors';
import {
  DropdownInputOption,
  DropdownInputVariation,
  StepInputFieldType,
  Theme,
} from 'bento-common/types';
import DefaultSelect from '../system/Select';
import {
  isFlatTheme,
  massageStepInputSettings,
} from 'bento-common/data/helpers';
import { debounce } from 'bento-common/utils/lodash';

import { validateInput } from '../lib/inputHelpers';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import withCustomUIContext from '../hocs/withCustomUIContext';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import catchException from '../lib/catchException';
import { parseDropdownValues } from './BranchingDropdown';
import PreGuideCards from './PreGuideCards';
import InputLabel from 'bento-common/components/InputLabel';
import { MULTI_ANSWER_INPUT_SEPARATOR } from 'bento-common/utils/constants';

type OuterProps = {
  step: Step;
};

type Props = OuterProps &
  Pick<CustomUIProviderValue, 'primaryColorHex' | 'secondaryColorHex'> &
  Pick<FormFactorContextValue, 'formFactor' | 'renderedFormFactorFlags'>;

type MainStoreData = {
  dispatch: MainStoreState['dispatch'];
  theme: Theme | undefined;
};

type InputFieldsContainerProps = Props & MainStoreData;

const InputFields: React.FC<InputFieldsContainerProps> = ({
  step,
  renderedFormFactorFlags: { isInline, isSidebar },
  theme,
  dispatch,
  primaryColorHex,
  secondaryColorHex,
}) => {
  const disabled = step.isComplete;
  const inputs = step.inputs || [];
  const isFlat = isFlatTheme(theme);

  const onChangeHandlers = useMemo(
    () =>
      inputs.reduce((acc, { entityId }) => {
        acc[entityId] = debounce(
          (newValue: string | string[] | DropdownInputOption[] | Date) => {
            dispatch({
              type: 'stepChanged',
              step: {
                entityId: step.entityId,
                inputs: inputs.map((input) => ({
                  ...input,
                  answer:
                    input.entityId === entityId
                      ? typeof newValue === 'string'
                        ? newValue
                        : newValue instanceof Date
                        ? newValue.toISOString()
                        : newValue
                            .map((o) => (typeof o === 'string' ? o : o.value))
                            .filter((v) => v)
                            .join(MULTI_ANSWER_INPUT_SEPARATOR)
                      : input.answer,
                })),
              },
            });
          },
          500
        );

        return acc;
      }, {}),
    [step.entityId, inputs, dispatch]
  );

  return (
    <div
      className={cx('flex', 'flex-col', 'gap-4', 'mb-2', 'mr-auto', {
        'max-w-lg': isFlat,
        'w-10/12': isInline,
        'w-full ': isSidebar,
      })}
    >
      {inputs.map((input, idx) => {
        const { entityId, answer, label, settings, type } = input;
        const {
          minValue,
          maxValue,
          helperText,
          placeholder,
          maxLabel,
          minLabel,
          required,
          options,
          multiSelect,
          variation,
        } = massageStepInputSettings(type, settings);
        const name = `input-${step.entityId}-${entityId}-${idx}-${label}`;
        const errorMessage = validateInput(input);
        const as =
          type === StepInputFieldType.paragraph
            ? TextInputAs.textarea
            : TextInputAs.input;

        switch (type) {
          case StepInputFieldType.text:
          case StepInputFieldType.email:
          case StepInputFieldType.paragraph:
            return (
              <TextInput
                name={name}
                key={name}
                label={label}
                defaultValue={answer || undefined}
                placeholder={placeholder}
                maxLength={maxValue}
                helperText={helperText}
                onChange={onChangeHandlers[entityId]}
                isValid={!errorMessage}
                errorMessage={errorMessage}
                disabled={disabled}
                required={required}
                as={as}
                inputClassName="rounded-lg"
              />
            );

          case StepInputFieldType.nps:
          case StepInputFieldType.numberPoll:
            return (
              <NumberCardsInput
                name={name}
                key={name}
                label={label}
                defaultValue={answer}
                min={minValue}
                max={maxValue}
                helperText={helperText}
                onChange={onChangeHandlers[entityId]}
                isValid={!errorMessage}
                errorMessage={errorMessage}
                maxLabel={maxLabel}
                minLabel={minLabel}
                disabled={disabled}
                required={required}
                cardColor={secondaryColorHex}
                selectedCardColor={primaryColorHex}
              />
            );

          case StepInputFieldType.dropdown: {
            const selectedValues = (answer || '').split(
              MULTI_ANSWER_INPUT_SEPARATOR
            );

            return (
              <div className="ml-0.5">
                {label && <InputLabel required={required}>{label}</InputLabel>}
                {variation === DropdownInputVariation.cards ? (
                  <PreGuideCards
                    isMulti={multiSelect}
                    options={options || []}
                    handleSelection={onChangeHandlers[entityId]}
                    selectedOptions={selectedValues!}
                    disabled={disabled}
                  />
                ) : (
                  <DefaultSelect
                    isMulti={multiSelect}
                    options={options}
                    value={parseDropdownValues(selectedValues, multiSelect)}
                    handleChange={onChangeHandlers[entityId]}
                    placeholder={placeholder || undefined}
                    disabled={disabled}
                  />
                )}
              </div>
            );
          }

          case StepInputFieldType.date: {
            return (
              <div className="mx-0.5 ">
                <DateInput
                  name={name}
                  key={name}
                  label={label}
                  defaultValue={errorMessage ? undefined : answer!}
                  placeholder={placeholder}
                  maxLength={maxValue}
                  onChange={onChangeHandlers[entityId]}
                  disabled={disabled}
                  required={required}
                  style={{
                    /**
                     * Max width for the date picker
                     * in macOS/chrome.
                     */
                    maxWidth: '220px',
                  }}
                  inputClassName="rounded-lg"
                />
              </div>
            );
          }

          default:
            catchException(new Error(`Input type "${type}" not supported`));
            return null;
        }
      })}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => ({
    dispatch: state.dispatch,
    theme: selectedGuideForFormFactorSelector(state, formFactor)?.theme,
  })),
])(InputFields);
