import React, { useCallback } from 'react';
import { Box, BoxProps, Icon, IconProps } from '@chakra-ui/react';
import ReactDOM from 'react-dom';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import Tooltip from './Tooltip';
import { NAV_Z_INDEX } from 'components/Nav';
import { MuiSvgIcon } from 'types';

export interface FloatingControlAdditionalAction {
  icon: MuiSvgIcon;
  action: any;
  tooltipLabel: string;
  highlighted?: boolean;
}

interface FloatingControlsProps
  extends Omit<BoxProps, 'onClick' | 'top' | 'left' | 'onChange'> {
  top?: number | string;
  left?: number | string;
  text?: string;
  iconProps?: IconProps;
  onClick?: (e: React.MouseEvent) => void;
  onTextClick?: (e: React.MouseEvent) => void;
  onEdit?: (e: React.MouseEvent) => void;
  editTooltipLabel?: string;
  withPortal?: boolean;
  onDelete?: (e: React.MouseEvent) => void;
  deleteTooltipLabel?: string;
  canDelete?: boolean;
  additionalActions?: FloatingControlAdditionalAction[];
}

const btnColor: BoxProps['color'] = 'gray.500';
const btnHighlightColor: BoxProps['color'] = '#185ddc';

const FloatingControls = React.forwardRef<
  HTMLDivElement,
  FloatingControlsProps
>(function FloadingControlsComponent(
  {
    text,
    left,
    top,
    onClick,
    onTextClick,
    onEdit,
    editTooltipLabel = 'Edit',
    onDelete,
    withPortal,
    deleteTooltipLabel = 'Delete',
    iconProps = {},
    canDelete = true,
    contentEditable,
    additionalActions = [],
    zIndex,
    ...boxProps
  },
  ref
) {
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (canDelete) {
        onDelete?.(e);
      }
    },
    [canDelete, onDelete]
  );

  const component = (
    <Box
      ref={ref}
      zIndex={zIndex ?? NAV_Z_INDEX}
      top={typeof top === 'string' ? top : top + window.scrollY}
      left={typeof left === 'string' ? left : left + window.scrollX}
      display="flex"
      gridGap="4px"
      flexDir="row"
      px="2"
      py="2"
      position="absolute"
      borderColor="gray.200"
      borderWidth="1px"
      bg="white"
      borderRadius="4"
      shadow="md"
      onClick={onClick}
      {...boxProps}
    >
      {onEdit && (
        <Tooltip label={editTooltipLabel} placement="top">
          <Box
            className="floating-controls-action"
            onClick={onEdit}
            m="auto"
            display="flex"
            cursor="pointer"
            color={btnColor}
            _hover={{ color: btnHighlightColor }}
          >
            <Icon
              as={EditIcon}
              m="auto"
              cursor="pointer"
              transform="scale(0.7)"
              pointerEvents="none"
              {...iconProps}
            />
          </Box>
        </Tooltip>
      )}

      {additionalActions.map((a) => (
        <Tooltip label={a.tooltipLabel} placement="top" key={a.tooltipLabel}>
          <Box
            className="floating-controls-action"
            onClick={a.action}
            m="auto"
            display="flex"
            cursor="pointer"
            color={a.highlighted ? btnHighlightColor : btnColor}
            _hover={{ color: btnHighlightColor }}
          >
            <Icon
              as={a.icon}
              m="auto"
              cursor="pointer"
              transform="scale(0.7)"
              pointerEvents="none"
              {...iconProps}
            />
          </Box>
        </Tooltip>
      ))}

      {onDelete && (
        <Tooltip
          label={canDelete ? deleteTooltipLabel : 'This CTA is required'}
          placement="top"
        >
          <Box
            className="floating-controls-action"
            onClick={handleDelete}
            m="auto"
            display="flex"
            cursor={canDelete ? 'pointer' : 'not-allowed'}
            color={btnColor}
            opacity={canDelete ? 1 : 0.3}
            _hover={canDelete ? { color: btnHighlightColor } : undefined}
          >
            <Icon
              as={DeleteIcon}
              m="auto"
              cursor="pointer"
              transform="scale(0.7)"
              pointerEvents="none"
              {...iconProps}
            />
          </Box>
        </Tooltip>
      )}

      {!!text && (
        <Box
          onClick={onTextClick}
          m="auto"
          ml="3"
          cursor={onTextClick ? 'pointer' : 'text'}
          bg="gray.100"
          color="gray.600"
          borderRadius="4"
          px="2"
          py="1"
          whiteSpace="nowrap"
          maxW="400px"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {text}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {withPortal ? ReactDOM.createPortal(component, document.body) : component}
    </>
  );
});

export default FloatingControls;
