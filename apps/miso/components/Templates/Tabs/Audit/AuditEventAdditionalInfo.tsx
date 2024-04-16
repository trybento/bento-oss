import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Text,
  HStack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
} from '@chakra-ui/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { STANDARD_SHADOW } from 'bento-common/frontend/styles';
import { AuditEvent, RulesDisplayType } from 'bento-common/types';
import { audienceRuleToAudience } from 'bento-common/utils/targeting';
import { isAllTargeting, ProcessedResults } from '../templateTabs.helpers';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import AudienceGroupRulesDisplay from '../../AudienceGroupRulesDisplay';
import { useTargetingAudiencesContext } from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import { Highlight } from 'components/common/Highlight';

import {
  auditEventHasTargetingInfo,
  getAuditTargetingInfo,
  getEventAccountNames,
} from './auditTab.helpers';
import { AudiencePopoverContent } from 'components/EditorCommon/Audiences/AudiencePopoverItem';
import H5 from 'system/H5';

enum InfoType {
  accounts = 'accounts',
  targeting = 'targeting',
}

/** Additional data on the audit event */
const AuditEventAdditionalInfo: React.FC<{ auditEvent: ProcessedResults }> = ({
  auditEvent,
}) => {
  const { audiences } = useTargetingAudiencesContext();

  const hasData = auditEvent.data && auditEvent.data.length;

  const infoType = useMemo<InfoType | null>(() => {
    if (
      auditEvent.eventName === AuditEvent.manualLaunch &&
      hasData &&
      auditEvent.data.some((d) => !!d.accountName)
    )
      return InfoType.accounts;

    if (
      auditEvent.eventName === AuditEvent.autolaunchChanged &&
      hasData &&
      auditEventHasTargetingInfo(auditEvent)
    )
      return InfoType.targeting;

    return null;
  }, [auditEvent]);

  const label = auditEvent.data.length > 1 ? 'Accounts' : 'Account';
  const accountNames = useMemo(
    () =>
      infoType === InfoType.accounts
        ? getEventAccountNames(auditEvent).join(', ')
        : null,
    [auditEvent, infoType]
  );

  const { targets, targetsAll, usedAudience } = useMemo(() => {
    if (infoType !== InfoType.targeting) return {};

    const targets = getAuditTargetingInfo(auditEvent);

    const targetsAll = isAllTargeting(targets);

    const usedAudience = targets?.audiences
      ? audiences.find(
          (a) => a.entityId === audienceRuleToAudience(targets.audiences)
        )
      : null;

    return {
      targets,
      targetsAll,
      usedAudience,
    };
  }, [auditEvent, audiences, infoType]);

  const handleSeeAudience = useCallback(
    () =>
      usedAudience
        ? window.open(
            `/command-center/audiences/${usedAudience.entityId}`,
            '_blank'
          )
        : undefined,
    [usedAudience]
  );

  if (!infoType) return null;

  if (infoType === InfoType.accounts)
    return (
      <Text mt="1" color={DEFAULT_COLORS.secondaryText}>
        {label}: {accountNames}
      </Text>
    );

  return (
    <Text mt="1" color={DEFAULT_COLORS.secondaryText}>
      <Popover trigger="hover" placement="bottom-start">
        <PopoverTrigger>
          <HStack
            _hover={{ fontWeight: 'semibold' }}
            color={DEFAULT_COLORS.secondaryText}
            cursor="pointer"
            position="relative"
            spacing="0"
          >
            <Text>
              {usedAudience
                ? `Saved audience: "${usedAudience.name}"`
                : targetsAll
                ? 'All users'
                : 'One-off rules'}
            </Text>
            <Icon
              as={InfoOutlinedIcon}
              mr="1"
              color={DEFAULT_COLORS.secondaryIcon}
              transform="scale(0.7)"
            />
          </HStack>
        </PopoverTrigger>
        <PopoverContent
          boxShadow={STANDARD_SHADOW}
          maxW="420px"
          minW="320px"
          w="auto"
        >
          <PopoverBody px="4" pb="4" fontSize="xs">
            {usedAudience ? (
              <AudiencePopoverContent
                audienceEntityId={usedAudience.entityId}
                targets={usedAudience.targets}
                handleViewAudience={handleSeeAudience}
              />
            ) : (
              <>
                <H5 mt="2" mb="4" fontSize="sm">
                  {usedAudience ? 'Audience details' : 'One-off rules details'}
                </H5>
                {targets?.audiences && !usedAudience ? (
                  <Box p="4">
                    <Highlight fontStyle="italic">Deleted audience</Highlight>
                  </Box>
                ) : (
                  <AudienceGroupRulesDisplay
                    targets={usedAudience?.targets ?? targets}
                    mt="4"
                    type={RulesDisplayType.plain}
                    onSeeDetails={handleSeeAudience}
                    compact={!!usedAudience}
                    preventAbridge={!usedAudience}
                    hideBlockedAccounts
                  />
                )}
              </>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Text>
  );
};

export default AuditEventAdditionalInfo;
