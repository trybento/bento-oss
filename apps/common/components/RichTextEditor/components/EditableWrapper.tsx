import React, { useState } from 'react';
import { Box, BoxProps, Icon } from '@chakra-ui/react';
import EditIcon from '@mui/icons-material/EditOutlined';

interface EditableWrapperProps extends BoxProps {
  onClick: () => void;
}

export default function EditorContainer({
  children,
  onClick,
}: EditableWrapperProps) {
  const [hovered, setHover] = useState(false);

  const setHoverOut = () => setHover(false);
  const setHoverIn = () => setHover(true);

  return (
    <Box onMouseEnter={setHoverIn} onMouseLeave={setHoverOut}>
      <Box
        contentEditable="false"
        suppressContentEditableWarning={true}
        style={{
          position: 'absolute',
          right: '1.5em',
          opacity: hovered ? '1' : '0',
          pointerEvents: hovered ? 'all' : 'none',
          transition: 'all 0.1s ease-in',
        }}
        ml="14px"
        mt="1"
        cursor="pointer"
        onClick={onClick}
      >
        <Icon color="silver.400" as={EditIcon} />
      </Box>
      {children}
    </Box>
  );
}
