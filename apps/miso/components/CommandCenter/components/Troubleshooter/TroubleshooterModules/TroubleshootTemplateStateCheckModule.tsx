import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';
import OpenInNew from '@mui/icons-material/OpenInNew';

import { guideNameOrFallback } from 'bento-common/utils/naming';
import { GuideShape } from 'bento-common/types/globalShoyuState';
import { TemplateState } from 'bento-common/types';

import InfoCard from 'system/InfoCard';
import DividerText from 'system/DividerText';
import TroubleshootInputSection from '../common/TroubleshootInputSection';
import AllTemplatesQuery from 'queries/AllTemplatesQuery';
import {
  guideComponentIcon,
  guideComponentLabel,
} from 'helpers/presentational';
import Select, {
  ExtendedSelectOptions,
  OptionWithSubLabel,
  SingleValueWithIcon,
} from 'system/Select';
import H5 from 'system/H5';
import Link from 'system/Link';
import TextField from 'components/common/InputFields/TextField';
import TroubleshootFailState from '../common/TroubleshootFailState';
import { useTroubleshooterContext } from '../TroubleshooterProvider';
import { getUrlQuery } from 'utils/helpers';

/** The state isn't useful for dropdown. Persist for later lookup. */
type ExtendedSelectWithState = ExtendedSelectOptions & {
  state: TemplateState;
  /** Store this under a diff key so Select component won't render, but we can reference */
  cachedIcon: React.ReactNode;
};

const TroubleshootTemplateStateCheckModule: React.FC<{}> = () => {
  const [templateChoices, setTemplateChoices] =
    useState<ExtendedSelectWithState[]>(null);
  const [templateEntityId, setTemplateEntityId] = useState<string>(null);
  const [dropdownUsed, setDropdownUsed] = useState(false);
  const [url, setUrl] = useState<string>('');
  const [failed, setFailed] = useState<TemplateState>(null);

  const {
    handleNext,
    onReset: handleBack,
    setContentSelection,
  } = useTroubleshooterContext();

  const fetchTemplateChoices = useCallback(async () => {
    // TODO: We can likely do more to consolidate "template" selectors e.g. Template Picker
    // See: SalesforceSyncUpTab
    const response = await AllTemplatesQuery();

    const allTemplates = response?.templates;
    setTemplateChoices(
      allTemplates.reduce((a, v) => {
        const IconElement = guideComponentIcon(v as GuideShape);

        a.push({
          label: guideNameOrFallback(v.privateName || v.name),
          value: v.entityId,
          extra: {
            title: 'Open in new window',
            icon: OpenInNew,
            callback: () =>
              window.open(`/library/templates/${v.entityId}`, '_blank'),
          },
          alt: guideComponentLabel(v as GuideShape),
          state: v.state as TemplateState,
          cachedIcon: <IconElement />,
        });

        return a;
      }, [] as ExtendedSelectWithState[])
    );
  }, []);

  const availableTemplateIds = useMemo(
    () =>
      templateChoices?.reduce<Set<string>>((a, v) => {
        a.add(v.value);
        return a;
      }, new Set()),
    [templateChoices]
  );

  const urlIsValid = useMemo(() => {
    if (!url) return true;

    try {
      const pathSplit = url.split('/');
      const entityId = pathSplit[pathSplit.length - 1].split('?')[0];

      const isValid = availableTemplateIds.has(entityId);

      if (isValid) setTemplateEntityId(entityId);
      else setTemplateEntityId(null);

      return isValid;
    } catch {
      return false;
    }
  }, [availableTemplateIds, url]);

  const handleUrlChange = useCallback((newUrl: string) => {
    /* If removing url, unset templateEntityId */
    if (!newUrl) setTemplateEntityId(null);

    setUrl(newUrl);
  }, []);

  useEffect(() => {
    if (!availableTemplateIds?.size) return;

    const cachedEntityId = getUrlQuery('template');

    if (!(cachedEntityId && availableTemplateIds.has(cachedEntityId))) return;

    setTemplateEntityId(cachedEntityId);
    setDropdownUsed(true);
  }, [availableTemplateIds?.size]);

  useEffect(() => {
    void fetchTemplateChoices();
  }, []);

  const handleTemplateSelection = useCallback(
    (selected: ExtendedSelectWithState) => {
      setDropdownUsed(true);
      setTemplateEntityId(selected.value);
    },
    []
  );

  /** This handles updating the dropdown if a URL is entered */
  const selectedTemplate = useMemo(
    () => templateChoices?.find((c) => c.value === templateEntityId),
    [templateChoices, templateEntityId]
  );

  const handleNextAndSetGuide = useCallback(() => {
    /* Do checks here. */
    if (selectedTemplate.state !== TemplateState.live)
      return setFailed(selectedTemplate.state);

    setContentSelection({
      contentType: 'guide',
      entityId: templateEntityId,
      name: selectedTemplate.label,
      Icon: selectedTemplate.cachedIcon,
    });
    handleNext();
  }, [handleNext, selectedTemplate]);

  const handleReset = useCallback(() => {
    setTemplateEntityId(null);
    setFailed(null);
  }, []);

  return (
    <Box w="xl">
      {failed && templateEntityId ? (
        <TroubleshootFailState
          reason={FAIL_STATE_REASONS[failed]}
          recommendations={FAIL_STATE_RECS(templateEntityId)[failed]}
        />
      ) : (
        <InfoCard w="full">
          <TroubleshootInputSection showArrow>
            <H5>Which Guide?</H5>
            <Select
              isLoading={templateChoices === null}
              value={selectedTemplate}
              options={templateChoices || []}
              onChange={handleTemplateSelection}
              components={{
                Option: OptionWithSubLabel(),
                SingleValue: SingleValueWithIcon(),
              }}
              placeholder="Select guide"
            />
          </TroubleshootInputSection>
          <TroubleshootInputSection>
            <DividerText dividerWidth="100%" w="full" text="OR" />
          </TroubleshootInputSection>
          <TroubleshootInputSection>
            <TextField
              onChange={handleUrlChange}
              defaultValue={url}
              fontSize="sm"
              label="Guide URL"
              isInvalid={!urlIsValid}
              errorMessage="Could not find guide. Double check URL and try again."
              placeholder="https://"
              disabled={dropdownUsed}
            />
          </TroubleshootInputSection>
        </InfoCard>
      )}
      <HStack justifyContent="flex-end">
        <Button variant="secondary" onClick={failed ? handleReset : handleBack}>
          Back
        </Button>
        <Button
          onClick={failed ? handleBack : handleNextAndSetGuide}
          isDisabled={!templateEntityId}
        >
          {failed ? 'Done' : 'Next'}
        </Button>
      </HStack>
    </Box>
  );
};

