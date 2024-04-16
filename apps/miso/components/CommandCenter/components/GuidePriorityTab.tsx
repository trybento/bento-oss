import React, { useCallback, useMemo, useState } from 'react';
import { HStack, VStack, Button } from '@chakra-ui/react';

import {
  GenericPriorityFormValues,
  getSortedRankableTargets,
} from 'components/Templates/Tabs/PriorityRankingForm/helpers';
import useToast from 'hooks/useToast';
import PriorityRankingForm from 'components/Templates/Tabs/PriorityRankingForm/PriorityRankingForm';
import { FormEntityLabel } from 'components/GuideForm/types';
import Text from 'system/Text';
import Box from 'system/Box';
import OptionGroupBox from 'system/OptionGroupBox';
import HelperText from 'system/HelperText';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import { AutoLaunchableTarget } from 'components/EditorCommon/targeting.helpers';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import { submitPriorityMutation } from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import ConfirmGuidePrioritiesModal from './ConfirmGuidePrioritiesModal';
import useToggleState from 'hooks/useToggleState';
import TabInfoHeader from '../../layout/TabInfoHeader';
import InlineLink from 'components/common/InlineLink';

type Props = {
  initialValues: GenericPriorityFormValues;
  refetch?: () => Promise<void>;
};

function GuidePriorityTabForm({ initialValues, refetch }: Props) {
  const [editing, setEditing] = useState(false);
  const [editorDirty, setEditorDirty] = useState(false);
  const modalStates = useToggleState(['confirm']);

  const [rankableTargets, setRankableTargets] =
    useState<AutoLaunchableTarget[]>();

  const toast = useToast();

  const handleStartEditing = useCallback(() => {
    setEditing(true);
  }, [rankableTargets]);

  const handleCancelEditing = useCallback(() => {
    if (editorDirty && initialValues) {
      /* Restore state and re-render */
      setRankableTargets(initialValues.autoLaunchableTargets);
      setEditorDirty(false);
    }
    setEditing(false);
  }, [editorDirty, initialValues.autoLaunchableTargets]);

  const handleSave = useCallback(async () => {
    try {
      await submitPriorityMutation({
        ...initialValues,
        autoLaunchableTargets: rankableTargets,
      });

      setEditing(false);
      setEditorDirty(false);

      toast({
        title: 'Saved!',
        status: 'success',
        isClosable: true,
      });

      await refetch();
      modalStates.confirm.off();
    } catch (e) {
      toast({
        title: e.message || 'Something went wrong',
        isClosable: true,
        status: 'error',
      });
    }
  }, [rankableTargets, initialValues]);

  const onChange = useCallback((values: GenericPriorityFormValues) => {
    setRankableTargets(values.autoLaunchableTargets);
  }, []);

  return (
    <Box w="xl">
      {editing && (
        <CalloutText calloutType={CalloutTypes.Warning} mb="4">
          ⚠️ These guides are live and editing their priority will{' '}
          <Text display="inline" fontWeight="semibold">
            change end-user experiences
          </Text>
          . Be careful when making big changes.
        </CalloutText>
      )}
      <OptionGroupBox p="4" w="full">
        <HStack pb="4" mt="0" justifyContent="space-between">
          <HelperText h="full" mt="0">
            Only live guides are shown here
          </HelperText>
          {editing ? (
            <HStack gap="2">
              <Button variant="secondary" onClick={handleCancelEditing}>
                Cancel
              </Button>
              <Button
                isDisabled={!editorDirty}
                onClick={modalStates.confirm.on}
              >
                Apply changes
              </Button>
            </HStack>
          ) : (
            <Button onClick={handleStartEditing}>Edit priority</Button>
          )}
        </HStack>
        <PriorityRankingForm
          key={String(editing)}
          initialValues={initialValues}
          onChange={onChange}
          onSubmit={handleSave}
          isDisabled={!editing}
          onDirtyStateChange={setEditorDirty}
          usePopover
          useOpenInNew
        />
      </OptionGroupBox>
      <ConfirmGuidePrioritiesModal
        isOpen={modalStates.confirm.isOn}
        onConfirm={handleSave}
        onClose={modalStates.confirm.off}
        originalRanking={initialValues.autoLaunchableTargets}
        newRanking={rankableTargets}
      />
    </Box>
  );
}

export default function GuidePriorityTab() {
  const enabledInternalNames = useInternalGuideNames();
  const { data: rankableTargets, refetch } = useQueryAsHook(
    getSortedRankableTargets,
    {
      enabledInternalNames,
    }
  );

  const initialValues = useMemo<GenericPriorityFormValues>(
    () => ({
      formEntityLabel: FormEntityLabel.commandCtr,
      autoLaunchableTargets: (rankableTargets as any) ?? [],
      currentTarget: null,
    }),
    [rankableTargets]
  );

  return (
    <VStack alignItems="flex-start" maxW={1600}>
      <TabInfoHeader title="Which guides should a user get first?">
        Disruptive experiences need to be ranked in order to avoid collisions
        (one element on top of another). Bento makes this easy with our Air
        Traffic Control system.{' '}
        <InlineLink
          ml="1"
          label="Learn more."
          href="https://help.trybento.co/en/articles/7919278-how-to-prioritize-guides"
        />
      </TabInfoHeader>
      <Box id="priority-help-content-wrapper" className="w-full flex gap-x-4">
        <Box minH="4" className="w-full" id="column-1"></Box>
        <Box minH="4" className="w-full" id="column-2"></Box>
        <Box minH="4" className="w-full" id="column-3"></Box>
      </Box>
      <GuidePriorityTabForm initialValues={initialValues} refetch={refetch} />
    </VStack>
  );
}
