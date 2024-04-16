import React, { useCallback, useMemo } from 'react';
import { Text, Flex, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { GroupTargeting } from 'bento-common/types/targeting';
import { isTemplateRankable } from 'bento-common/data/helpers';
import { TargetingTabProps } from '../TargetingTab';
import TargetingTabSchedulingForm from './TargetingTabSchedulingForm';
import SingleAccordion from 'components/common/SingleAccordion';
import TemplatePriorityForm from '../PriorityRankingForm/TemplatePriorityForm';
import EditorTabSection from '../EditorTabSection';
import UsageBadge from 'system/UsageBadge';
import { TroubleshootChoice } from 'components/CommandCenter/components/commandCenter.types';
import TargetingRulesEditor from './TargetingRulesEditor';
import TargetingEditorProvider from './TargetingEditorProvider';
import InlineLink from 'components/common/InlineLink';
import LaunchingInformation from './LaunchingInformation';

type Props = TargetingTabProps & {
  editedTemplateName: string;
  onEditingDone?: () => void;
  onTargetingChange?: (
    targeting: GroupTargeting,
    dirty?: boolean
  ) => Promise<void> | void;
  onTargetingSubmit?: (targeting: GroupTargeting) => Promise<void> | void;
};

/** TEMP: Disable until product decides what to show "On" for */
const USE_BADGE = false;

const RuleBasedLaunching: React.FC<Props> = ({
  editedTemplateName,
  ...props
}) => {
  const router = useRouter();

  const { template } = props;

  const handleTroubleshoot = useCallback(
    () =>
      router.push(
        `/command-center?tab=troubleshoot&ref=template&diagnose=${TroubleshootChoice.userNotGettingContent}&template=${template.entityId}`
      ),
    [template.entityId]
  );

  /** @todo: consider manual launches */
  const rulesTargeting = template.isAutoLaunchEnabled;

  const isRankable = isTemplateRankable(template);

  return (
    <EditorTabSection
      header="Rule-based"
      headerDecorator={
        USE_BADGE ? <UsageBadge ml="4" inUse={rulesTargeting} /> : undefined
      }
      helperText={
        <Flex direction="column" gap="4">
          <Text>
            When auto-launched, any users who match your audience criteria will
            receive this guide.
            <br />
            <InlineLink
              href="/data-and-integrations?tab=attributes"
              label="See what data"
            />{' '}
            you can target on.
          </Text>
          <Button
            w="fit-content"
            variant="secondary"
            onClick={handleTroubleshoot}
          >
            Troubleshoot
          </Button>
        </Flex>
      }
    >
      <Flex flexDirection="column" gap="10">
        <Flex flexDirection="column" gap="4">
          <Flex flexDirection="column" gap="1">
            <Text fontSize="lg" fontWeight="bold">
              Audience rules: Who will get this guide?
            </Text>
            <Text>
              If this guide is being launched by other guides, you do not need
              to set these rules. Audience rules do not apply.
            </Text>
          </Flex>
          <LaunchingInformation />
          <TargetingEditorProvider
            template={template}
            onEditingDone={props.onEditingDone}
            onTargetingSubmit={props.onTargetingSubmit}
          >
            <TargetingRulesEditor
              targeting={template.targets as GroupTargeting}
              launchingContext
            />
          </TargetingEditorProvider>
        </Flex>

        {isRankable && (
          <Flex flexDirection="column" gap="6">
            <Flex flexDirection="column" gap="1">
              <Text fontSize="lg" fontWeight="bold">
                Priority: When should it be available?
              </Text>
              <Text>
                Initial onboarding checklists are shown one-at-a-time, using the
                design principle of “progressive disclosure”. Guide priority
                impacts manually launched guides as well.
              </Text>
            </Flex>
            <TemplatePriorityForm
              {...props}
              editedTemplateName={editedTemplateName}
              unwrap
            />
          </Flex>
        )}

        <SingleAccordion title="Advanced settings" w="full" variant="header">
          <TargetingTabSchedulingForm unwrap />
        </SingleAccordion>
      </Flex>
    </EditorTabSection>
  );
};

export default RuleBasedLaunching;
