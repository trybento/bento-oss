import React, { useCallback } from 'react';
import { Button } from '@chakra-ui/react';

import Box from 'system/Box';
import H2 from 'system/H2';
import LibraryModules from './LibraryModules';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import { createNewStepGroup } from './library.helpers';
import { templatesPagePx } from 'pages/library';
import Page from 'components/layout/Page';

export default function StepGroupLibrary() {
  const router = useRouter();
  const toast = useToast();

  const handleCreate = useCallback(async () => {
    const createdModule = await createNewStepGroup();

    if (!createdModule) return;

    onModuleCreated(createdModule);

    toast({
      title: `Step group template created!`,
      isClosable: true,
      status: 'success',
    });
  }, []);

  const onModuleCreated = useCallback(
    (element, _type?, _targeting?, _onCreate?) =>
      router.push(`/library/step-groups/${element.entityId}`),
    []
  );

  return (
    <Page
      title="Step groups"
      breadcrumbs={[
        { label: 'Library', path: '/library' },
        { label: 'Step groups' },
      ]}
      sticky
      actions={
        <Button onClick={handleCreate} data-test="library-create-new-btn">
          Create new...
        </Button>
      }
    >
      <LibraryModules />
    </Page>
  );
}
