import React, { SVGProps } from 'react';
import { Text, Box, BoxProps } from '@chakra-ui/react';
import Radio from 'system/Radio';
import colors from 'helpers/colors';

interface Props extends Omit<BoxProps, 'onClick' | 'title'> {
  title?: React.ReactNode;
  ImgComponent?: React.FC<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  description: string;
  type: string;
  isSelected: boolean;
  // Whether to show the selected option with an outline.
  showSelectedOutline?: boolean;
  onClick: React.MouseEventHandler<HTMLElement>;
  imagePos?: OptionCardImgPosition;
  showBorder?: boolean;
  value?: string | number;
}

export enum OptionCardImgPosition {
  top = 'top',
  inline = 'inline',
}

const OptionCard: React.FC<Props> = ({
  title,
  ImgComponent,
  disabled,
  description,
  isSelected,
  showSelectedOutline,
  type,
  onClick,
  imagePos = OptionCardImgPosition.top,
  showBorder,
  value,
  ...boxProps
}) => {
  const img = (
    <Box
      textAlign="center"
      height={imagePos === OptionCardImgPosition.inline ? '130px' : undefined}
    >
      {ImgComponent ? (
        <ImgComponent style={{ marginLeft: '-6px', marginTop: '-6px' }} />
      ) : null}
    </Box>
  );

  return (
    <Box
      display="flex"
      flexDir="column"
      flex={1}
      px={3}
      py={4}
      h="full"
      cursor="pointer"
      borderRadius="md"
      outline={
        showSelectedOutline && isSelected ? '4px solid #73A4FC' : undefined
      }
      data-type={type}
      onClick={onClick}
      border={showBorder ? '1px solid #EDF2F7' : undefined}
      {...boxProps}
      opacity={disabled ? 0.5 : 1}
      pointerEvents={disabled ? 'none' : undefined}
    >
      {imagePos === OptionCardImgPosition.top && img}
      <Box display="flex" alignItems="start">
        <Radio
          isChecked={isSelected}
          value={String(value)}
          isDisabled={disabled}
          ml="2"
          mr="3"
          mt="1"
        />
        <Box mr="2">
          <Box fontSize="md" fontWeight="bold">
            {title}
          </Box>
          <Text
            color={title ? colors.text.secondary : colors.text.primary}
            whiteSpace="pre-line"
            display="flex"
            mt={imagePos === OptionCardImgPosition.inline ? 4 : undefined}
          >
            {imagePos === OptionCardImgPosition.inline && img}
            {description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default OptionCard;
