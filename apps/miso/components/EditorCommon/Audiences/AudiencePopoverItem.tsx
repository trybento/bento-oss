import React, { useCallback } from 'react';
import {
  Box,
  Popover,
  PopoverBody,
  PopoverTrigger,
  Portal,
  Button,
  Text,
  Flex,
} from '@chakra-ui/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { GroupTargeting } from 'bento-common/types/targeting';
import { RulesDisplayType } from 'bento-common/types';
import AudienceRulesDisplay from 'components/Templates/AudienceGroupRulesDisplay';
import H5 from 'system/H5';
import PopoverContent from 'system/PopoverContent';
import { DETAILS_POPOVER_TRIGGER_DELAY } from 'helpers/constants';

interface AudienceOptionProps {
  targets?: GroupTargeting;
  audienceEntityId?: string;
  isDisabled?: boolean;
}

export const AudiencePopoverContent = ({
  audienceEntityId,
  targets,
  handleViewAudience,
}: {
  audienceEntityId?: string;
  targets?: GroupTargeting;
  handleViewAudience: () => void;
}) => (
  <Flex flexDir="column">
    <H5 fontSize="sm" mt="2">
      Audience details
    </H5>
    <Box position="relative" fontSize="xs">
      {audienceEntityId && (
        <Button
          zIndex="1"
          color="bento.bright"
          variant="link"
          size="sm"
          fontSize="xs"
          onClick={handleViewAudience}
          position="absolute"
          right="0"
          top="0"
        >
          <Text mr="1">See and edit rules</Text>
          <OpenInNewIcon fontSize="inherit" />
        </Button>
      )}
      {targets && (
        <AudienceRulesDisplay
          hideBlockedAccounts
          targets={targets}
          compact
          type={RulesDisplayType.plain}
        />
      )}
    </Box>
  </Flex>
);

export const AudiencePopoverItem: React.FC<
  React.PropsWithChildren<AudienceOptionProps>
> = ({ targets, audienceEntityId, isDisabled, children }) => {
  const handleViewAudience = useCallback(
    () =>
      window.open(`/command-center/audiences/${audienceEntityId}`, '_blank'),
    [audienceEntityId]
  );

  const PopoverComponent = (
    <Popover
      trigger="hover"
      placement="right-start"
      isLazy
      lazyBehavior="unmount"
      openDelay={DETAILS_POPOVER_TRIGGER_DELAY}
      isOpen={isDisabled ? false : undefined}
    >
      <PopoverTrigger>
        {children ? <Box>{children}</Box> : <Box w="100%" h="100%" />}
      </PopoverTrigger>
      <Box zIndex="12">
        <Portal>
          <PopoverContent w="sm" disableClickPropagation>
            <PopoverBody fontSize="xs">
              <AudiencePopoverContent
                audienceEntityId={audienceEntityId}
                targets={targets}
                handleViewAudience={handleViewAudience}
              />
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Box>
    </Popover>
  );

  return children ? (
    PopoverComponent
  ) : (
    <Box
      position="absolute"
      h="2em"
      w="100%"
      color="icon.secondary"
      cursor="pointer"
    >
      {PopoverComponent}
    </Box>
  );
};
