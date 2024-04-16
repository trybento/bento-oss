import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Box, Flex, VStack, useBoolean } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Formik, useFormikContext } from 'formik';

import { GroupTargeting } from 'bento-common/types/targeting';
import Page from 'components/layout/Page';
import AudienceQuery from 'queries/AudienceQuery';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import H4 from 'system/H4';
import { ViewRulesDisplay } from 'components/EditorCommon/Targeting/ViewRules';
import OptionGroupBox from 'system/OptionGroupBox';
import useToast from 'hooks/useToast';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import TargetingEditorProvider from 'components/Templates/Tabs/Targeting/TargetingEditorProvider';
import TargetingRulesEditor from 'components/Templates/Tabs/Targeting/TargetingRulesEditor';
import { EditorMode } from 'components/EditorCommon/GroupTargetingEditor';
import { isAllTargeting } from 'components/Templates/Tabs/templateTabs.helpers';
import { isTargetingIncomplete } from 'bento-common/utils/targeting';
import { useTargetingAudiencesContext } from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';
import EditableLabel from 'components/EditorCommon/EditableLabel';
import { AudienceQuery$data } from 'relay-types/AudienceQuery.graphql';
import * as EditAudienceMutation from 'mutations/EditAudience';
import EditAudienceOverflowMenuButton from './EditAudienceOverflowMenuButton';
import AudienceTemplatesTable from './AudienceTemplatesTable';
import { isGuideStateActive } from 'bento-common/data/helpers';
import { TemplateState } from 'bento-common/types';
import EditAudienceConfirmModal from './EditAudienceConfirmModal';
import { sanitizeTargeting } from 'components/EditorCommon/targeting.helpers';

type Props = {
  audienceEntityId: string;
};

type EditAudienceFormProps = {
  audience: AudienceQuery$data['audience'];
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
} & Props;

type AudienceForm = {
  targeting: GroupTargeting;
  title: string;
};

function EditAudienceForm({
  audience,
  audienceEntityId,
  editorMode,
  setEditorMode,
}: EditAudienceFormProps) {
  const { values, setFieldValue, resetForm, dirty, submitForm } =
    useFormikContext<AudienceForm>();
  const [saveConfirmModalOpen, setSaveConfirmModalOpen] = useBoolean(false);

  const { nameExists } = useTargetingAudiencesContext();

  const handleModeChange = useCallback(
    (mode: EditorMode) => () => setEditorMode(mode),
    []
  );

  const handleTargetingChange = useCallback((targets: GroupTargeting) => {
    setFieldValue('targeting', targets);
  }, []);

  const handleCancelEdit = useCallback(() => {
    handleModeChange(EditorMode.View)();

    resetForm();
  }, []);

  const handleSave = useCallback(async () => {
    await submitForm();
    setSaveConfirmModalOpen.off();
  }, [submitForm, audience.templates]);

  const handleTitleChange = useCallback(
    (value: string) => setFieldValue('title', value),
    []
  );

  const rulesAreValid = useMemo(() => {
    if (!values.targeting) return null;
    if (
      isAllTargeting(values.targeting) ||
      isTargetingIncomplete(values.targeting)
    )
      return false;

    return true;
  }, [values.targeting]);

  const titleError: string | null = useMemo(() => {
    if (!values.title || values.title.length === 0) return 'Please set a title';

    if (nameExists(values.title, audienceEntityId))
      return 'You already have a saved audience with this name';

    return null;
  }, [values.title, nameExists]);

  const activeTemplates = useMemo(
    () =>
      audience.templates.filter((t) =>
        isGuideStateActive(t.state as TemplateState)
      ),
    [audience.templates]
  );

  return (
    <Page
      title={audience?.name ?? 'Audience'}
      breadcrumbs={[
        {
          label: 'Command center',
          path: '/command-center',
        },
        {
          label: 'Audiences',
          path: '/command-center?tab=audiences',
        },
        { label: audience?.name ?? '' },
      ]}
      headerComponent={
        editorMode === EditorMode.Edit ? (
          <Box w="3xl">
            <EditableLabel
              fontSize="24px"
              fontWeight="bold"
              initialDisplayTitle={values.title}
              onChange={handleTitleChange}
              placeholder="Audience name"
              errorMessage={titleError}
            />
          </Box>
        ) : undefined
      }
    >
      <VStack alignItems="flex-start" gap="6" w="full">
        <Flex alignItems="unset" justifyContent="space-between" w="full">
          <Box w="3xl">
            <H4 mb="4">Audience rules</H4>
            {editorMode === EditorMode.Edit ? (
              <TargetingEditorProvider
                onTargetingChange={handleTargetingChange}
              >
                <TargetingRulesEditor
                  lockMode={EditorMode.Edit}
                  targeting={values.targeting}
                  enableReinitialize={false}
                />
              </TargetingEditorProvider>
            ) : (
              <OptionGroupBox>
                <ViewRulesDisplay values={values.targeting} />
              </OptionGroupBox>
            )}
          </Box>
          <Flex w="fit-content">
            <Flex h="fit-content" alignItems="center">
              {editorMode === EditorMode.Edit ? (
                <Flex gap="2">
                  <Button variant="secondary" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button
                    isDisabled={!!titleError || !rulesAreValid || !dirty}
                    onClick={setSaveConfirmModalOpen.on}
                  >
                    Save
                  </Button>
                </Flex>
              ) : (
                <Button onClick={handleModeChange(EditorMode.Edit)}>
                  Edit
                </Button>
              )}
              <EditAudienceOverflowMenuButton
                audienceEntityId={audienceEntityId}
                audienceName={audience.name}
                ml="1"
              />
            </Flex>
          </Flex>
        </Flex>
        <Box w="3xl">
          <H4 mb="4">Guides using this audience</H4>
          <AudienceTemplatesTable templateData={audience.templates} />
        </Box>
        <EditAudienceConfirmModal
          isOpen={saveConfirmModalOpen}
          onCancel={setSaveConfirmModalOpen.off}
          onSave={handleSave}
          affectedTemplates={activeTemplates}
          targets={values.targeting}
        />
      </VStack>
    </Page>
  );
}

export default function EditAudience({ audienceEntityId }: Props) {
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.View);

  const { data, loading, refetch } = useQueryAsHook(AudienceQuery, {
    audienceEntityId,
  });
  const { audience } = data || {};
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!loading && !audience) {
      toast({
        title: 'Audience not found!',
        isClosable: true,
        status: 'error',
      });

      router.push('/command-center?tab=audiences');
    }
  }, [audience, loading]);

  const handleSubmit = useCallback(
    async (values: AudienceForm) => {
      if (!audience?.entityId) return;

      try {
        await EditAudienceMutation.commit({
          name: values.title,
          targets: sanitizeTargeting(values.targeting),
          entityId: audience.entityId,
        });

        toast({
          title: 'Audience saved!',
          isClosable: true,
          status: 'success',
        });

        setEditorMode(EditorMode.View);

        refetch();
      } catch (e) {
        toast({
          title: 'Something went wrong',
          isClosable: true,
          status: 'error',
        });
      }
    },
    [audience?.entityId]
  );

  const initialValues = useMemo(
    () => ({
      targeting: audience?.targets as GroupTargeting,
      title: audience?.name,
    }),
    [audience]
  );

  if (loading || !audience) return <BentoLoadingSpinner h="100vh" />;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <EditAudienceForm
        editorMode={editorMode}
        setEditorMode={setEditorMode}
        audience={audience}
        audienceEntityId={audienceEntityId}
      />
    </Formik>
  );
}
