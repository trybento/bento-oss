import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Spinner, FormLabel, BoxProps } from '@chakra-ui/react';
import { graphql } from 'react-relay';
import { useRouter } from 'next/router';
import isUuid from 'is-uuid';
import {
  AttributeType,
  AutolaunchRulesData,
  AutolaunchTargetsData,
  GuideTypeEnum,
  RulesDisplayType,
} from 'bento-common/types';
import Box from 'system/Box';
import QueryRenderer from 'components/QueryRenderer';
import { AudienceRulesDisplayQuery } from 'relay-types/AudienceRulesDisplayQuery.graphql';
import RulesText from './components/RulesText';
import {
  AccountTarget,
  AccountUserTarget,
} from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';
import BlockedAccountsQuery from 'queries/BlockedAccountsQuery';
import colors from 'helpers/colors';
import Link from 'system/Link';
import Text from 'system/Text';

interface Props extends BoxProps {
  autoLaunchData: {
    autoLaunchRules: readonly AutolaunchRulesData[];
    targets: readonly AutolaunchTargetsData[];
  };
  /** Not available for RulesDisplayType.plain. */
  label?: ReactNode;
  type?: RulesDisplayType;
  /** Whether to hide the UI for an attribute type. */
  hideSection?: AttributeType;
  hideBlockedAccounts?: boolean;
}

interface AudienceDisplayProps extends Props {
  templates?: AudienceRulesDisplayQuery['response']['templates'];
  organization?: AudienceRulesDisplayQuery['response']['organization'];
  blockedAccountsCount: number;
}

const boxStylesByType: Record<RulesDisplayType, BoxProps> = {
  [RulesDisplayType.gray]: { bg: 'gray.50', px: '4', py: '2' },
  [RulesDisplayType.plain]: {},
  [RulesDisplayType.warning]: { bg: colors.warning.bg, px: '4', py: '2' },
};

const AudienceRulesDisplay: React.FC<AudienceDisplayProps> = ({
  autoLaunchData,
  templates,
  organization,
  label = 'Audience rules:',
  type = RulesDisplayType.gray,
  gap = 4,
  blockedAccountsCount,
  hideSection,
  ...boxProps
}) => {
  const router = useRouter();
  const { hideUsers, hideAccounts } = useMemo(
    () => ({
      hideUsers: hideSection === AttributeType.accountUser,
      hideAccounts: hideSection === AttributeType.account,
    }),
    [hideSection]
  );

  const handleGoToSettings = useCallback(() => {
    router.push('/command-center?tab=blocked%20accounts');
  }, [router]);

  const plain = type === RulesDisplayType.plain;
  const warning = type === RulesDisplayType.warning;
  return (
    <Box {...boxProps}>
      {!plain && <FormLabel variant="secondary">{label}</FormLabel>}
      {autoLaunchData ? (
        <Box {...boxStylesByType[type]}>
          {warning && (
            <Text color={colors.warning.text} mb="4">
              Please check these rules are what you intended. You might want to
              use <b>any</b> instead of <b>all</b>.
            </Text>
          )}
          {!hideUsers && (
            <Box fontSize="xs">
              <RulesText
                typeLabel={GuideTypeEnum.user}
                targets={autoLaunchData?.targets as AccountUserTarget[]}
                templates={templates as any /* was readonly */}
                type={type}
              />
            </Box>
          )}
          {!hideAccounts && (
            <Box fontSize="xs" mt={hideUsers ? undefined : gap}>
              <RulesText
                typeLabel={GuideTypeEnum.account}
                targets={autoLaunchData?.autoLaunchRules as AccountTarget[]}
                branchingQuestion={organization?.branchingQuestions}
                type={type}
              />
            </Box>
          )}
          {blockedAccountsCount > 0 && (
            <Box fontSize="xs" w="full" mt={gap}>
              Blocked accounts will <b>not</b> receive this guide. View and
              manage all blocked accounts in the{' '}
              <Link
                size="sm"
                fontWeight="semibold"
                color="blue.500"
                onClick={handleGoToSettings}
              >
                Command center
              </Link>
            </Box>
          )}
        </Box>
      ) : (
        <Box py="4" px="6">
          <Spinner color="gray.500" />
        </Box>
      )}
    </Box>
  );
};

const TEMPLATE_DISPLAY_QUERY = graphql`
  query AudienceRulesDisplayQuery($templateEntityIds: [EntityId!]) {
    templates: findTemplates(entityIds: $templateEntityIds) {
      entityId
      name
    }
    organization {
      id
      branchingQuestions {
        id
        question
        branchingKey
        choices {
          id
          choiceKey
          label
        }
      }
    }
  }
`;

export default function AudienceRulesDisplayQueryRenderer(cProps: Props) {
  const [blockedAccountsCount, setBlockedAccountsCount] = useState(0);

  const templateEntityIds = React.useMemo(() => {
    const targets = cProps.autoLaunchData?.targets;

    if (!targets) return [];

    return targets.reduce((a, t) => {
      const templateTargetRules =
        t.rules?.filter(
          (r) =>
            r.valueType === 'template' &&
            isUuid.anyNonNil((r.value as string) || '')
        ) || [];
      a.push(...templateTargetRules.map((r) => String(r.value)));
      return a;
    }, [] as string[]);
  }, [cProps.autoLaunchData?.targets]);

  const getBlockedAccounts = useCallback(async () => {
    const res = await BlockedAccountsQuery();
    if (res.accounts) setBlockedAccountsCount(res.accounts.length);
  }, []);

  useEffect(() => {
    if (!cProps.hideBlockedAccounts) void getBlockedAccounts();
  }, []);

  return (
    <QueryRenderer<AudienceRulesDisplayQuery>
      query={TEMPLATE_DISPLAY_QUERY}
      fetchPolicy="store-or-network"
      variables={{ templateEntityIds }}
      render={({ props }) => {
        return (
          <AudienceRulesDisplay
            {...cProps}
            {...props}
            blockedAccountsCount={blockedAccountsCount}
          />
        );
      }}
    />
  );
}
