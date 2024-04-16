import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import ModalOptionsContainer from '../ModalOptionsContainer';
import OptionCard from './OptionCard';
import { SelectorOption } from './helpers';

type SimpleSelectorProps<T extends string> = {
  selectedValue: T | null;
  isHidden?: boolean;
  openHook?: (isHidden: boolean) => void;
  header: string;
  onChange: (value: T) => void;
  labels: Record<T, string>;
  options: SelectorOption<T>[];
};

const SimpleSelector = <T extends string>({
  selectedValue,
  isHidden,
  onChange,
  header,
  labels,
  options,
  openHook,
}: SimpleSelectorProps<T>) => {
  openHook?.(isHidden);

  const handleChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { type } = e.currentTarget.dataset;
      onChange(type as T);
    },
    [onChange]
  );

  return (
    <ModalOptionsContainer
      header={header}
      selectedLabel={labels[selectedValue]}
      isHidden={isHidden}
    >
      <Box display="flex" flexDir="row" gap={4} flexWrap="wrap">
        {options.map((opt, i) => (
          <OptionCard
            id={opt.id || `selector-option-${opt.type}`}
            key={`simple-selector-${i}-${opt.type}`}
            {...opt}
            isSelected={selectedValue === opt.type}
            type={opt.type}
            onClick={handleChange}
            flex="none"
            flexBasis="260px"
            value={opt.type}
          />
        ))}
      </Box>
    </ModalOptionsContainer>
  );
};

export default SimpleSelector;
