import React, { useCallback, useMemo, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { Box, BoxProps, Button, Text } from '@chakra-ui/react';
import {
  Attribute,
  BannerStyle,
  CardStyle,
  CarouselStyle,
  GuideFormFactor,
  StepType,
  Theme,
  TooltipStyle,
  VideoGalleryStyle,
} from 'bento-common/types';
import {
  isAnnouncementGuide,
  isTooltipGuide,
  isFlowGuide,
  supportsUpdatedMediaHandling,
} from 'bento-common/utils/formFactor';
import {
  getDefaultStepBody,
  getEmptyStepBody,
} from 'bento-common/utils/templates';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { countWords, getWordCountMax } from 'bento-common/utils/slateWordCount';

import RichTextEditor from 'bento-common/components/RichTextEditor';
import {
  getAllowedElementTypes,
  getDisallowedElementTypes,
  isEmptySlate,
  RichTextEditorUISettings,
  wordCountAlertColor,
} from 'bento-common/components/RichTextEditor/helpers';
import { EditorNode, FormattingType } from 'bento-common/types/slate';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FormEntityType } from '../types';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import { isCardTheme } from 'bento-common/data/helpers';
import SnappyModal from './SnappyModal';
import useToggleState from 'hooks/useToggleState';
import Tooltip from 'system/Tooltip';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';
import { useOrganization } from 'providers/LoggedInUserProvider';
import env from '@beam-australia/react-env';
import useAccessToken from 'hooks/useAccessToken';
import { useAttributes } from 'providers/AttributesProvider';

const API_HOST = env('API_HOST')!;
const UPLOADS_HOST = env('UPLOADS_HOST')!;

interface SelectedStepContentProps {
  onBodyChange: (slateBody: EditorNode[], snappy?: boolean) => void;
  bodySlate: EditorNode[];
  formFactor: GuideFormFactor;
  stepBody: string;
  stepType: StepType;
  formKey: string;
  entityId: string;
  formEntityType: FormEntityType | undefined;
  theme: Theme;
  formFactorStyle:
    | CarouselStyle
    | CardStyle
    | TooltipStyle
    | BannerStyle
    | VideoGalleryStyle
    | undefined;
  note?: string;
  snappyAt?: Date;
  allowEmptyBody?: boolean;
  disabled?: boolean;
  onInteracted?: () => void;

  /**
   * We don't want the RTE to re-render when the Slate body changes, as this
   * will result in an infinite loop. However, we do still want to force a re-render
   * in certain cases, like updates from the WYSIWYG. Therefore, if this key changes,
   * the RTE will re-render.
   */
  rteRenderKey?: string;
}

type Props = SelectedStepContentProps & BoxProps;

