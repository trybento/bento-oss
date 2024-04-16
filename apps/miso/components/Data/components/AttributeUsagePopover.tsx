import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, FormLabel, UnorderedList, ListItem } from '@chakra-ui/react';
import uniqBy from 'lodash/uniqBy';

import { TableLoadingSpinner } from 'components/TableRenderer';
import { AttributeType } from 'bento-common/types';
import Link from 'system/Link';

import AttributeAutocompletesQuery from 'queries/AttributeAutocompletesQuery';
import { AttributeAutocompletesQuery as AttributeAutocompletesQueryType } from 'relay-types/AttributeAutocompletesQuery.graphql';

import AttributeAutolaunchQuery from 'queries/AttributeAutolaunchesQuery';
import { AttributeAutolaunchesQuery } from 'relay-types/AttributeAutolaunchesQuery.graphql';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';

interface ContainerProps {
  attributeName: string;
  attributeType: AttributeType;
}

export function AttributeAutocompleteUsagePopover({
  attributeName,
  attributeType,
}: ContainerProps) {
  const [attribute, setAttribute] =
    useState<AttributeAutocompletesQueryType['response']['attribute']>(null);

  const getAttribute = useCallback(async () => {
    const response = await AttributeAutocompletesQuery(
      attributeName,
      attributeType as any
    );

    setAttribute(response.attribute);
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

export function AttributeAutolaunchUsagePopover({
  attributeName,
  attributeType,
}: ContainerProps) {
  const [attribute, setAttribute] =
    useState<AttributeAutolaunchesQuery['response']['attribute']>(null);
  const enabledInternalNames = useInternalGuideNames();

  const getAttribute = useCallback(async () => {
    const response = await AttributeAutolaunchQuery(
      attributeName,
      attributeType as any
    );

    setAttribute(response.attribute);
  }, []);

  useEffect(() => {
    getAttribute();
  }, []);

  const uniqTemplates = useMemo(
    () =>
      !attribute
        ? []
        : attribute.autolaunches.reduce(
            (a, al) => {
              a[al.createdFromTemplate?.entityId || al.entityId] = {
                tEntityId: al.createdFromTemplate?.entityId,
                name: guidePrivateOrPublicNameOrFallback(
                  enabledInternalNames,
                  al.createdFromTemplate || al
                ),
                gbEntityId: al.entityId,
              };
              return a;
            },
            {} as Record<
              string,
              {
                tEntityId?: string;
                name: string;
                gbEntityId?: string;
              }
            >
          ),
    [attribute, enabledInternalNames]
  );

  if (!attribute) return <TableLoadingSpinner />;

  return (
    <Box display="grid" padding="1em 0em 1em 1em">
      <FormLabel>Launches the following guides:</FormLabel>
      <UnorderedList pl="2">
        {Object.values(uniqTemplates).map((gb) => (
          <ListItem key={gb.tEntityId || gb.gbEntityId}>
            <Link
              color="bento.bright"
              href={
                gb.tEntityId
                  ? `/library/templates/${gb.tEntityId}?tab=targeting`
                  : `/guide-bases/${gb.gbEntityId}`
              }
            >
              {gb.name}
            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}
