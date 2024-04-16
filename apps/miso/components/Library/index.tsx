import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { INTERNAL_TEMPLATE_ORG } from 'bento-common/utils/constants';
import Link from 'system/Link';
import Box from 'system/Box';
import Button from 'system/Button';
import useAccessToken from 'hooks/useAccessToken';
import {
  useAutolaunchCsv,
  useNpsSurveys,
  useSplitTesting,
} from 'hooks/useFeatureFlag';
import useToggleState from 'hooks/useToggleState';
import useToast from 'hooks/useToast';
import LibraryTemplates from './LibraryTemplates';
import LibraryNps from './LibraryNps';
import LibrarySplitTests from './LibrarySplitTests';
import LibraryCreateModal from './LibraryCreateModal/LibraryCreateModal';
import CreateTestModal from './LibrarySplitTests/CreateTestModal';
import { createNewNpsSurvey, requestAutolaunchCsv } from './library.helpers';
import { useOrganization } from 'providers/LoggedInUserProvider';
import CreateTemplateSourceModal from './LibraryTemplates/modals/CreateTemplateSourceModal';
import * as BootstrapTemplateMutation from 'mutations/BootstrapTemplate';
import Page from 'components/layout/Page';

enum LibraryTabs {
  Guides = 0,
  Nps = 1,
  SplitTests = 2,
  Audiences = 3,
}

const tabIndexMap = {
  guides: LibraryTabs.Guides,
  nps: LibraryTabs.Nps,
  splitTests: LibraryTabs.SplitTests,
  audiences: LibraryTabs.Audiences,
};

const tabNameMap = Object.fromEntries(
  Object.entries(tabIndexMap).map(([name, index]) => [index, name])
);

interface LibraryProps {}

export default function Library(_: LibraryProps) {
  const { accessToken } = useAccessToken();
  const { organization } = useOrganization();
  const router = useRouter();
  const { query } = router;
  const toast = useToast();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const isBentoTemplateOrg = organization.slug === INTERNAL_TEMPLATE_ORG;

  const enableNpsSurveys = useNpsSurveys();
  const enableAutolaunchCsv = useAutolaunchCsv();
  const enableSplitTesting = useSplitTesting();

  const modalStates = useToggleState([
    'createGuide',
    'createSplitTest',
    'createTemplateSource',
  ]);

  const showCreate = useMemo(() => {
    const result = {
      template: selectedTabIndex === LibraryTabs.Guides,
      splitTest: selectedTabIndex === LibraryTabs.SplitTests,
      nps: selectedTabIndex === LibraryTabs.Nps,
    };

    return {
      ...result,
      anyOn: Object.values(result).some(Boolean),
    };
  }, [selectedTabIndex]);

  const handleCreate = useCallback(async () => {
    if (showCreate.splitTest) {
      modalStates.createSplitTest.on();

      return;
    } else if (showCreate.nps) {
      const createdNpsSurvey = await createNewNpsSurvey();

      if (createdNpsSurvey) {
        router.push(`/library/nps/${createdNpsSurvey.entityId}`);

        toast({
          title: `Survey created!`,
          isClosable: true,
          status: 'success',
        });
      }

      return;
    }

    modalStates.createGuide.on();
  }, [showCreate, modalStates]);

  const onTestCreated = useCallback(
    (entityId: string | undefined) => {
      if (entityId) {
        router.push(`library/split-tests/${entityId}`);
      }
    },
    [router]
  );

  const onCreateSource = useCallback(
    async (entityId: string) => {
      try {
        const res = await BootstrapTemplateMutation.commit({ entityId });
        router.push(
          `/library/templates/${res.bootstrapTemplates.template.entityId}`
        );
        toast({
          title: 'Template source created',
          status: 'success',
        });
      } catch (e: any) {
        toast({
          title: e.message || 'Something went wrong',
          status: 'error',
        });
      }
    },
    [accessToken]
  );

  const onTabChange = useCallback((tabIndex: number) => {
    const pathname = '/library';
    const queryValue = tabNameMap[tabIndex];

    router.replace(
      { pathname, query: { tab: queryValue } },
      `${pathname}?tab=${queryValue}`,
      { shallow: true }
    );
  }, []);

  const onRequestAutolaunchCsv = useCallback(async () => {
    try {
      await requestAutolaunchCsv(accessToken);
      toast({
        title: 'CSV generated!',
        isClosable: true,
        status: 'success',
      });
    } catch (e: any) {
      toast({
        title: e.message || 'Something went wrong',
        isClosable: true,
        status: 'error',
      });
    }
  }, []);

  useEffect(() => {
    if (!query.tab) {
      onTabChange(LibraryTabs.Guides);
    } else if (query.tab && query.tab === 'modules') {
      /* Handle deprecated tab path */
      router.push('/library/step-groups');
    }
  }, [query.tab]);

  return (
    <>
      <Page
        title={isBentoTemplateOrg ? 'Bento template library' : 'Library'}
        actions={
          <Flex gap={3}>
            {enableAutolaunchCsv && showCreate.template && (
              <Box my="auto">
                <Link onClick={onRequestAutolaunchCsv} color="blue.500">
                  Download autolaunch rules
                </Link>
              </Box>
            )}
            {isBentoTemplateOrg && (
              <Box my="auto">
                <Button
                  variant="secondary"
                  onClick={modalStates.createTemplateSource.on}
                  data-test="library-create-new-btn"
                >
                  Clone template
                </Button>
              </Box>
            )}
            <Box my="auto">
              {showCreate.anyOn && (
                <Button
                  onClick={handleCreate}
                  data-test="library-create-new-btn"
                >
                  Create new...
                </Button>
              )}
            </Box>
          </Flex>
        }
        tabs={[
          {
            title: 'Guides',
            component: () => <LibraryTemplates />,
            paddingTop: 0,
          },
          {
            title: 'NPS',
            component: () => <LibraryNps />,
            disabled: !enableNpsSurveys,
          },
          {
            title: 'Split test',
            component: () => <LibrarySplitTests />,
            disabled: !enableSplitTesting,
          },
        ]}
        onTabIndexChange={setSelectedTabIndex}
      />
      {modalStates.createGuide.isOn && (
        <LibraryCreateModal onClose={modalStates.createGuide.off} isOpen />
      )}
      {modalStates.createSplitTest.isOn && (
        <CreateTestModal
          onClose={modalStates.createSplitTest.off}
          onCreate={onTestCreated}
          isOpen
        />
      )}
      {isBentoTemplateOrg && (
        <CreateTemplateSourceModal
          isOpen={modalStates.createTemplateSource.isOn}
          onClose={modalStates.createTemplateSource.off}
          onCreate={onCreateSource}
        />
      )}
    </>
  );
}
