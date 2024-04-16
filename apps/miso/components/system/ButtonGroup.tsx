import { Tab, TabList, TabProps, Tabs, TabsProps } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { SelectOption } from 'bento-common/components/RichTextEditor/extensions/Select/withSelect';

interface Props {
  options: SelectOption[];
  onOptionSelected: (option: SelectOption) => void;
  selectedIndex?: number;
  buttonProps?: TabProps;
}

const optionKey = (option, idx) => `${idx}-${option.label}-${option.value}`;

/**
 * Vertical tab button group - not CTA collection
 */
const TabButtonGroup: React.FC<Props & Partial<TabsProps>> = ({
  options = [],
  onOptionSelected,
  color = '#086F83',
  h = '36px',
  buttonProps,
  selectedIndex,
  ...props
}) => {
  const handleItemSelected = useMemo(
    () =>
      options.reduce(
        (a, o, idx) => ({
          ...a,
          [optionKey(o, idx)]: (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            e.preventDefault();
            onOptionSelected(o);
          },
        }),
        {}
      ),
    [options, onOptionSelected]
  );

  return (
    <Tabs
      variant="unstyled"
      h={h}
      lineHeight="15px"
      {...props}
      {...(selectedIndex !== undefined ? { index: selectedIndex } : {})}
    >
      <TabList className="button-group-list" h="inherit">
        {options.map((o, idx) => (
          <Tab
            key={`tab-${idx}`}
            borderWidth="1px"
            fontSize="sm"
            fontWeight="bold"
            borderColor={color}
            color={color}
            _selected={{ color: 'white', bg: color }}
            _hover={{ opacity: 0.8 }}
            _focus={{ outline: 'none' }}
            onClick={handleItemSelected[optionKey(o, idx)]}
            {...buttonProps}
          >
            {o.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default TabButtonGroup;
