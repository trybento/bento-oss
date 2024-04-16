import React, { useCallback, useRef, useState } from 'react';
import {
  VStack,
  TabPanels,
  TabPanel,
  Tabs,
  TabList,
  Tab,
} from '@chakra-ui/react';

import Button from 'system/Button';
import H2 from 'system/H2';
import Box from 'system/Box';
import HelperText from 'system/HelperText';
import useToast from 'hooks/useToast';

import * as QARequestMutation from 'mutations/QARequest';
import ConfirmDeleteModal, {
  ConfirmModalVariations,
} from 'components/ConfirmDeleteModal';
import useToggleState from 'hooks/useToggleState';
import { QATool } from 'bento-common/types';
import LaunchingDiagnosticsModal from './LaunchingDiagnosticsModal';
import { TABLIST_STYLE, TAB_STYLE } from 'helpers/uiDefaults';
import H5 from 'system/H5';
import DataDisplayModal from './DataDisplayModal';
import NewIdentifyModal from './NewIdentifyModal';
import FeatureFlagModal from './FeatureFlagModal';

type Cb = () => Promise<void>;

export default function QATools() {
  const toast = useToast();
  const modalState = useToggleState([
    'confirmation',
    'launchDiagnostics',
    'availableGuides',
    'data',
    'sendIdentify',
    'featureFlags',
  ]);
  const onConfirmAction = useRef<Cb>();
  const [data, setData] = useState<object>();

  const handleRequest = useCallback(
    (request: string) => async () => {
      try {
        const res = await QARequestMutation.commit({ request });

        toast({
          title: res.qaRequest.result || 'It will be done',
          status: 'success',
        });

        if (res.qaRequest.jsonString)
          setData(JSON.parse(res.qaRequest.jsonString));
      } catch (e) {
        toast({
          title: e.message || 'Something went wrong',
          status: 'error',
        });
      }
    },
    []
  );

  const withConfirm = useCallback(
    (cb: Cb) => () => {
      onConfirmAction.current = cb;
      modalState.confirmation.on();
    },
    []
  );

  const handleCloseDataModal = useCallback(() => {
    modalState.data.off();
    setData(null);
  }, []);

  const onConfirm = useCallback(async () => {
    onConfirmAction.current && onConfirmAction.current();
  }, []);

  return (
    <Box px="16" w="full">
      <Box mb="6">
        <H2>QA Tools</H2>
      </Box>
      <Tabs flex="auto" w="100%" display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          position="sticky"
          top="0"
          background="white"
          zIndex="2"
        >
          <TabList
            borderBottomWidth="1px"
            flexGrow={1}
            borderColor="border"
            style={TABLIST_STYLE}
          >
            {['Actions', 'Diagnostics'].map((title, i) => (
              <Tab key={`org-tab-${title}`} minWidth="132px" {...TAB_STYLE}>
                <Box position="relative">{title}</Box>
              </Tab>
            ))}
          </TabList>
        </Box>
        <TabPanels h="full">
          <TabPanel>
            <VStack alignItems="start" gap="4" maxW="700px">
              <H5 my="2">Guide management</H5>
              <Box>
                <Button
                  onClick={withConfirm(handleRequest(QATool.bulkPause))}
                  variant="secondary"
                >
                  Stop all guides
                </Button>
                <HelperText>
                  Stop every guide in the library that has auto launch enabled
                </HelperText>
              </Box>

              <H5 my="2">Rollups and data</H5>
              <Box>
                <Button
                  onClick={handleRequest(QATool.rollup)}
                  variant="secondary"
                >
                  Request rollup
                </Button>
                <HelperText>
                  Request an analytics rollup to update aggregated data. Usually
                  runs hourly, on split test stops, or deletions that require
                  updates
                </HelperText>
              </Box>

              <Box>
                <Button
                  onClick={withConfirm(handleRequest(QATool.analyticsBackfill))}
                  variant="secondary"
                >
                  Request analytics backfill
                </Button>
                <HelperText>
                  Request a backfill for the entire org. Good for when new rows
                  were added or aggregation methods changed, but try not to run
                  it otherwise
                </HelperText>
              </Box>

              <Box>
                <Button
                  onClick={withConfirm(
                    handleRequest(QATool.clearFeatureFlagCache)
                  )}
                  variant="secondary"
                >
                  Clear feature flag cache
                </Button>
                <HelperText>
                  If a feature flag is freshly toggled, it may not take effect
                  because it's cached for some time. Use this if you're
                  impatient
                </HelperText>
              </Box>

              <Box>
                <Button
                  onClick={modalState.featureFlags.on}
                  variant="secondary"
                >
                  Manage feature flags
                </Button>
                <HelperText>Toggle feature flags for this org</HelperText>
              </Box>

              <H5 my="2">Generation</H5>
              <Box>
                <Button
                  onClick={modalState.sendIdentify.on}
                  variant="secondary"
                >
                  Send identify
                </Button>
                <HelperText>
                  Create a user and send an identify request with custom
                  attributes. Can be for testing account launches
                </HelperText>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack alignItems="start" gap="4" maxW="700px">
              <H5 my="2">Debugging and state</H5>
              <Box>
                <Button
                  onClick={modalState.launchDiagnostics.on}
                  variant="secondary"
                >
                  Launching diagnostics
                </Button>
                <HelperText>
                  Request a launching checks report in ugly overly technical
                  JSON. For testing whether or not targeting rules match and
                  triggers launches
                </HelperText>
              </Box>
              <Box>
                <Button
                  onClick={modalState.availableGuides.on}
                  variant="secondary"
                >
                  Available guides
                </Button>
                <HelperText>
                  Request available guides for a user in ugly overly technical
                  JSON. For testing whether or not a user is fetching guides
                  correctly
                </HelperText>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ConfirmDeleteModal
        isOpen={modalState.confirmation.isOn}
        onClose={modalState.confirmation.off}
        onDelete={onConfirm}
        entityName="something probably, or maybe not"
        header="Run QA tool action"
        variation={ConfirmModalVariations.action}
      >
        Are you sure?
      </ConfirmDeleteModal>
      <LaunchingDiagnosticsModal
        isOpen={modalState.launchDiagnostics.isOn}
        onClose={modalState.launchDiagnostics.off}
        variant={QATool.launchDiagnostics}
        title="Launching diagnostics"
      />
      <LaunchingDiagnosticsModal
        isOpen={modalState.availableGuides.isOn}
        onClose={modalState.availableGuides.off}
        variant={QATool.availableGuides}
        title="Available guides fetcher"
      />
      <DataDisplayModal
        isOpen={modalState.data.isOn}
        onClose={handleCloseDataModal}
        data={data}
        title="Diagnostics data"
      />
      <FeatureFlagModal
        isOpen={modalState.featureFlags.isOn}
        onClose={modalState.featureFlags.off}
      />
      <NewIdentifyModal
        isOpen={modalState.sendIdentify.isOn}
        onClose={modalState.sendIdentify.off}
      />
    </Box>
  );
}
