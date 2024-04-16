import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Text,
  UnorderedList,
  ListItem,
  Flex,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { Modal } from 'bento-common/components/Modal';
import getOrdinalSuffix from 'bento-common/utils/getOrdinalSuffix';
import { pluralize } from 'bento-common/utils/pluralize';
import {
  GuideDesignType,
  GuideFormFactor,
  RulesDisplayType,
} from 'bento-common/types';
import { isAnnouncementGuide } from 'bento-common/utils/formFactor';
import { roundToPSTHour } from 'bento-common/utils/dates';
import CalloutText, {
  CalloutTypes,
  SuccessCallout,
  WarningCallout,
} from 'bento-common/components/CalloutText';
import { GroupTargeting } from 'bento-common/types/targeting';
import { isSplitTestGuide } from 'bento-common/data/helpers';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';
import { audienceRuleToAudience } from 'bento-common/utils/targeting';
import ModalBody from 'system/ModalBody';
import Box from 'system/Box';
import Button from 'system/Button';
import { TemplateOverflowMenuButton_template$data } from 'relay-types/TemplateOverflowMenuButton_template.graphql';
import AutoLaunchStatsQuery from './AutoLaunchStatsQuery';
import AudienceGroupRulesDisplay from './AudienceGroupRulesDisplay';
import { useTemplate } from 'providers/TemplateProvider';
import {
  useGuideSchedulingThrottling,
  useInternalGuideNames,
} from 'hooks/useFeatureFlag';
import SimpleDateWithTimezoneTooltip from 'components/SimpleDateWithTimezoneTooltip';
import { getFormEntityLabel } from 'utils/helpers';
import Span from 'system/Span';
import Checkbox from 'system/Checkbox';
import * as TestAutolaunchRulesMutation from 'mutations/TestAutolaunchRules';
import { getSortedRankableTargets } from './Tabs/PriorityRankingForm/helpers';
import InlineLink from 'components/common/InlineLink';
import { isAllTargeting } from './Tabs/templateTabs.helpers';
import { sanitizeTargeting } from 'components/EditorCommon/targeting.helpers';
import { TemplateTargetsInputType } from 'relay-types/TestAutolaunchRulesMutation.graphql';
import { useTargetingAudiencesContext } from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import H6 from 'system/H6';

type Props = {
  template: Pick<
    TemplateOverflowMenuButton_template$data,
    | 'entityId'
    | 'name'
    | 'isAutoLaunchEnabled'
    | 'enableAutoLaunchAt'
    | 'disableAutoLaunchAt'
    | 'formFactor'
    | 'designType'
    | 'type'
    | 'splitTargets'
    | 'targets'
  >;
  isOpen?: boolean;
  targeting?: GroupTargeting;
  onConfirm: (remove: boolean) => void;
  onClose: () => void;
  /** Indicate we're firing from a place where targeting is dirty/saving */
  editor?: boolean;
};

