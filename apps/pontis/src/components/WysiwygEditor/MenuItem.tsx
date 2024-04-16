import { Box, Flex, Icon } from '@chakra-ui/react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { WysiwygEditorLabels } from 'bento-common/types';
import React, { useMemo } from 'react';

interface Props {
  isActive?: boolean;
  label: WysiwygEditorLabels | string;
  isComplete?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<Props> = ({ isActive, label, disabled, onClick }) => {
  const icon = useMemo(() => {
    switch (label) {
      case WysiwygEditorLabels.navigate:
        return ZoomOutMapIcon;
      case WysiwygEditorLabels.build:
      case WysiwygEditorLabels.edit:
        return EditOutlinedIcon;
      case WysiwygEditorLabels.preview:
        return RemoveRedEyeOutlinedIcon;
      case WysiwygEditorLabels.record:
        return FiberManualRecordOutlinedIcon;
      default:
        return null;
    }
  }, [label]);

  return (
    <Flex
      position="relative"
      userSelect="none"
      opacity={!disabled ? 1 : 0.5}
      h="full"
      {...(onClick &&
        !isActive &&
        !disabled && {
          onClick,
          cursor: 'pointer',
          _hover: { opacity: 0.8 },
        })}>
      <Flex
        textAlign="center"
        minW="20"
        fontSize="sm"
        color="white"
        flexDir="column"
        gap="2"
        fontWeight={isActive ? 'bold' : 'normal'}
        my="auto"
        py="2"
        px="3"
        border={isActive ? '2px solid #EFF5FF' : undefined}
        borderRadius="base">
        {icon && <Icon as={icon} w="5" mx="auto" />}
        <Box m="auto" lineHeight="shorter">
          {label}
        </Box>
      </Flex>
    </Flex>
  );
};

export default MenuItem;
