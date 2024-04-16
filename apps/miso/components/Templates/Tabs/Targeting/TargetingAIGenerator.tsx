import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Flex,
  Text,
  Textarea,
  Link,
  VStack,
} from '@chakra-ui/react';

import { GroupTargeting } from 'bento-common/types/targeting';
import { GptErrors } from 'bento-common/types';

import OptionGroupBox from 'system/OptionGroupBox';
import {
  fetchTargeting,
  TARGETING_GPT_LOADER_MSG,
  TestMode,
} from './targetingTab.helpers';
import useAccessToken from 'hooks/useAccessToken';
import LoadingState from 'system/LoadingState';
import useToast from 'hooks/useToast';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import { useTargetingEditorContext } from './TargetingEditorProvider';
import { useTemplate } from 'providers/TemplateProvider';
import GptLoader from 'components/Templates/BentoAIBuilder/GptLoader';
import InlineLink from 'components/common/InlineLink';

type Props = {
  onRulesGenerated: (targeting: GroupTargeting) => void;
  loadedTargeting?: GroupTargeting;
  onReset: () => void;
  onConfirm: () => void;
  onUseManual: () => void;
};

/** Tracks if we ask users if they want to keep waiting */
enum WaitingPromptState {
  hidden,
  prompting,
  ignored,
}

/** How long to wait in seconds during generation, before prompting user to continue */
const PROMPT_TIME = 8 * 1000;

/** Options to skip GPT and return dummy data, for developing the flow */
const TESTING_MODE: TestMode = 'off';

