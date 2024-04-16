import React, { useCallback, useMemo } from 'react';
import { Box, Button, Flex, FormLabel } from '@chakra-ui/react';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import { Highlight } from 'components/common/Highlight';
import Text from 'system/Text';
import { TemplateValue } from 'bento-common/types/templateData';
import InlineEditorModal from './InlineEditorModal';
import useToggleState from 'hooks/useToggleState';
import colors from 'helpers/colors';
import { useTemplate } from 'providers/TemplateProvider';
import { WysiwygEditorAction } from 'components/WysiwygEditor/utils';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import ExtensionRequiredTooltip from 'components/WysiwygEditor/ExtensionRequiredTooltip';

interface Props {
  templateData: TemplateValue;
  disabled?: boolean;
}

const InlineEmbedTargeting: React.FC<Props> = ({ disabled, templateData }) => {
  const toggleState = useToggleState(['modal']);
  const inlineEmbed = templateData?.inlineEmbed;

  const { handleEditOrCreateInlineEmbed } = useTemplate();
  const extension = useChromeExtensionInstalled();

  const handleClick = useCallback(() => {
    if (inlineEmbed) {
      toggleState.modal.on();
    } else {
      handleEditOrCreateInlineEmbed(WysiwygEditorAction.create);
    }
  }, [toggleState.modal, inlineEmbed, handleEditOrCreateInlineEmbed]);

  const displayUrl = useMemo(
    () => (inlineEmbed ? wildcardUrlToDisplayUrl(inlineEmbed.wildcardUrl) : ''),
    [inlineEmbed?.wildcardUrl]
  );

  return (
    <Flex
      flexDir="column"
      gap="2"
      pointerEvents={disabled ? 'none' : undefined}
    >
      <Flex gap="2">
        <FormLabel variant="secondary" my="auto" mr="0">
          Anchor location:
        </FormLabel>
        {!inlineEmbed && (
          <Text fontStyle="italic" color={colors.error.text}>
            ⚠️ Not set yet
          </Text>
        )}
        <Box ml="auto">
          <ExtensionRequiredTooltip isDisabled={extension.installed}>
            <Button
              fontSize="xs"
              variant="link"
              onClick={handleClick}
              isDisabled={disabled || !extension.installed}
            >
              {inlineEmbed ? 'Edit location' : 'Set location'}
            </Button>
          </ExtensionRequiredTooltip>
        </Box>
      </Flex>
      {inlineEmbed && (
        <Flex gap="2" overflow="hidden">
          <Highlight fontSize="xs" maxW="85%" isTruncated>
            {displayUrl}
          </Highlight>
          <Highlight fontSize="xs" maxW="85%" isTruncated>
            {inlineEmbed.elementSelector}
          </Highlight>
        </Flex>
      )}

      {toggleState.modal.isOn && (
        <InlineEditorModal
          data={inlineEmbed}
          onClose={toggleState.modal.off}
          isOpen
        />
      )}
    </Flex>
  );
};

export default withTemplateDisabled<Props>(InlineEmbedTargeting);
