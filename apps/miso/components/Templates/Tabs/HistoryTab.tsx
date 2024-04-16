import React, { useMemo } from 'react';
import { graphql } from 'react-relay';
import { Box, Text, HStack, VStack, Tooltip, Icon } from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import { format, isToday, isBefore } from 'date-fns';
import PauseIcon from '@mui/icons-material/Pause';

import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { AuditEvent } from 'bento-common/types';
import CalloutText from 'bento-common/components/CalloutText';

import { BentoLoadingSpinner } from 'components/TableRenderer';
import QueryRenderer from 'components/QueryRenderer';
import { HistoryTabQuery } from 'relay-types/HistoryTabQuery.graphql';
import {
  DATA_START_DATE,
  groupAuditEvents,
  ProcessedResults,
} from './templateTabs.helpers';
import Avatar from 'system/Avatar';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';
import colors from 'helpers/colors';
import { MODULE_ALIAS_SINGULAR, TABLE_SPINNER_SIZE } from 'helpers/constants';
import TargetingAudienceProvider from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import { EVENT_DESCRIPTIONS } from './Audit/auditTab.helpers';
import AuditEventAdditionalInfo from './Audit/AuditEventAdditionalInfo';

type CProps = {
  templateEntityId: string;
};

type HistoryTabQueryResponse = HistoryTabQuery['response'];

interface Props extends CProps, HistoryTabQueryResponse {}

/** A single event */
const AuditEventSingle: React.FC<{
  auditEvent: ProcessedResults;
  renderLine: boolean;
}> = ({ auditEvent, renderLine }) => {
  const { timestamp, eventName, user, data } = auditEvent;
  const timestampLabel = format(timestamp, 'p');
  const eventLabel = useMemo(() => {
    return (
      EVENT_DESCRIPTIONS[eventName as AuditEvent]?.replace(
        '%s',
        eventName === AuditEvent.subContentChanged && data[0]?.moduleName
          ? data[0].moduleName
          : capitalizeFirstLetter(MODULE_ALIAS_SINGULAR)
      ) || 'Unknown audit event'
    );
  }, [eventName, data[0]?.moduleName]);

  /** Hides launch changes logged by state toggles (no targeting info) */
  if (eventName === AuditEvent.autolaunchChanged && isEmpty(data?.[0]))
    return null;

  return (
    <HStack position="relative">
      <Box
        position="relative"
        display="inline-flex"
        alignSelf="flex-start"
        pt="1"
      >
        <Tooltip placement="top" label={user?.fullName}>
          <Box zIndex="1" outline={`7px solid ${DEFAULT_COLORS.background}`}>
            <Avatar
              size="xs"
              name={user?.fullName}
              src={user?.avatarUrl}
              hideTitle
            />
          </Box>
        </Tooltip>
        {renderLine && (
          <Box
            borderLeft={`1px solid ${colors.gray[200]}`}
            position="absolute"
            background="transparent"
            h="140%"
            top="100%"
            left="50%"
          />
        )}
      </Box>
      <VStack alignItems="flex-start" spacing="0" lineHeight="1.2em">
        <Text mt="1" fontWeight="semibold">
          {eventLabel}{' '}
          {eventName === AuditEvent.paused && (
            <Icon
              as={PauseIcon}
              mr="1"
              color={DEFAULT_COLORS.secondaryIcon}
              transform="scale(0.7)"
              position="absolute"
              top="0"
            />
          )}
        </Text>
        <AuditEventAdditionalInfo auditEvent={auditEvent} />
        <Text mt="1" color={DEFAULT_COLORS.secondaryText}>
          {timestampLabel}
        </Text>
      </VStack>
    </HStack>
  );
};

/** A group of events for a day */
const AuditEventSection: React.FC<{ auditTrail: ProcessedResults[] }> = ({
  auditTrail,
}) => {
  const date = auditTrail[0].timestamp;
  const label = isToday(date) ? 'Today' : format(date, 'MMMM d');

  return (
    <HStack mb="6">
      <Box w="120px" alignSelf="flex-start">
        <Text size="md" fontWeight="semibold">
          {label}
        </Text>
      </Box>
      <VStack spacing="6" alignItems="flex-start">
        {auditTrail.map((auditEvent, i) => (
          <AuditEventSingle
            key={`event-single-${i}`}
            auditEvent={auditEvent}
            renderLine={i < auditTrail.length - 1}
          />
        ))}
      </VStack>
    </HStack>
  );
};

const HistoryTab: React.FC<Props> = ({
  templateAuditTrail,
  templateEntityId,
}) => {
  const processedTrail = React.useMemo(
    () => groupAuditEvents(templateAuditTrail),
    [templateAuditTrail]
  );

  const showOldGuideCallout = useMemo(() => {
    if (!templateAuditTrail) return false;
    const launchEntry = templateAuditTrail[templateAuditTrail.length - 1];
    const guideLaunchedAt = new Date(launchEntry.timestamp as string);
    return isBefore(guideLaunchedAt, DATA_START_DATE);
  }, [templateAuditTrail]);

  return (
    <TargetingAudienceProvider>
      <Box>
        {processedTrail.map((auditTrail, idx) => (
          <AuditEventSection key={`trail-${idx}`} auditTrail={auditTrail} />
        ))}
        {showOldGuideCallout && (
          <CalloutText maxW="3xl">
            We have limited guide history before May 2022, so please take any
            data before then with a grain of 🧂
          </CalloutText>
        )}
      </Box>
    </TargetingAudienceProvider>
  );
};

const TEMPLATE_AUDIT_QUERY = graphql`
  query HistoryTabQuery($templateEntityId: EntityId!) {
    templateAuditTrail: templateAuditTrail(
      templateEntityId: $templateEntityId
    ) {
      eventName
      timestamp
      user {
        fullName
        avatarUrl
      }
      data
    }
  }
`;

export default function HistoryTabQueryRenderer(cProps: CProps) {
  const { templateEntityId } = cProps;

  return (
    <QueryRenderer<HistoryTabQuery>
      query={TEMPLATE_AUDIT_QUERY}
      variables={{
        templateEntityId,
      }}
      render={({ props }) => {
        if (props) return <HistoryTab {...cProps} {...props} />;

        return <BentoLoadingSpinner h="70vh" size={TABLE_SPINNER_SIZE} />;
      }}
    />
  );
}
