import React, { useMemo } from 'react';
import {
  Flex,
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverProps,
} from '@chakra-ui/react';

import { RulesDisplayType } from 'bento-common/types';
import { NpsPageTargetingType } from 'bento-common/types/netPromoterScore';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import { turnEverythingIntoValue } from 'bento-common/utils/targeting';

import PopoverContent from 'system/PopoverContent';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import NpsDetailsQuery from 'queries/NpsDetailsQuery';
import { Section } from './TemplateDetailsPopover';
import AudienceRulesDisplay from 'components/Templates/AudienceRulesDisplay';
import { commonTargetingToAutolaunchContext } from 'components/EditorCommon/targeting.helpers';
import { getAutoLaunchMutationArgs } from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';
import { DETAILS_POPOVER_TRIGGER_DELAY } from 'helpers/constants';

type Props = {
  npsEntityId: string;
} & PopoverProps;

export default function NpsDetailsPopover({
  npsEntityId,
  children,
  ...popoverProps
}: React.PropsWithChildren<Props>) {
  const { data, loading } = useQueryAsHook(NpsDetailsQuery, { npsEntityId });
  const { npsSurvey } = data || {};
  const { pageTargeting, targets } = npsSurvey || {};

  const autoLaunchData = useMemo(() => {
    if (!targets) return null;

    const alContext = getAutoLaunchMutationArgs(
      commonTargetingToAutolaunchContext(targets)
    );

    return {
      autoLaunchRules: alContext?.autoLaunchRules?.map((original) => ({
        ...original,
        rules: original.rules?.map((rule) => turnEverythingIntoValue(rule)),
      })),
      targets: alContext?.targets?.map((original) => ({
        ...original,
        rules: original.rules?.map((rule) => turnEverythingIntoValue(rule)),
      })),
    };
  }, [targets]);

  if (loading) return <BentoLoadingSpinner />;

  return (
    <Popover
      trigger="hover"
      lazyBehavior="unmount"
      openDelay={DETAILS_POPOVER_TRIGGER_DELAY}
      isLazy
      {...popoverProps}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent w="370px">
        <PopoverBody>
          <Flex flexDir="column" gap="3">
            <Box fontSize="sm" fontWeight="bold" mb="4" color="gray.800">
              Survey details
            </Box>
            <Section label="Question">{npsSurvey.question}</Section>
            {autoLaunchData && (
              <Section label="Audience">
                <AudienceRulesDisplay
                  autoLaunchData={autoLaunchData}
                  type={RulesDisplayType.plain}
                />
              </Section>
            )}
            <Section label="Location">
              {pageTargeting.type === NpsPageTargetingType.anyPage ? (
                <Text fontSize="xs">Any page</Text>
              ) : (
                <Flex flexDir="column" gap="4" fontSize="xs">
                  <Flex flexDir="column" gap="1" overflowWrap="anywhere">
                    <Box>Specific page</Box>
                    {pageTargeting.url ? (
                      wildcardUrlToDisplayUrl(pageTargeting.url)
                    ) : (
                      <i>Not set</i>
                    )}
                  </Flex>
                </Flex>
              )}
            </Section>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
