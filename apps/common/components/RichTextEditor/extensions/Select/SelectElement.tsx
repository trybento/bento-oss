import React, { useCallback, useState } from 'react';
import { BaseText, Transforms } from 'slate';
import { ReactEditor, useFocused, useSelected, useSlate } from 'slate-react';
import { Box, Select } from '@chakra-ui/react';
import { SelectSettings } from '../../extensions/Select/withSelect';
import SelectModal from '../../extensions/Select/SelectModal';
import { isGuideBase } from '../../../../utils/guides';

export default function SelectElement({
  attributes,
  children,
  element,
  style,
  formEntityType,
}) {
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);

  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlate();
  const { placeholder, options = [] } = element;
  const nodePath = ReactEditor.findPath(editor as ReactEditor, element);

  const boxShadow = selected && focused ? `0 0 0 1px #cbd5e0` : 'none';

  const selectedValue = element.selectedValue && String(element.selectedValue);

  const handleOpenSelectModal = useCallback(() => {
    setIsSelectModalOpen(true);
  }, []);

  const handleCloseSelectModal = useCallback(() => {
    setIsSelectModalOpen(false);
  }, []);

  const handleUpdateDropdown = (selectSettings: SelectSettings) => {
    Transforms.setNodes(editor, selectSettings as Partial<BaseText>, {
      at: nodePath,
    });

    handleCloseSelectModal();
  };

  return (
    <>
      <Box
        width="100%"
        textAlign="center"
        pt="24px"
        pb="32px"
        display="flex"
        justifyContent="center"
        cursor="default"
        contentEditable={false}
        boxShadow={boxShadow}
        {...attributes}
      >
        <Select
          width="80%"
          placeholder={placeholder}
          fontSize="14px"
          textOverflow="ellipsis"
          value={selectedValue}
          rootProps={{
            onClick: !isGuideBase(formEntityType)
              ? handleOpenSelectModal
              : null,
            style: style,
          }}
          style={{
            pointerEvents: 'none',
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        {children}
      </Box>
      <SelectModal
        isOpen={isSelectModalOpen}
        onSelect={handleUpdateDropdown}
        onCancel={handleCloseSelectModal}
        initialPlaceholder={element.placeholder}
        initialAttributeType={element.attributeType}
        initialAttributeValueType={element.valueType}
        initialAttributeKey={element.attributeKey}
        initialOptions={element.options}
      />
    </>
  );
}
