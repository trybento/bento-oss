import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormLabel, FormLabelProps, BoxProps, Flex } from '@chakra-ui/react';
import { graphql } from 'react-relay';
import { useRouter } from 'next/router';
import isUuid from 'is-uuid';
import {
  AttributeType,
  GuideTypeEnum,
  RulesDisplayType,
} from 'bento-common/types';
import Box from 'system/Box';
import QueryRenderer from 'components/QueryRenderer';
import GroupRulesText from './GroupRulesText';
import BlockedAccountsQuery from 'queries/BlockedAccountsQuery';
import colors from 'helpers/colors';
import Link from 'system/Link';
import {
  GroupTargeting,
  TemplateAttribute,
} from 'bento-common/types/targeting';
import { AudienceGroupRulesDisplayQuery } from 'relay-types/AudienceGroupRulesDisplayQuery.graphql';
import { useAttributes } from 'providers/AttributesProvider';
import { TEMPLATE_OPTIONS } from 'components/EditorCommon/targeting.helpers';
import { RulesDisplayCompactMode } from 'components/EditorCommon/GroupRulesList';
import { countRules } from 'bento-common/utils/targeting';

interface Props extends BoxProps {
  targets: GroupTargeting;
  /** Not available for RulesDisplayType.plain. */
  label?: ReactNode;
  type?: RulesDisplayType;
  /** Whether to hide the UI for an attribute type. */
  hideSection?: AttributeType;
  hideBlockedAccounts?: boolean;
  hideRulesTextCopy?: boolean;
  hideTitle?: boolean;
  formLabelProps?: FormLabelProps;
  fullWidth?: boolean;
  /** Show abridged version of the rules if too long */
  compact?: boolean | RulesDisplayCompactMode;
  /** Hide additional text like WHERE/AND */
  listForm?: boolean;
  /** Display link in corner to see full rules */
  onSeeDetails?: () => void;
  forceSeeDetails?: boolean;
  preventAbridge?: boolean;
}

interface AudienceDisplayProps extends Props {
  templates?: AudienceGroupRulesDisplayQuery['response']['templates'];
  organization?: AudienceGroupRulesDisplayQuery['response']['organization'];
  blockedAccountsCount: number;
}

const boxStylesByType: Record<RulesDisplayType, BoxProps> = {
  [RulesDisplayType.gray]: { bg: 'gray.50', px: '4', py: '2' },
  [RulesDisplayType.plain]: {},
  [RulesDisplayType.warning]: { bg: colors.warning.bg, px: '4', py: '2' },
};

const AudienceGroupRulesDisplay: React.FC<AudienceDisplayProps> = ({
  targets,
  templates,
  organization,
  label = 'Audience rules:',
  type = RulesDisplayType.gray,
  blockedAccountsCount,
  hideSection,
  hideRulesTextCopy,
  hideBlockedAccounts,
  hideTitle,
  formLabelProps,
  fullWidth,
  compact,
  onSeeDetails,
  forceSeeDetails,
  listForm,
  preventAbridge,
  ...boxProps
}) => {
  const { accountAttributes, accountUserAttributes } = useAttributes();
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

  const parsedAccountUserAttributes = useMemo(
    () => [...accountUserAttributes, ...TEMPLATE_OPTIONS],
    [accountUserAttributes]
  );

  const plain = type === RulesDisplayType.plain;
  const showTitle = !plain && !hideTitle;
  const compactMode =
    typeof compact === 'boolean' ? RulesDisplayCompactMode.normal : compact;
  const abridgedRulesShown = useMemo(
    () => !preventAbridge && countRules(targets) > 2,
    [targets, preventAbridge]
  );

  return (
    <Flex flexDirection="column" position="relative" gap={4} {...boxProps}>
      {showTitle && (
        <FormLabel
          {...formLabelProps}
          variant="secondary"
          fontWeight="semibold"
        >
          {label}
        </FormLabel>
      )}
      <Flex {...boxStylesByType[type]} flexDirection="column" gap={6}>
        {onSeeDetails && (abridgedRulesShown || forceSeeDetails) && (
          <Link
            fontSize="xs"
            fontWeight="semibold"
            color="bento.bright"
            onClick={onSeeDetails}
            position="absolute"
            right={plain ? '0' : '4'}
          >
            See all rules
          </Link>
        )}
        {!hideAccounts && (
          <GroupRulesText
            typeLabel={GuideTypeEnum.account}
            targeting={targets.account}
            branchingQuestion={organization?.branchingQuestions}
            hideCopy={hideRulesTextCopy}
            attributes={accountAttributes}
            fullWidth={fullWidth}
            compact={compactMode}
            listForm={listForm}
            preventAbridge={preventAbridge}
          />
        )}
        {!hideUsers && (
          <GroupRulesText
            typeLabel={GuideTypeEnum.user}
            targeting={targets.accountUser}
            templates={templates as any /* was readonly */}
            hideCopy={hideRulesTextCopy}
            attributes={parsedAccountUserAttributes}
            fullWidth={fullWidth}
            compact={compactMode}
            listForm={listForm}
            preventAbridge={preventAbridge}
          />
        )}
        {blockedAccountsCount > 0 && !hideBlockedAccounts && (
          <Box fontSize="xs" w="full">
            Blocked accounts will <b>not</b> receive this guide. View and manage
            all blocked accounts in the{' '}
            <Link
              size="sm"
              fontWeight="semibold"
              color="bento.bright"
              onClick={handleGoToSettings}
            >
              Command center
            </Link>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

const TEMPLATE_DISPLAY_QUERY = graphql`
  query AudienceGroupRulesDisplayQuery($templateEntityIds: [EntityId!]) {
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

export default function AudienceGroupRulesDisplayQueryRenderer(cProps: Props) {
  const [blockedAccountsCount, setBlockedAccountsCount] = useState(0);

  const templateEntityIds = React.useMemo(() => {
    const groups = cProps.targets?.accountUser.groups;

    if (!groups) {
      return [];
    }

    return groups.reduce((out, group) => {
      const groupIds = group.rules.flatMap((rule) =>
        Object.values(TemplateAttribute).includes(
          rule.attribute as TemplateAttribute
        ) && isUuid.anyNonNil((rule.value as string) || '')
          ? [rule.value]
          : []
      ) as string[];

      out.push(...groupIds);

      return out;
    }, [] as string[]);
  }, [cProps.targets.accountUser]);

  const getBlockedAccounts = useCallback(async () => {
    const res = await BlockedAccountsQuery();
    if (res.accounts) setBlockedAccountsCount(res.accounts.length);
  }, []);

  useEffect(() => {
    if (!cProps.hideBlockedAccounts) void getBlockedAccounts();
  }, []);

  return (
    <QueryRenderer<AudienceGroupRulesDisplayQuery>
      query={TEMPLATE_DISPLAY_QUERY}
      fetchPolicy="store-or-network"
      variables={{ templateEntityIds }}
      render={({ props }) => {
        return (
          <AudienceGroupRulesDisplay
            {...cProps}
            {...props}
            blockedAccountsCount={blockedAccountsCount}
          />
        );
      }}
    />
  );
}
