import {
  Box,
  Flex,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import EditIcon from '@mui/icons-material/EditOutlined';
import Replay from '@mui/icons-material/Replay';
import Alert from '@mui/icons-material/ReportProblemOutlined';
import Input from 'bento-common/components/Input';
import Tooltip from 'bento-common/components/Tooltip';
import UrlInput from 'bento-common/components/UrlInput';
import { WysiwygEditorMode } from 'bento-common/types';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useElementSelector } from '~src/providers/ElementSelectorProvider';
import { useSession } from '~src/providers/VisualBuilderSessionProvider';
import colors from '~src/ui/colors';

import Badge, { BadgeStyle } from '../system/Badge';
import WysiwygEditorPopup from './WysiwygEditorPopup';

type Props = {
  onCancel: () => void;
  onSave?: (selector: string, url: string) => void;
  onChange: (selector: string, url: string) => void;
  onRegenerateSelector: (reset: boolean) => void;
  error?: string;
};

export default function SelectorPopup({
  onCancel,
  onSave,
  onChange,
  onRegenerateSelector,
  error,
}: Props) {
  const { progressData, attributes } = useSession();

  const numberOfMatchingElements = useMemo<number | null>(() => {
    if (progressData.elementSelector) {
      try {
        const nodes = document.querySelectorAll(progressData.elementSelector);

        return nodes.length;
      } catch {
        // Just return 0 for invalid selectors
        return 0;
      }
    }

    return null;
  }, [progressData.elementSelector]);

  const matchingElementBadgeConfig = useMemo<{
    label: string;
    variant: BadgeStyle;
  } | null>(() => {
    if (numberOfMatchingElements !== null) {
      if (numberOfMatchingElements === 0) {
        return { label: '0 elements match', variant: BadgeStyle.error };
      }

      if (numberOfMatchingElements === 1) {
        return { label: '1 element matches', variant: BadgeStyle.active };
      }

      return { label: 'Multiple elements match', variant: BadgeStyle.warning };
    }

    return null;
  }, [numberOfMatchingElements]);

  const { allowRegenerateSelector, clearSelectorOmissions } =
    useElementSelector();

  const [selectorEditingEnabled, setSelectorEditingEnabled] =
    useState<boolean>(false);
  const [editedElementSelector, setEditedElementSelector] = useState<string>(
    progressData.elementSelector,
  );
  const [editedWildcardUrl, setEditedWildcardUrl] = useState<string>(
    progressData.wildcardUrl,
  );

  const save = useCallback(() => {
    onSave(progressData.elementSelector, editedWildcardUrl);
    clearSelectorOmissions();
  }, [progressData.elementSelector, editedWildcardUrl]);

  const handleSelectorChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setEditedElementSelector(ev.target.value);
    },
    [],
  );

  const enableSelectorEditing = useCallback(
    () => setSelectorEditingEnabled(true),
    [],
  );

  const handleChange = useCallback(
    debounce((...args: Parameters<typeof onChange>) => {
      onChange(...args);
    }, 100),
    [onChange],
  );

  const handleRegenerateSelector = useCallback(() => {
    if (allowRegenerateSelector || selectorEditingEnabled) {
      onRegenerateSelector(selectorEditingEnabled);
      setSelectorEditingEnabled(false);
    }
  }, [onRegenerateSelector, selectorEditingEnabled, allowRegenerateSelector]);

  useEffect(() => {
    handleChange(editedElementSelector, editedWildcardUrl);
  }, [editedElementSelector, editedWildcardUrl]);

  useEffect(() => {
    if (progressData.elementSelector !== editedElementSelector) {
      setEditedElementSelector(progressData.elementSelector);
    }
  }, [progressData.elementSelector]);

  /**
   * Empty visual data means that either an empty or
   * invalid selector was provided.
   */
  const submitDisabled =
    progressData.mode === WysiwygEditorMode.confirmElement &&
    !progressData.elementSelector;

  const canCustomizeStyle = useMemo(
    () => progressData.modes.includes(WysiwygEditorMode.customize),
    [progressData.modes],
  );

  return (
    <WysiwygEditorPopup
      submitLabel={canCustomizeStyle ? 'Customize style' : 'Next'}
      cancelLabel="Select different element"
      onCancel={onCancel}
      onSubmit={onSave && save}
      isSubmitEnabled={!submitDisabled && numberOfMatchingElements === 1}>
      <Flex gap="6" flexDir="column">
        <Flex flexDir="column" gap="2">
          <Flex gap="2">
            <Text fontSize="sm" fontWeight="bold">
              Element definition
            </Text>
            <Box>
              {matchingElementBadgeConfig !== null && (
                <Badge
                  label={matchingElementBadgeConfig.label}
                  variant={matchingElementBadgeConfig.variant}
                  disableHoverStyle
                />
              )}
            </Box>
          </Flex>
          <InputGroup>
            <Input
              value={editedElementSelector}
              isDisabled={!selectorEditingEnabled}
              onChange={handleSelectorChange}
              paddingRight={!selectorEditingEnabled || error ? 15 : 9}
              isTruncated={!selectorEditingEnabled}
            />
            <InputRightElement
              paddingLeft={2}
              paddingRight={2}
              width="auto"
              children={
                <Box display="flex" gap="1" alignItems="center">
                  {!selectorEditingEnabled && (
                    <EditIcon
                      fontSize="small"
                      style={{ cursor: 'pointer' }}
                      onClick={enableSelectorEditing}
                    />
                  )}
                  {error && (
                    <Tooltip label={error} placement="top">
                      <Alert
                        fontSize="small"
                        style={{ fill: colors.warning.bright }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip
                    label={
                      selectorEditingEnabled
                        ? 'Reset'
                        : allowRegenerateSelector
                        ? 'Find a more specific selector'
                        : 'This is the most specific selector available.'
                    }
                    placement="top">
                    <Replay
                      fontSize="small"
                      style={{
                        cursor:
                          allowRegenerateSelector || selectorEditingEnabled
                            ? 'pointer'
                            : 'not-allowed',
                        opacity:
                          allowRegenerateSelector || selectorEditingEnabled
                            ? undefined
                            : '30%',
                      }}
                      onClick={handleRegenerateSelector}
                    />
                  </Tooltip>
                </Box>
              }
            />
          </InputGroup>
        </Flex>
        <Flex flexDir="column" gap="2">
          <Text fontSize="sm" fontWeight="bold">
            URL targeting
          </Text>
          <UrlInput
            attributes={attributes}
            fontSize="sm"
            onContentChange={setEditedWildcardUrl}
            initialUrl={editedWildcardUrl}
          />
        </Flex>
      </Flex>
    </WysiwygEditorPopup>
  );
}
