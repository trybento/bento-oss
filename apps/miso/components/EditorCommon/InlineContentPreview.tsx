import React from 'react';
import { Box, Flex, HStack } from '@chakra-ui/react';
import PreviewContainer, {
  PreviewContainerCProps,
} from 'components/Previews/PreviewContainer';
import ViewInAppButton from 'components/ViewInAppButton';

/** Meant to be used inline with content forms. */
const InlineContentPreview: React.FC<PreviewContainerCProps> = (props) => {
  return (
    <Flex
      maxW="1000px"
      display="flex"
      flexDir="column"
      gap="2"
      position="relative"
    >
      <Flex gap="2" flexDir="column" w="100%" position="sticky" top="80px">
        <HStack justifyContent="space-between">
          <Box fontSize="sm" fontWeight="bold" color="gray.800">
            Preview
          </Box>
          <ViewInAppButton />
        </HStack>
        <PreviewContainer previewBoxProps={{ py: 0 }} {...props} />
      </Flex>
    </Flex>
  );
};

export default InlineContentPreview;