export default function LaunchModal({
  template,
  isOpen,
  onConfirm,
  targeting,
  onClose,
  editor,
}: Props) {
  const {
    isAutoLaunchEnabled,
    enableAutoLaunchAt,
    disableAutoLaunchAt,
    splitTargets,
  } = template;
  const {
    template: providerTemplate,
    launchPriority,
    isSaving,
    isLaunchingOrPausing,
  } = useTemplate();
  const isSplitTest = isSplitTestGuide(template.type as any);
  const formEntityLabel = getFormEntityLabel({ isSplitTest });
  const isEditing = editor;
  const targets = targeting || (template.targets as GroupTargeting);
  const router = useRouter();

  const [_launchPriority, setLaunchPriority] = useState(launchPriority);
  const throttlingEnabled = useGuideSchedulingThrottling();
  const enabledInternalNames = useInternalGuideNames();
  const { audiences } = useTargetingAudiencesContext();

  const [remove, setRemove] = useState(false);

  const start = useMemo(
    () =>
      enableAutoLaunchAt &&
      (throttlingEnabled
        ? roundToPSTHour(3, new Date(enableAutoLaunchAt))
        : new Date(enableAutoLaunchAt)),
    [enableAutoLaunchAt, throttlingEnabled]
  );

  const end = useMemo(
    () => disableAutoLaunchAt && new Date(disableAutoLaunchAt),
    [disableAutoLaunchAt]
  );

  /**
   * Gets the displayed launch rank.
   */
  const getAutolaunchPosition = useCallback(async () => {
    const rankableTargets = await getSortedRankableTargets({
      enabledInternalNames,
    });
    if (!rankableTargets.length) return launchPriority;

    const order = rankableTargets.findIndex(
      (autoLaunchable) => autoLaunchable.entityId === template.entityId
    );

    setLaunchPriority(order === -1 ? rankableTargets.length : order);
  }, [launchPriority]);

  useEffect(() => {
    if (!isOpen) return;

    if (!providerTemplate) void getAutolaunchPosition();
    else
      setLaunchPriority(
        providerTemplate.priorityRanking === DEFAULT_PRIORITY_RANKING
          ? launchPriority
          : providerTemplate.priorityRanking
      );
  }, [providerTemplate, isOpen]);

  const [autoLaunchAudienceCount, setAutoLaunchAudienceCount] = useState<
    number | null
  >(null);

  const getAutoLaunchStats = useCallback(async () => {
    if (targeting) {
      const response = await TestAutolaunchRulesMutation.commit({
        targets: sanitizeTargeting(
          targeting,
          !!targeting.audiences
        ) as TemplateTargetsInputType,
      });

      setAutoLaunchAudienceCount(
        response.testAutolaunchRules.accountUsers || 0
      );
    } else {
      const response = await AutoLaunchStatsQuery(template.entityId);

      setAutoLaunchAudienceCount(response.template.autoLaunchAudienceCount);
    }
  }, [template.entityId, targeting]);

  useEffect(() => {
    if (isOpen) {
      getAutoLaunchStats();
    }
  }, [isOpen]);

  const priorityRank = _launchPriority + 1;

  const targetsAll = isAllTargeting(targets as GroupTargeting);

  const usedAudience = useMemo(() => {
    if (!targets) return;

    const audienceEntityId = audienceRuleToAudience(targets.audiences);

    if (audienceEntityId)
      return audiences.find((a) => a.entityId === audienceEntityId);

    return null;
  }, [targets?.audiences, audiences?.length]);

  const audienceComponent = useMemo(
    () =>
      usedAudience ? (
        <Text mt="4">
          <Span fontWeight="bold">{autoLaunchAudienceCount}</Span>{' '}
          {pluralize(autoLaunchAudienceCount, 'person', 'people')} currently{' '}
          {pluralize(autoLaunchAudienceCount, 'is', 'are')} in the saved
          audience "
          <Text fontStyle="italic" display="inline">
            {usedAudience.name}
          </Text>
          "
        </Text>
      ) : (
        <Text mt="4">
          <Span fontWeight="bold">{autoLaunchAudienceCount}</Span>{' '}
          {pluralize(autoLaunchAudienceCount, 'person', 'people')} currently{' '}
          {pluralize(autoLaunchAudienceCount, 'meets', 'meet')} these targeting
          rules.
        </Text>
      ),
    [autoLaunchAudienceCount, usedAudience]
  );

  const handleSeeDetails = useCallback(() => {
    if (usedAudience) {
      window.open(
        `/command-center/audiences/${usedAudience.entityId}`,
        '_blank'
      );
    } else {
      router.push(`/library/templates/${template.entityId}?tab=launching`);
      onClose();
    }
  }, [template.entityId, usedAudience, onClose]);

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing
            ? `Edit ${formEntityLabel} launch`
            : isAutoLaunchEnabled
            ? isSplitTest
              ? 'Stop split test'
              : `Stop launching`
            : `Launch ${formEntityLabel}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0">
          {isAutoLaunchEnabled && !!disableAutoLaunchAt && !isEditing && (
            <CalloutText calloutType={CalloutTypes.Info} mb={3}>
              This {formEntityLabel} is already scheduled to stop launching on{' '}
              <SimpleDateWithTimezoneTooltip date={end} />.
            </CalloutText>
          )}
          {!isAutoLaunchEnabled && !!enableAutoLaunchAt && !isEditing && (
            <CalloutText calloutType={CalloutTypes.Info} mb={3}>
              This {formEntityLabel} is already scheduled to launch on{' '}
              <SimpleDateWithTimezoneTooltip date={start} />.
            </CalloutText>
          )}
          {isAutoLaunchEnabled && !isEditing ? (
            <Box>
              <Box mb="4">
                {isSplitTest ? (
                  `You’re about to stop this split test.`
                ) : (
                  <Text>
                    This action will stop <b>new users</b> from getting this
                    experience.
                  </Text>
                )}
              </Box>

              {isSplitTest ? (
                <UnorderedList ml="6" mt="2" fontSize="md">
                  <ListItem>All guides in this test will be stopped.</ListItem>
                  <ListItem>
                    If you would like to relaunch a guide, you can do that from
                    the guide page.
                  </ListItem>
                </UnorderedList>
              ) : (
                <Flex flexDirection="column" gap={4} alignContent="flex-start">
                  <Text>
                    <b>
                      Do you also want to remove this from users that already
                      have?
                    </b>
                  </Text>
                  <Checkbox
                    m="0"
                    isChecked={remove}
                    onChange={(e) => setRemove(e.target.checked)}
                  >
                    Remove from existing users
                  </Checkbox>
                </Flex>
              )}
              {isSplitTest && (
                <SuccessCallout mt="6">
                  Stopping a split test only affects new accounts. Accounts who
                  already have one of the split test guides will continue to
                  have it.
                </SuccessCallout>
              )}
            </Box>
          ) : isSplitTest ? (
            <Box>
              <Text mb="1">
                Traffic will be split <b>evenly</b> amongst these guides:
              </Text>
              <Flex
                gap="3"
                flexDir="column"
                fontSize="xs"
                bg="gray.50"
                px="4"
                py="2"
              >
                {splitTargets.map((st, i) => (
                  <Box key={`st-${i}`}>
                    {st
                      ? guidePrivateOrPublicNameOrFallback(
                          enabledInternalNames,
                          st
                        )
                      : '(no guide)'}
                  </Box>
                ))}
              </Flex>
              {audienceComponent}
              <AudienceGroupRulesDisplay
                targets={(usedAudience?.targets ?? targets) as GroupTargeting}
                mt="4"
                label={
                  <Box color="black" fontWeight="normal">
                    Guide launches will be split <b>by accounts</b> based on
                    these targeting rules:
                  </Box>
                }
                type={RulesDisplayType.gray}
                hideBlockedAccounts
                compact
              />
              <WarningCallout my="4">
                Once this test is launched, you will not be able to edit the
                content inside of any of the guides or the targeting rules. You
                can always stop the test and relaunch a new test if needed.
              </WarningCallout>
            </Box>
          ) : (
            <Box>
              {audienceComponent}
              {autoLaunchAudienceCount === 0 && !targetsAll && (
                <Text color="warning.text" mt="2">
                  ⚠️ A common issue is using <b>AND</b> instead of <b>OR</b> in
                  your rules.
                </Text>
              )}
              <Box mt="4">
                {!!usedAudience && <H6>Saved audience rules:</H6>}
                <AudienceGroupRulesDisplay
                  targets={(usedAudience?.targets ?? targets) as GroupTargeting}
                  type={RulesDisplayType.gray}
                  onSeeDetails={handleSeeDetails}
                  forceSeeDetails={!!usedAudience}
                  hideTitle
                  hideBlockedAccounts
                  compact
                />
              </Box>
              {template.designType !== GuideDesignType.everboarding && (
                <Box mt="4">
                  This guide is the{' '}
                  <Text fontWeight="semibold" display="inline">
                    {`${priorityRank}${getOrdinalSuffix(priorityRank)}`}{' '}
                    priority
                  </Text>
                  .
                  {isAnnouncementGuide(
                    template.formFactor as GuideFormFactor
                  ) && (
                    <Text mt="2">
                      Announcements are{' '}
                      <InlineLink
                        label="throttled"
                        href="https://help.trybento.co/en/articles/6653546-announcement-throttling"
                      />{' '}
                      1x per session.
                    </Text>
                  )}
                </Box>
              )}
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack display="flex" justifyContent="flex-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Box>
              <Button
                onClick={() => onConfirm(remove)}
                isLoading={isSaving || isLaunchingOrPausing}
                isDisabled={isSaving || isLaunchingOrPausing}
                variant={isEditing || !isAutoLaunchEnabled ? 'solid' : 'red'}
              >
                {isEditing
                  ? 'Save changes'
                  : isAutoLaunchEnabled
                  ? isSplitTest
                    ? 'Stop now'
                    : 'Stop launching'
                  : 'Launch now'}
              </Button>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
