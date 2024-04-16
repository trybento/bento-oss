import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Text, BoxProps, Button } from '@chakra-ui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { px } from 'bento-common/utils/dom';

const iconSizePx = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
};

export enum AddButtonVariant {
  button = 'button',
  plain = 'plain',
}

interface Props extends Omit<BoxProps, 'as'> {
  disabled?: boolean;
  iconSize?: keyof typeof iconSizePx;
  as?: AddButtonVariant;
}

const AddButton: FC<Props> = ({
  children,
  onMouseEnter,
  onMouseLeave,
  onClick,
  disabled,
  as = AddButtonVariant.plain,
  fontSize = 'sm',
  iconSize = 'lg',
  ...restProps
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      setIsHovered(true);
      onMouseEnter?.(e);
    },
    [onMouseEnter, disabled]
  );

  const handleOnMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      setIsHovered(false);
      onMouseLeave?.(e);
    },
    [onMouseLeave, disabled]
  );

  const handleClick = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      if (disabled) return;
      onClick?.(e as any);
    },
    [disabled, onClick]
  );

  useEffect(() => {
    if (disabled) setIsHovered(false);
  }, [disabled]);

  return as === AddButtonVariant.plain ? (
    <Box
      display="flex"
      alignItems="center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onClick={handleClick}
      color={isHovered || disabled ? 'bento.logo' : 'bento.bright'}
      cursor={disabled ? 'not-allowed' : isHovered ? 'pointer' : undefined}
      {...restProps}
    >
      <AddCircleOutlineIcon
        style={{
          color: 'inherit',
          width: px(iconSizePx[iconSize]),
          height: px(iconSizePx[iconSize]),
        }}
      />
      <Text
        ml="1"
        fontSize={fontSize}
        fontWeight="bold"
        color={isHovered || disabled ? 'bento.logo' : 'bento.bright'}
      >
        {children}
      </Text>
    </Box>
  ) : (
    <Button
      variant="secondary"
      onClick={handleClick}
      fontSize={fontSize}
      isDisabled={disabled}
    >
      <AddCircleOutlineIcon
        style={{
          color: 'inherit',
          width: px(iconSizePx[iconSize]),
          height: px(iconSizePx[iconSize]),
        }}
      />
      <Box ml="1" fontWeight="bold">
        {children}
      </Box>
    </Button>
  );
};

export default AddButton;
