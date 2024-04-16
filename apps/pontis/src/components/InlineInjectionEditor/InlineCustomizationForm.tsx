import { Flex, FormControl, FormLabel } from '@chakra-ui/react';
import Select, { SelectOptions } from 'bento-common/components/Select';
import {
  InjectionAlignment,
  InjectionPosition,
  InlineInjectionEditorData,
  WysiwygEditorState,
} from 'bento-common/types';
import { InlineEmbed } from 'bento-common/types/globalShoyuState';
import isNaN from 'lodash/isNaN';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useSession } from '~src/providers/VisualBuilderSessionProvider';

import NumberInput from '../system/NumberInput';

const injectionPositionOptions = [
  { label: 'Before this element', value: InjectionPosition.before },
  { label: 'After this element', value: InjectionPosition.after },
  { label: 'Inside this element', value: InjectionPosition.inside },
];

const injectionAlignmentOptions = [
  { label: 'Auto', value: null },
  { label: 'Left', value: InjectionAlignment.left },
  { label: 'Right', value: InjectionAlignment.right },
  { label: 'Center', value: InjectionAlignment.center },
];

const numericFields: { [key: string]: boolean } = {
  topMargin: true,
  rightMargin: true,
  bottomMargin: true,
  padding: true,
  borderRadius: true,
  leftMargin: true,
  maxWidth: false,
};

type ChangeHandlersReturnType<TValue> = {
  [key in keyof InlineEmbed]: (value: TValue) => void;
};

/**
 * @todo track customization activities
 */
const InlineCustomizationForm: React.FC = () => {
  const { progressData, setProgressData } = useSession();
  const data = progressData.data as InlineInjectionEditorData;

  // The absence of `templateEntityId` means that the guide
  // is a placeholder for the injected onboarding inline.
  const isInlineContextual = !!data.inlineEmbed.templateEntityId;
  const [inlineEmbed, setInlineEmbed] = useState(data.inlineEmbed);

  const updateInlineEmbedKey = useCallback(
    (key: keyof InlineEmbed, value: any) => {
      setInlineEmbed((inlineEmbed) => ({ ...inlineEmbed, [key]: value }));
    },
    [],
  );

  const getSelectedOption = useCallback(
    (options: SelectOptions[], selectedValue: InlineEmbed[keyof InlineEmbed]) =>
      options.find((opt) => opt.value === selectedValue),
    [],
  );

  const handleSelectChange = useMemo(() => {
    const keys: Array<keyof InlineEmbed> = ['position', 'alignment'];

    const changeHandlers: Partial<ChangeHandlersReturnType<SelectOptions>> = {};
    keys.forEach((key) => {
      changeHandlers[key] = ({ value }) => updateInlineEmbedKey(key, value);
    });

    return changeHandlers;
  }, []);

  const handleNumberChange = useMemo(() => {
    const changeHandlers: Partial<ChangeHandlersReturnType<number>> = {};
    Object.entries(numericFields).forEach(([key, allowZero]) => {
      changeHandlers[key] = (value) => {
        const numericValue = isNaN(value) ? 0 : value;
        updateInlineEmbedKey(
          key as keyof InlineEmbed,
          numericValue || allowZero ? numericValue : null,
        );
      };
    });

    return changeHandlers;
  }, []);

  useEffect(() => {
    setProgressData((prev: WysiwygEditorState<InlineInjectionEditorData>) => ({
      ...prev,
      data: {
        ...prev.data,
        inlineEmbed,
      },
    }));
  }, [inlineEmbed]);

  return (
    <Flex flexDirection="column" gridGap={4}>
      <FormControl>
        <FormLabel>Where should the inline guide appear?</FormLabel>
        <Select
          options={injectionPositionOptions}
          value={getSelectedOption(
            injectionPositionOptions,
            inlineEmbed.position,
          )}
          onChange={handleSelectChange['position']}
        />
      </FormControl>
      <FormControl flex={1}>
        <FormLabel variant="primary">Margins (px)</FormLabel>
        <Flex gap={2}>
          <FormControl flex={1}>
            <FormLabel variant="secondary">Top</FormLabel>
            <NumberInput
              inputMode="numeric"
              onChange={handleNumberChange['topMargin']}
              value={inlineEmbed.topMargin}
              min={0}
              neverEmpty
              minimalist
              hideStepper
            />
          </FormControl>
          <FormControl flex={1}>
            <FormLabel variant="secondary">Right</FormLabel>
            <NumberInput
              inputMode="numeric"
              onChange={handleNumberChange['rightMargin']}
              value={inlineEmbed.rightMargin}
              min={0}
              neverEmpty
              minimalist
              hideStepper
            />
          </FormControl>
          <FormControl flex={1}>
            <FormLabel variant="secondary">Bottom</FormLabel>
            <NumberInput
              inputMode="numeric"
              onChange={handleNumberChange['bottomMargin']}
              value={inlineEmbed.bottomMargin}
              min={0}
              neverEmpty
              minimalist
              hideStepper
            />
          </FormControl>
          <FormControl flex={1}>
            <FormLabel variant="secondary">Left</FormLabel>
            <NumberInput
              inputMode="numeric"
              onChange={handleNumberChange['leftMargin']}
              value={inlineEmbed.leftMargin}
              min={0}
              neverEmpty
              minimalist
              hideStepper
            />
          </FormControl>
        </Flex>
      </FormControl>
      <Flex flexDirection="row" gridGap={2}>
        <FormControl>
          <FormLabel>Alignment</FormLabel>
          <Select
            options={injectionAlignmentOptions}
            value={getSelectedOption(
              injectionAlignmentOptions,
              inlineEmbed.alignment,
            )}
            onChange={handleSelectChange['alignment']}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Max width (px)</FormLabel>
          <NumberInput
            inputMode="numeric"
            onChange={handleNumberChange['maxWidth']}
            value={inlineEmbed.maxWidth || ''}
            min={0}
            placeholder="Fill container"
            minimalist
            hideStepper
          />
        </FormControl>
      </Flex>
      {!isInlineContextual && (
        <Flex flexDirection="row" gridGap={2}>
          <FormControl>
            <FormLabel>Padding (px)</FormLabel>
            <NumberInput
              inputMode="numeric"
              onChange={handleNumberChange['padding']}
              value={inlineEmbed.padding}
              min={0}
              minimalist
              hideStepper
            />
          </FormControl>
          <FormControl>
            <FormLabel>Border radius (px)</FormLabel>
            <NumberInput
              inputMode="numeric"
              onChange={handleNumberChange['borderRadius']}
              value={inlineEmbed.borderRadius}
              min={0}
              minimalist
              hideStepper
            />
          </FormControl>
        </Flex>
      )}
    </Flex>
  );
};

export default InlineCustomizationForm;
