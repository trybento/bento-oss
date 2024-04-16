import React, { useCallback, useMemo, useState } from 'react';
import { Button, FormLabel, Text, Box, HStack, VStack } from '@chakra-ui/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import {
  AttributeRuleArgs,
  AttributeType,
  Events,
  GuideState,
  ReturnPromiseType,
  RulesDisplayType,
  RuleTypeEnum,
} from 'bento-common/types';
import {
  CheckResults,
  LaunchMethod,
  LaunchFailureReason,
} from 'bento-common/types/diagnostics';
import {
  RawRule,
  SupportedAttributeValueTypes,
  TargetingType,
} from 'bento-common/types/targeting';

import { BentoLoadingSpinner } from 'components/TableRenderer';
import useAccessToken from 'hooks/useAccessToken';
import InfoCard from 'system/InfoCard';

import Tooltip from 'system/Tooltip';
import TroubleshootFailState from '../common/TroubleshootFailState';
import AudienceRulesDisplay from 'components/Templates/AudienceGroupRulesDisplay';
import { testLaunchingRules } from './troubleshoot.helpers';
import { useTroubleshooterContext } from '../TroubleshooterProvider';
import useToast from 'hooks/useToast';
import TroubleshootUserSelection from '../common/TroubleshootUserSelection';
import { FailureReason, FAIL_REASONS, FAIL_RECS } from './troubleshootingCopy';
import TroubleshootSelectedContentCard from '../common/TroubleshootSelectedContentCard';
import { AUDIENCE_ATTR_NAME } from 'bento-common/utils/targeting';
import TargetingAudienceProvider, {
  useTargetingAudiencesContext,
} from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import InlineLink from 'components/common/InlineLink';

type FailedTargetingTest = ReturnPromiseType<typeof testLaunchingRules>;

/**
 * If an object, it means we have targeting information
 * If a string/enum value, we'll show a prepared error that matches the case
 */
type FailureContext = FailedTargetingTest | LaunchFailureReason;

const getFailureReason = (failed: FailureContext): FailureReason => {
  if (typeof failed !== 'object') {
    if (failed === LaunchFailureReason.notAutoLaunched)
      return FailureReason.notAutoLaunched;

    if (failed === LaunchFailureReason.notAddedToGuide)
      return FailureReason.notAddedToGuide;

    if (failed === LaunchFailureReason.completed)
      return FailureReason.completed;

    if (failed === LaunchFailureReason.pausedManualLaunch)
      return FailureReason.pausedManualLaunch;

    return FailureReason.blocked;
  }

  if (failed?.guideState === GuideState.expired) return FailureReason.expiry;
  if (failed?.obsoletedAt) return FailureReason.obsoleted;

  return FailureReason.targeting;
};

