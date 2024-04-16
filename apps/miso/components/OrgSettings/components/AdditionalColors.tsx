import React from 'react';
import Box from 'system/Box';
import { FieldArray } from 'formik';
import {
  BoxProps,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';
import AddButton from 'components/AddButton';
import DeleteButton from 'system/DeleteButton';
import ColorField from 'bento-common/components/ColorField';
import { OrgAdditionalColor } from 'bento-common/types';
import { maxAdditionalColors } from 'bento-common/data/helpers';

interface Props extends Omit<BoxProps, 'onChange' | 'defaultValue'> {
  name: string;
  defaultValue: OrgAdditionalColor[];
  onChange?: (colors: OrgAdditionalColor[]) => void;
}

const defaultColor: OrgAdditionalColor = { value: '#FFFFFF' };
const fieldKey = 'additionalColors';

const AdditionalColors = ({
  defaultValue: colors = [],
  onChange,
  maxW = '280px',
  ...boxProps
}: Props) => {
  return (
    <FormControl as="fieldset" maxW={maxW} {...boxProps}>
      <FormLabel>Additional colors</FormLabel>
      <FieldArray
        name={fieldKey}
        render={({ push, remove }) => {
          const removeItem = (idx: number) => {
            remove(idx);
          };

          return (
            <Box>
              <Box display="flex" flexFlow="column" style={{ gap: '8px' }}>
                {colors.map((color, idx) => {
                  return (
                    <Box
                      key={`additional-color-${idx}`}
                      className="hoverable-row"
                      display="flex"
                      style={{ gap: '8px' }}
                    >
                      <ColorField
                        name={`${fieldKey}.[${idx}].value`}
                        defaultValue={color.value}
                      />
                      <Box width="30px" m="auto">
                        <DeleteButton
                          className="hoverable-row-hidden"
                          onClick={() => removeItem(idx)}
                          tooltip="Delete color"
                          tooltipPlacement="top"
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              {colors.length < maxAdditionalColors && (
                <Box display="inline-block" mt={2}>
                  <AddButton
                    onClick={() => push(defaultColor)}
                    fontSize="xs"
                    iconSize="sm"
                  >
                    Add color
                  </AddButton>
                </Box>
              )}
            </Box>
          );
        }}
      />
      <FormHelperText>Additional colors to be used on CTAs.</FormHelperText>
    </FormControl>
  );
};

export default AdditionalColors;
