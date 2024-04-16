import React, { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { StepAutoCompleteInteractionInput } from 'bento-common/types';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { Highlight } from 'components/common/Highlight';
import colors from 'helpers/colors';
import { BUTTON_INTERACTION_NO_TEXT } from 'helpers/constants';

const ButtonInteractionDetails: FC<{
  autoCompleteInteraction: StepAutoCompleteInteractionInput;
}> = ({ autoCompleteInteraction }) => {
  return (
    <Flex
      flexDir="column"
      gridGap="4px"
      fontSize="xs"
      color={colors.text.secondary}
    >
      <Flex>
        <Box my="auto" minW="80px" fontWeight="semibold">
          Button text
        </Box>
        {autoCompleteInteraction.elementText ? (
          <Highlight>{autoCompleteInteraction.elementText}</Highlight>
        ) : (
          <Text color="gray.400" fontStyle="italic" ml={1.5}>
            {BUTTON_INTERACTION_NO_TEXT}
          </Text>
        )}
      </Flex>
      <Flex>
        <Box my="auto" minW="80px" fontWeight="semibold">
          Button URL
        </Box>
        <Highlight>
          {wildcardUrlToDisplayUrl(autoCompleteInteraction.wildcardUrl)}
        </Highlight>
      </Flex>
    </Flex>
  );
};

export default ButtonInteractionDetails;