const TargetingAIGenerator: React.FC<Props> = ({
  onRulesGenerated,
  onReset,
  onConfirm,
  onUseManual,
}) => {
  const {
    persistedPrompt,
    setPersistedPrompt,
    requestId,
    setFeedbackState,
    setPersistedTargeting,
    resetAiCache,
  } = useTargetingEditorContext();
  const [prompt, setPrompt] = useState<string>(persistedPrompt);
  const [loading, setLoading] = useState(false);
  const promptTimer = useRef<null | ReturnType<typeof setTimeout>>(null);
  const [waitingPrompt, setWaitingPrompt] = useState(WaitingPromptState.hidden);
  const cancellable = useRef<() => void | null>();
  const [errorMessage, setErrorMessage] = useState<React.ReactNode | null>(
    null
  );
  const {
    template: { entityId },
  } = useTemplate();
  const toast = useToast();

  const { accessToken } = useAccessToken();

  const handlePromptChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(e.target.value);
    },
    []
  );

  const handleReceivedTargeting = useCallback((targeting: GroupTargeting) => {
    onRulesGenerated(targeting);
    setPersistedTargeting(targeting);
    onConfirm();
  }, []);

  /**
   * Skipped useCallback as we need this to react to state
   * changes live to support cancellation and async callbacks. Memoized version
   * not adapting to state changes that occur during its execution
   */
  const handleSubmitPrompt = async () => {
    let rId = '';

    promptTimer.current = setTimeout(() => {
      setWaitingPrompt(WaitingPromptState.prompting);
    }, PROMPT_TIME);

    try {
      setLoading(true);
      setErrorMessage(null);
      setPersistedPrompt(prompt);

      rId = requestId.get();

      const res = await fetchTargeting({
        accessToken,
        prompt,
        templateEntityId: entityId,
        requestId: rId,
        setCancel: (cb) => {
          cancellable.current = cb;
        },
        testMode: TESTING_MODE,
      });

      if (res.targeting) {
        handleReceivedTargeting(res.targeting);
        setFeedbackState(true);

        toast({
          status: 'success',
          title: 'Targeting generated!',
        });
      } else if (res.error) throw new Error(res.error);
    } catch (e: any) {
      if (e.message === GptErrors.cancelled) return;

      if (e.message === GptErrors.noContent) {
        setErrorMessage(<MissingAttributesError />);

        return;
      } else if (e.message === GptErrors.tokenError) {
        setErrorMessage(
          'This is too long for us to process. Please try something shorter!'
        );

        return;
      }

      console.error('Error generating targeting', e);
      setErrorMessage(
        'It looks like our AI services are currently unavailable. Please try again later or create manually.'
      );
    } finally {
      if (promptTimer.current) clearTimeout(promptTimer.current);

      /** If request ID changed, ignore actions */
      cancelPrompt();
    }
  };

  const cancelPrompt = useCallback(() => {
    setLoading(false);
    setWaitingPrompt(WaitingPromptState.hidden);
    if (cancellable.current) cancellable.current();
    if (promptTimer.current) clearTimeout(promptTimer.current);
  }, []);

  const handleTryAgain = useCallback(() => {
    cancelPrompt();
    onRulesGenerated(null);
    resetAiCache();
  }, []);

  const handleCancel = useCallback(
    (callReset = true) =>
      () => {
        /**
         * Cancel actions on potential fetches to prevent acting on unmounted component
         */
        if (cancellable.current) cancellable.current();

        if (callReset) onReset();
        resetAiCache();
      },
    [cancellable.current]
  );

  const handleUseManual = useCallback(() => {
    handleCancel(false)();
    onUseManual();
  }, [onUseManual, handleCancel]);

  const handleDismissWaitingPrompt = useCallback(() => {
    setWaitingPrompt(WaitingPromptState.ignored);
  }, []);

  if (loading)
    return (
      <LoadingState minH="xs">
        {waitingPrompt === WaitingPromptState.prompting ? (
          <VStack mt="4">
            <Text>GPT is taking a while, do you want to keep waiting?</Text>
            <ButtonGroup mt="4" spacing="4">
              <Button variant="secondary" onClick={handleDismissWaitingPrompt}>
                Keep waiting
              </Button>
              <Button variant="link" onClick={handleUseManual}>
                I'll write the rules myself
              </Button>
            </ButtonGroup>
          </VStack>
        ) : (
          <VStack>
            <GptLoader
              hideSpinner
              customLoadingMessages={TARGETING_GPT_LOADER_MSG}
              pt="0"
            />
            <Button mt="4" variant="secondary" onClick={handleTryAgain}>
              Cancel
            </Button>
          </VStack>
        )}
      </LoadingState>
    );

  return (
    <OptionGroupBox>
      <Flex flexDir="column" gap="2">
        <Text fontWeight="semibold">
          Which accounts and users should get this guide?
        </Text>
        <Textarea
          placeholder={TEXTAREA_PLACEHOLDER}
          background="white"
          fontSize="sm"
          value={prompt ?? ''}
          onChange={handlePromptChange}
        />
        {errorMessage ? (
          <CalloutText calloutType={CalloutTypes.Error}>
            {errorMessage}
          </CalloutText>
        ) : (
          <Text>
            Explore the{' '}
            <InlineLink
              href="/data-and-integrations?tab=attributes"
              isExternal
              label="data attributes"
            />{' '}
            that you have available in your organization
          </Text>
        )}
        <ButtonGroup w="full" justifyContent="flex-end">
          <Button variant="link" onClick={handleCancel()}>
            Cancel
          </Button>
          <Button
            isDisabled={!prompt}
            variant="secondary"
            onClick={handleSubmitPrompt}
          >
            Submit
          </Button>
        </ButtonGroup>
      </Flex>
    </OptionGroupBox>
  );
};

export default TargetingAIGenerator;

const MissingAttributesError: React.FC = () => (
  <>
    Your app is missing conditions for the data you're describing. Please double
    check that you have access to these{' '}
    <Link
      target="_blank"
      color="bento.bright"
      href="/data-and-integrations?tab=attributes"
    >
      attributes
    </Link>{' '}
    or ask your engineer to add them
  </>
);

/**
 * Stored here to prevent weird spacing
 */
const TEXTAREA_PLACEHOLDER = `E.g. Accounts not named "Blue Weave" 
Users created after Dec 12 2045 or with a role of admin
`;
