import React, { useCallback } from 'react';
import { Flex, FormControl, FormLabel } from '@chakra-ui/react';
import EditorTabSection from 'components/Templates/Tabs/EditorTabSection';
import PageTargeting from 'components/EditorCommon/PageTargeting';
import { useNpsProvider } from './NpsProvider';
import { GuidePageTargetingType } from 'bento-common/types';
import NpsScheduling from './NpsScheduling';
import Select, { SelectOptions } from 'system/Select';
import NpsPriorityForm from 'components/Templates/Tabs/PriorityRankingForm/NpsPriorityForm';
import { selectStyles } from './helpers';
import TargetingEditor from 'components/EditorCommon/TargetingEditor';
import { useSelectedOption } from 'utils/helpers';

type Props = {
  disabled?: boolean;
};

const repeatOptions: SelectOptions<number | null>[] = [
  {
    label: 'Never',
    value: null,
  },
  { label: 'Every 30 days', value: 30 },
  { label: 'Every 90 days', value: 90 },
  { label: 'Every 180 days', value: 180 },
  { label: 'Every 365 days', value: 365 },
];

const NpsTargetingTab: React.FC<Props> = ({ disabled }) => {
  const {
    pageTargeting,
    pageTargetingTypeChange,
    pageTargetingUrlChange,
    repeatInterval,
    repeatIntervalChanged,
    targets,
    targetsChanged,
  } = useNpsProvider();

  const selectedRepeatInterval = useSelectedOption(
    repeatOptions,
    repeatInterval
  );

  const handleRepeatIntervalChange = useCallback(
    (option: SelectOptions<number | null>) => {
      repeatIntervalChanged(option.value);
    },
    [repeatIntervalChanged]
  );

  const handleTargetsChange = useCallback((values) => {
    targetsChanged(values.targeting);
  }, []);

  return (
    <Flex h="full" flexDir="column">
      <EditorTabSection
        header="Location: Where should people discover this?"
        helperText="Where and how does this show up?"
      >
        <PageTargeting
          pageTargetingType={pageTargeting.type}
          pageTargetingUrl={pageTargeting.url}
          optionsWhitelist={[
            GuidePageTargetingType.anyPage,
            GuidePageTargetingType.specificPage,
          ]}
          disabled={disabled}
          handlePageTargetingTypeChange={pageTargetingTypeChange}
          handlePageTargetingUrlChange={pageTargetingUrlChange}
        />
      </EditorTabSection>
      <EditorTabSection
        header="Audience: Who should see it?"
        helperText="Any users who match these criteria will get this"
      >
        <TargetingEditor
          targeting={targets}
          onChange={handleTargetsChange}
          hideBlockedAccounts
        />
      </EditorTabSection>
      <EditorTabSection
        header="Frequency"
        helperText="How long should we wait before giving the same user this NPS survey again?"
      >
        <Flex gap="8">
          <FormControl>
            <FormLabel htmlFor="repeatIntervalSelect">
              When should survey repeat?
            </FormLabel>
            <Flex gap="2" maxW="md">
              <Select
                inputId="repeatIntervalSelect"
                options={repeatOptions}
                isDisabled={disabled}
                value={selectedRepeatInterval}
                onChange={handleRepeatIntervalChange}
                styles={selectStyles}
              />
            </Flex>
          </FormControl>
        </Flex>
      </EditorTabSection>
      <EditorTabSection
        header="Start & Stop"
        helperText="When should this launch, and when should it stop launching?"
      >
        <NpsScheduling disabled={disabled} />
      </EditorTabSection>
      {/** UPDATE LEARN MORE LINK */}
      <EditorTabSection
        header="Priority: When should it be available?"
        helperText="Bento uses throttling to ensure elements don’t appear on top of each other. Learn more here."
      >
        <NpsPriorityForm />
      </EditorTabSection>
    </Flex>
  );
};

export default NpsTargetingTab;