export default TroubleshootTemplateStateCheckModule;

type NonLiveState = Exclude<TemplateState, TemplateState.live>;

const FAIL_STATE_REASONS: Record<NonLiveState, string> = {
  [TemplateState.removed]:
    'Guide was removed from all users. Removing a guide works the same as archiving a guide for all users.',
  [TemplateState.stopped]:
    'Guide stopped launching before the user logged in. Stopping a guide prevents it from being launched to any new users.',
  [TemplateState.draft]: "Experience hasn't been launched and is still a draft",
};

const FAIL_STATE_RECS: (
  templateEntityId: string
) => Record<NonLiveState, React.ReactNode[]> = (templateEntityId: string) => ({
  [TemplateState.removed]: [
    <>
      Duplicate the{' '}
      <Link
        href={`/library/templates/${templateEntityId}`}
        color="blue.500"
        isExternal
      >
        guide
      </Link>
    </>,
    'Confirm your targeting rules',
    'Press “Launch” in the top bar of template',
  ],
  [TemplateState.stopped]: [
    <>
      Restart launching from the top bar of the{' '}
      <Link
        href={`/library/templates/${templateEntityId}`}
        color="blue.500"
        isExternal
      >
        guide template
      </Link>
      . This will ensure new users get the guide.
    </>,
  ],
  [TemplateState.draft]: [
    <>
      Confirm your{' '}
      <Link
        href={`/library/templates/${templateEntityId}?tab=targeting`}
        color="blue.500"
        isExternal
      >
        targeting
      </Link>{' '}
      rules
    </>,
    'Press "Launch" in the top bar of template',
  ],
});
