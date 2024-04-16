import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, FormLabel, UnorderedList, ListItem } from '@chakra-ui/react';
import uniqBy from 'lodash/uniqBy';

import { TableLoadingSpinner } from 'components/TableRenderer';
import Link from 'system/Link';

import EventAutocompletesQuery from 'queries/EventAutocompletesQuery';
import { EventAutocompletesQuery as EventAutocompletesQueryType } from 'relay-types/EventAutocompletesQuery.graphql';

interface ContainerProps {
  eventEntityId: string;
}

export function EventAutocompleteUsagePopover({
  eventEntityId,
}: ContainerProps) {
  const [attribute, setAttribute] =
    useState<EventAutocompletesQueryType['response']['customApiEvent']>(null);

  const getAttribute = useCallback(async () => {
    const response = await EventAutocompletesQuery(eventEntityId);

    setAttribute(response.customApiEvent);
  }, []);

  useEffect(() => {
    getAttribute();
  }, []);

  const uniqStepNames = useMemo(
    () => (attribute ? uniqBy(attribute.autocompletes, 'name') : []),
    [attribute]
  );

  if (!attribute) return <TableLoadingSpinner />;

  return (
    <Box display="grid" padding="1em 0em 1em 1em">
      <FormLabel>Completes the following steps:</FormLabel>
      <UnorderedList pl="2">
        {uniqStepNames.map((step) => {
          const stepName = step.name || '(unnamed step)';

          return (
            <ListItem key={step.entityId}>
              {step.templates.length ? (
                <Link
                  color="bento.bright"
                  href={`/library/templates/${step.templates[0].entityId}`}
                >
                  {stepName}
                </Link>
              ) : step.module ? (
                <Link
                  color="bento.bright"
                  href={`/library/step-groups/${step.module.entityId}`}
                >
                  {stepName}
                </Link>
              ) : null}
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
}
