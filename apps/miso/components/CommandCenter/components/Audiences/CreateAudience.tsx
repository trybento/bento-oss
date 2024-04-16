import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, Flex, useBoolean } from '@chakra-ui/react';

import { GroupTargeting } from 'bento-common/types/targeting';
import {
  emptyTargeting,
  isTargetingIncomplete,
} from 'bento-common/utils/targeting';

import EditableLabel from 'components/EditorCommon/EditableLabel';
import Page from 'components/layout/Page';
import TargetingEditorProvider from 'components/Templates/Tabs/Targeting/TargetingEditorProvider';
import TargetingRulesEditor from 'components/Templates/Tabs/Targeting/TargetingRulesEditor';
import H4 from 'system/H4';
import { EditorMode } from 'components/EditorCommon/GroupTargetingEditor';
import { isAllTargeting } from 'components/Templates/Tabs/templateTabs.helpers';
import { useTargetingAudiencesContext } from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import useToast from 'hooks/useToast';
import * as SaveNewAudienceMutation from 'mutations/SaveNewAudience';
import { SaveNewAudienceInput } from 'relay-types/SaveNewAudienceMutation.graphql';
import { useRouter } from 'next/router';
import EditAudienceConfirmModal, {
  AudienceModalVariant,
} from './EditAudienceConfirmModal';
import { sanitizeTargeting } from 'components/EditorCommon/targeting.helpers';

export default function CreateAudience() {
  const [title, setTitle] = useState<string>();
  const [confirmModalOpen, setConfirmModalOpen] = useBoolean();
  const [targets, setTargets] = useState<GroupTargeting>(emptyTargeting);
  const { nameExists } = useTargetingAudiencesContext();
  const toast = useToast();
  const router = useRouter();

  const rulesAreValid = useMemo(() => {
    if (isAllTargeting(targets) || isTargetingIncomplete(targets)) return false;

    return true;
  }, [targets]);

  const titleError: string | null = useMemo(() => {
    if (!title || title.length === 0) return 'Please set a title';

    if (nameExists(title))
      return 'You already have a saved audience with this name';

    return null;
  }, [nameExists, title]);

  const handleSave = useCallback(async () => {
    try {
      const res = await SaveNewAudienceMutation.commit({
        name: title,
        targets: sanitizeTargeting(targets),
      } as SaveNewAudienceInput);

      toast({
        title: 'Audience saved!',
        isClosable: true,
        status: 'success',
      });

      const audienceEntityId = res.saveNewAudience?.audience?.entityId;

      if (audienceEntityId)
        router.push(`/command-center/audiences/${audienceEntityId}`);
    } catch (e: any) {
      const _e: Error = Array.isArray(e) ? e[0] : e;
      if (_e.message.includes('limit')) {
        toast({
          title: 'Audience limit exceeded!',
          status: 'error',
        });
        return;
      }
      toast({
        title: 'Something went wrong',
        status: 'error',
      });
    }
  }, [targets, title]);

  return (
    <Page
      title="New saved audience"
      breadcrumbs={[
        {
          label: 'Command center',
          path: '/command-center',
        },
        {
          label: 'Audiences',
          path: '/command-center?tab-audiences',
        },
        {
          label: 'New saved audience',
        },
      ]}
      headerComponent={
        <Box w="3xl">
          <EditableLabel
            fontSize="24px"
            fontWeight="bold"
            initialDisplayTitle={title}
            onChange={setTitle}
            shouldAutoFocus={!title}
            placeholder="Audience name"
            errorMessage={titleError}
          />
        </Box>
      }
    >
      <Flex justifyContent="space-between">
        <Box w="2xl">
          <H4 mb="4">Audience rules</H4>
          <TargetingEditorProvider onTargetingChange={setTargets}>
            <TargetingRulesEditor
              lockMode={EditorMode.Edit}
              targeting={targets}
              enableReinitialize={false}
            />
          </TargetingEditorProvider>
        </Box>
        <Box w="min-content">
          <Button
            isDisabled={!rulesAreValid || !!titleError}
            onClick={setConfirmModalOpen.on}
          >
            Create
          </Button>
        </Box>
      </Flex>
      <EditAudienceConfirmModal
        isOpen={confirmModalOpen}
        onCancel={setConfirmModalOpen.off}
        onSave={handleSave}
        targets={targets}
        affectedTemplates={[]}
        variant={AudienceModalVariant.create}
      />
    </Page>
  );
}