const SelectedStepContent: React.FC<Props> = ({
  onBodyChange,
  bodySlate,
  stepBody,
  formFactor,
  stepType,
  formKey,
  entityId,
  note,
  onInteracted,
  allowEmptyBody,
  formFactorStyle,
  disabled,
  formEntityType,
  theme,
  snappyAt,
  rteRenderKey,
  ...boxProps
}) => {
  const [wordCount, setWordCount] = useState<number>(countWords(bodySlate));
  const modalState = useToggleState(['snappy']);
  const [snappyCount, setSnappyCount] = useState<number>(0);
  const [_, alert] = getWordCountMax(formFactor);

  const isAnnouncement = isAnnouncementGuide(formFactor);
  const isTooltip = isTooltipGuide(formFactor);
  const isFlow = isFlowGuide(formFactor);
  const isCard = isCardTheme(theme);

  const uiSettings = useUISettings('network-only');
  const { organization } = useOrganization();
  const { accessToken } = useAccessToken();
  const { attributes } = useAttributes();

  /**
   * Note: Not including 'bodySlate' in the memo
   * dependencies since we want this to be recomputed
   * only for the following:
   * - step selection changed.
   * - snappyGpt suggestion was confirmed.
   * - layout changed.
   */
  const { rteCacheKey, initialBody } = useMemo(() => {
    const allowBody =
      !isEmptySlate(bodySlate) ||
      isAnnouncement ||
      isTooltip ||
      isCard ||
      isFlow;

    return {
      initialBody: allowBody
        ? cloneDeep(bodySlate)
        : cloneDeep(
            allowEmptyBody
              ? getEmptyStepBody(stepBody)
              : getDefaultStepBody(stepType, theme, stepBody)
          ),
      rteCacheKey: `rte-${Math.random()}`,
    };
  }, [
    entityId,
    formKey,
    isAnnouncement,
    isTooltip,
    isFlow,
    isCard,
    theme,
    snappyCount,
    rteRenderKey,
  ]);

  const disallowedElementTypes = useMemo(() => {
    const result = getDisallowedElementTypes(formFactor);
    if (supportsUpdatedMediaHandling(theme, formFactor)) {
      (['image', 'videos'] as FormattingType[]).forEach((k) => {
        result[k] = true;
      });
    }
    return result;
  }, [theme, formFactor]);

  const _onChange = useCallback(
    (value: EditorNode[], snappy?: boolean) => {
      onBodyChange(value, snappy);
      setWordCount(countWords(value));
    },
    [onBodyChange]
  );

  const snappyConfirmed = useCallback(
    (newBody: EditorNode[], snappy?: boolean) => {
      _onChange(newBody, snappy);
      setSnappyCount((c) => c + 1);
    },
    [_onChange]
  );

  const rteHeight = useMemo<number | undefined>(
    () => (isAnnouncement || isTooltip || isCard || isFlow ? 210 : undefined),
    [isAnnouncement, isTooltip, isFlow, isCard]
  );

  return (
    <Box {...boxProps}>
      <Box
        mb="1"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {isAnnouncement || isTooltip ? (
          <Box fontSize="sm" fontWeight="bold" color="gray.800">
            {capitalizeFirstLetter(formFactor)} content
          </Box>
        ) : (
          <Text fontSize="sm" fontWeight="bold" color="gray.800">
            Step content
          </Text>
        )}
        {wordCount > alert && !snappyAt && (
          <Button
            onClick={modalState.snappy.on}
            ml="auto"
            mr="2"
            h="7"
            px="2"
            fontSize="xs"
            variant="secondary"
          >
            ✨ Make it snappy
          </Button>
        )}
        <Box display="flex" color="gray.600">
          <Text mr="1">Word count:</Text>
          <Text mr="1" color={wordCountAlertColor(formFactor, wordCount)}>
            {wordCount}
          </Text>
          {snappyAt && (
            <Tooltip label="Made snappy by Bento" placement="top">
              ✨
            </Tooltip>
          )}
        </Box>
      </Box>

      <SnappyModal
        body={bodySlate}
        wordCount={wordCount}
        isOpen={modalState.snappy.isOn}
        onConfirm={snappyConfirmed}
        onClose={modalState.snappy.off}
        formFactorStyle={formFactorStyle}
        theme={theme}
      />

      <RichTextEditor
        attributes={attributes as Attribute[]}
        uiSettings={uiSettings as RichTextEditorUISettings}
        organizationDomain={organization.domain}
        fileUploadConfig={{
          apiHost: API_HOST,
          uploadsHost: UPLOADS_HOST,
        }}
        accessToken={accessToken}
        key={rteCacheKey}
        initialBody={initialBody}
        onBodyChange={_onChange}
        isReadonly={disabled}
        containerKey={formKey}
        onInteracted={onInteracted}
        formEntityType={formEntityType}
        disallowedElementTypes={disallowedElementTypes}
        allowedElementTypes={getAllowedElementTypes(formFactor)}
        pixelHeight={rteHeight}
        recoverableId={entityId}
        formFactor={formFactor}
        formFactorStyle={formFactorStyle}
      />
      {!!note && (
        <Box display="flex" mt="2" alignItems="center" fontSize="12px">
          <InfoOutlinedIcon fontSize="inherit" />
          <Text ml="1" fontSize="12px">
            {note}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default withTemplateDisabled<Props>(SelectedStepContent);