const TroubleshootTargetingCheck: React.FC<{}> = () => {
  const [failed, setFailed] = useState<FailureContext>(null);
  const [launchMethod, setLaunchMethod] = useState<LaunchMethod>(
    LaunchMethod.auto
  );
  const [loading, setLoading] = useState(false);
  const {
    contentSelection,
    accountUser,
    setAccount,
    account,
    setAccountUser,
    handleNext,
    handleBack,
    onReset: onDone,
    requestId,
  } = useTroubleshooterContext();
  const { entityId: contentEntityId } = contentSelection || {};

  const toast = useToast();
  const { accessToken } = useAccessToken();

  const handleAccountChange = useCallback(
    (wipe = false) =>
      (value) => {
        setAccount(value);
        if (wipe) setAccountUser(null);
      },
    []
  );

  const handleAccountUserChange = useCallback(
    (wipe = false) =>
      (value) => {
        setAccountUser(value);
        if (wipe) setAccount(null);
      },
    []
  );

  const handleTestAndNext = useCallback(async () => {
    try {
      setLoading(true);

      /* Check targeting */
      const res = await testLaunchingRules({
        accessToken,
        accountEntityId: account.entityId,
        accountUserEntityId: accountUser.entityId,
        templateEntityId: contentEntityId,
      });

      if (res.launchMethod) setLaunchMethod(res.launchMethod);

      if (res.failureReason) {
        /** General failure reasons */
        setFailed(res.failureReason);
      } else if (
        /** Failure reasons involving targeting */
        res.accountMismatches?.length ||
        res.accountUserMismatches?.length ||
        res.guideState === GuideState.expired ||
        res.obsoletedAt
      ) {
        setFailed(res);
      } else {
        handleNext();
      }
    } catch (e) {
      console.error(e);
      toast({
        status: 'error',
        title: 'Something went wrong. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    account?.entityId,
    accountUser?.entityId,
    contentEntityId,
    requestId.value,
  ]);

  const handleReset = useCallback(() => {
    setFailed(null);
  }, []);

  const failReason = getFailureReason(failed);

  return (
    <VStack w="xl">
      {loading && (
        <InfoCard w="full" h="xs">
          <BentoLoadingSpinner />
        </InfoCard>
      )}

      {/* We set display instead of removing elements to prevent state loss and re-fetch */}
      <Box w="xl" display={!loading ? undefined : 'none'}>
        {failed && (
          <TargetingAudienceProvider>
            <TroubleshootFailState
              reason={FAIL_REASONS[failReason]}
              recommendations={
                FAIL_RECS({
                  contentEntityId,
                  accountEntityId: account?.entityId,
                  launchMethod,
                })[failReason]
              }
            >
              {failReason !== FailureReason.blocked &&
              typeof failed === 'object' ? (
                <FailedTargetingDisplay failedTargetingTest={failed} />
              ) : undefined}
            </TroubleshootFailState>
          </TargetingAudienceProvider>
        )}

        <Box display={!failed ? undefined : 'none'}>
          <TroubleshootSelectedContentCard />

          <TroubleshootUserSelection
            accountUserEntityId={accountUser?.entityId}
            accountEntityId={account?.entityId}
            handleAccountChange={handleAccountChange}
            handleAccountUserChange={handleAccountUserChange}
          />
        </Box>

        <HStack justifyContent="flex-end" w="full">
          <Button
            onClick={failed ? handleReset : handleBack}
            variant="secondary"
          >
            Back
          </Button>
          <Button
            isDisabled={!accountUser?.entityId}
            onClick={failed ? onDone : handleTestAndNext}
          >
            {failed ? 'Done' : 'Next'}
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
};

export default TroubleshootTargetingCheck;

const AttributeDisplay: React.FC<{
  attributes: CheckResults[];
  entityName: string;
  hideSection: AttributeType;
}> = ({ attributes, entityName, hideSection }) => {
  /** Filter and format as rules so we can use the rules display component */
  const formattedAttributes: AttributeRuleArgs[] = useMemo(() => {
    /** De-dupes multi fails on same attribute */
    const addedNames = new Set<string>();

    return attributes.reduce<AttributeRuleArgs[]>((a, result) => {
      if (
        result.attribute !== AUDIENCE_ATTR_NAME &&
        !addedNames.has(result.attribute)
      ) {
        a.push({
          attribute: result.attribute,
          ruleType: RuleTypeEnum.equals,
          value: result.attrValue as SupportedAttributeValueTypes,
          valueType: result.valueType,
        });

        addedNames.add(result.attribute);
      }
      return a;
    }, []);
  }, [attributes]);

  /** Somewhat arbitrary but prevent needless hover elements */
  const hideTooltip = entityName.length < 20;

  return (
    <Box>
      <FormLabel fontSize="xs" variant="secondary" fontWeight="semibold">
        <Tooltip
          isDisabled={hideTooltip}
          display="inline"
          placement="top"
          label={entityName}
        >
          <Text display="inline" maxW="100%" textOverflow="ellipsis">
            {entityName}
          </Text>
        </Tooltip>{' '}
        attribute(s):
      </FormLabel>
      <Box>
        <AudienceRulesDisplay
          label="Account rules:"
          formLabelProps={{ fontSize: 'xs' }}
          targets={{
            accountUser: {
              type: TargetingType.attributeRules,
              groups: [{ rules: formattedAttributes as RawRule[] }],
            },
            account: {
              type: TargetingType.attributeRules,
              groups: [{ rules: formattedAttributes as RawRule[] }],
            },
          }}
          type={RulesDisplayType.plain}
          hideSection={hideSection}
          gap="0"
          hideRulesTextCopy
          hideBlockedAccounts
          listForm
        />
      </Box>
    </Box>
  );
};

const FailedTargetingDisplay: React.FC<{
  failedTargetingTest: FailedTargetingTest;
}> = ({ failedTargetingTest }) => {
  const {
    accountMismatches = [],
    accountUserMismatches = [],
    targets,
  } = failedTargetingTest ?? {};

  const { audiences } = useTargetingAudiencesContext();

  const failedAudience = useMemo(() => {
    const aEid = [...accountMismatches, ...accountUserMismatches].find(
      (m) => m.attribute === AUDIENCE_ATTR_NAME
    )?.ruleValue;

    if (!aEid) return null;

    return audiences.find((a) => a.entityId === aEid);
  }, [accountMismatches, accountUserMismatches, audiences]);

  return (
    <InfoCard w="full">
      <VStack w="full">
        <Box w="full">
          <Text>
            {accountMismatches.length
              ? "We are only showing Account rules that don't match. User rules could also not match, so we suggest checking rules carefully."
              : 'Account rules match but user rules do not:'}
          </Text>
        </Box>
        {failedAudience && (
          <Box my="2" w="full">
            <Text>
              This guide is using a saved audience,{' '}
              <InlineLink
                isExternal
                href={`/command-center/audiences/${failedAudience.entityId}`}
              >
                "{failedAudience.name}" <OpenInNewIcon fontSize="inherit" />
              </InlineLink>
            </Text>
          </Box>
        )}
        {accountMismatches.length > 0 && (
          <HStack w="full" spacing="4" alignItems="flex-start">
            <Box flexBasis="0" flexGrow="1">
              <FormLabel
                fontSize="xs"
                variant="secondary"
                fontWeight="semibold"
              >
                Account rules:
              </FormLabel>
              <AudienceRulesDisplay
                label="Account rules:"
                formLabelProps={{ fontSize: 'xs' }}
                targets={targets}
                type={RulesDisplayType.plain}
                hideSection={AttributeType.accountUser}
                gap="0"
                hideRulesTextCopy
                hideBlockedAccounts
              />
            </Box>
            <Box flexBasis="0" flexGrow="1">
              <AttributeDisplay
                entityName={failedTargetingTest.accountName}
                attributes={accountMismatches}
                hideSection={AttributeType.accountUser}
              />
            </Box>
          </HStack>
        )}
        {accountUserMismatches.length > 0 && (
          <HStack w="full" spacing="4" alignItems="flex-start">
            <Box flexBasis="0" flexGrow="1">
              <FormLabel
                fontSize="xs"
                variant="secondary"
                fontWeight="semibold"
              >
                User rules:
              </FormLabel>
              <AudienceRulesDisplay
                label="User rules:"
                targets={targets}
                formLabelProps={{ fontSize: 'xs' }}
                type={RulesDisplayType.plain}
                hideSection={AttributeType.account}
                gap="0"
                hideRulesTextCopy
                hideBlockedAccounts
              />
            </Box>
            <Box flexBasis="0" flexGrow="1">
              <AttributeDisplay
                entityName={failedTargetingTest.accountUserName}
                attributes={accountUserMismatches}
                hideSection={AttributeType.account}
              />
            </Box>
          </HStack>
        )}
      </VStack>
    </InfoCard>
  );
};
