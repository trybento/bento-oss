import React from 'react';
import { Box, BoxProps, Button, Flex } from '@chakra-ui/react';

import colors from 'helpers/colors';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import ExtensionRequiredTooltip from 'components/WysiwygEditor/ExtensionRequiredTooltip';

type Props = React.PropsWithChildren<
  BoxProps & {
    label: string;
    editLabel?: string;
    description?: string;
    onEdit?: () => void;
    /**
     * Whether editing is disabled.
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Whether this requires the chrome extension. If true, the button will be disabled
     * when the chrome extension is not installed.
     *
     * @default false
     */
    requiresChromeExtension?: boolean;
  }
>;

const EditSettings: React.FC<Props> = ({
  label,
  description,
  editLabel = 'Edit',
  onEdit,
  children,
  requiresChromeExtension = false,
  isDisabled = false,
  ...boxProps
}) => {
  const extension = useChromeExtensionInstalled();

  return (
    <Flex flexDir="column" fontSize="xs" {...boxProps}>
      <Flex flexDir="row">
        <Box color={colors.text.primary}>
          <Box display="inline" fontWeight="bold">
            {label}
          </Box>
          {description && (
            <Box display="inline" ml="1">
              {description}
            </Box>
          )}
        </Box>
        <Box ml="auto">
          <ExtensionRequiredTooltip
            isDisabled={!requiresChromeExtension || extension.installed}
            withPortal={false}
          >
            <Button
              isDisabled={
                isDisabled || (requiresChromeExtension && !extension.installed)
              }
              variant="link"
              fontSize="xs"
              fontWeight="bold"
              onClick={onEdit}
              _focus={{ boxShadow: 'none' }}
            >
              {editLabel}
            </Button>
          </ExtensionRequiredTooltip>
        </Box>
      </Flex>
      {!!children && <Box mt="2">{children}</Box>}
    </Flex>
  );
};

export default EditSettings;
