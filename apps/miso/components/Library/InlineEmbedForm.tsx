import React from 'react';
import { Box, BoxProps, Button, Flex, Grid, Text } from '@chakra-ui/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { InlineEmbed } from 'bento-common/types/globalShoyuState';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import InlineEmbedOptionsMenuButton from 'components/InlineEmbeds/InlineEmbedOptionsMenu';
import { InlineEmbed_inlineEmbedWithTemplateId$data } from 'relay-types/InlineEmbed_inlineEmbedWithTemplateId.graphql';
import { UrlInputCallout } from 'components/common/UrlInput';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import ExtensionRequiredTooltip from 'components/WysiwygEditor/ExtensionRequiredTooltip';

interface QueryRendererProps extends Omit<BoxProps, 'as'> {
  label?: string;
  inlineEmbed: InlineEmbed_inlineEmbedWithTemplateId$data;
  disabled?: boolean;
  onRefetch?: () => Promise<void> | void;
  /** Otherwise, template context seems to assume we're editing template's mounting */
  editingGlobal?: boolean;
  onRemove?: () => void;
  openInlineEmbedEditor: () => Promise<void>;
}

type Props = {
  inlineEmbed: InlineEmbed_inlineEmbedWithTemplateId$data;
} & QueryRendererProps;

const InlineEmbedFormComponent: React.FC<Props> = ({
  label,
  inlineEmbed,
  fontSize = 'sm',
  disabled,
  editingGlobal,
  onRemove,
  openInlineEmbedEditor,
  ...boxProps
}) => {
  const extension = useChromeExtensionInstalled();

  return (
    <Box bg="gray.50" p="4" fontSize={fontSize} {...boxProps}>
      {inlineEmbed ? (
        <Grid
          columnGap="4"
          alignItems="center"
          gridTemplateColumns="1fr auto"
          w="full"
        >
          <Text fontSize="xs" gridColumn="1 / span 2">
            Url
          </Text>
          <Flex flexDir="column" isTruncated>
            <Box
              fontSize="inherit"
              backgroundColor="white"
              borderRadius="md"
              flexGrow="1"
              p="2"
              borderColor="gray.100"
              borderWidth={1}
              isTruncated
            >
              {wildcardUrlToDisplayUrl(inlineEmbed.wildcardUrl)}
            </Box>
            <UrlInputCallout mt="2" allowWildcards />
          </Flex>

          {!disabled && (
            <InlineEmbedOptionsMenuButton
              inlineEmbed={inlineEmbed as unknown as InlineEmbed}
              editingGlobal={editingGlobal}
              onRemove={onRemove}
              openInlineEmbedEditor={openInlineEmbedEditor}
            />
          )}
          <Text fontSize="xs" gridColumn="1 / span 2" mt="2">
            CSS Selector
          </Text>
          <Box
            fontSize="inherit"
            backgroundColor="white"
            borderRadius="md"
            flexGrow="1"
            p="2"
            borderColor="gray.100"
            borderWidth={1}
            isTruncated
          >
            {inlineEmbed.elementSelector}
          </Box>
        </Grid>
      ) : (
        <ExtensionRequiredTooltip isDisabled={extension.installed}>
          <Button
            variant="link"
            onClick={openInlineEmbedEditor}
            display="flex"
            alignItems="center"
            gap="2"
            fontSize="inherit"
            isDisabled={disabled || !extension.installed}
          >
            <div>{label}</div>
            <OpenInNewIcon fontSize="inherit" />
          </Button>
        </ExtensionRequiredTooltip>
      )}
    </Box>
  );
};

export default InlineEmbedFormComponent;
