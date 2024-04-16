import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import TextField from 'components/common/InputFields/TextField';
import {
  ImageMediaReferenceSettings,
  MediaReferenceInput,
  MediaType,
} from 'bento-common/types/media';
import isUrl from 'is-url';
import { useFormikContext } from 'formik';
import ReplayIcon from '@mui/icons-material/Replay';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import CenterFocusStrongOutlinedIcon from '@mui/icons-material/CenterFocusStrongOutlined';
import env from '@beam-australia/react-env';
import { UUID_REGEX_STR } from 'bento-common/graphql/EntityId';
import {
  getParsedMediaMeta,
  getParsedMediaSettings,
  mediatypeOptions,
} from 'bento-common/data/helpers';
import { SelectOptions } from 'system/Select';
import { px } from 'bento-common/utils/dom';
import { FillEnum, GuideFormFactor } from 'bento-common/types';

import Image from 'system/Image';
import useToggleState from 'hooks/useToggleState';
import FloatingControls from 'system/FloatingControls';
import { isEdgeToEdge } from 'bento-common/utils/image';
import S3Uploader from 'components/S3Uploader';
import PopoverTip from 'system/PopoverTip';
import { extractVideoId } from 'bento-common/components/SlateContentRenderer/videoHelpers';
import VideoElement, {
  defaultVideoElementSize,
} from 'bento-common/components/RichTextEditor/extensions/Video/VideoElement';
import SelectField from 'components/common/InputFields/SelectField';
import colors from 'helpers/colors';
import MockAttributeField from 'components/common/InputFields/MockAttributeField';
import { useTemplate } from 'providers/TemplateProvider';

const UPLOADS_HOST = env('UPLOADS_HOST')!;

interface Props {
  formKey: string;
  formFactor: GuideFormFactor;
  mediaReference: MediaReferenceInput;
  numberAttributeOptions: any[];
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback func called when the changes are discarded (i.e. cancelled or closed) */
  onDismiss: () => void;
  /** Callback func called when the changes are "persisted" */
  onSubmit: () => void;
}

export const getDefaultMediaReference = (type: MediaType) => ({
  media: { type, url: '', meta: {} },
  settings:
    type === MediaType.image
      ? ({ lightboxDisabled: true } as ImageMediaReferenceSettings)
      : {},
});

const previewSize = { width: '280x', height: '120px' };

const invalidUrlMessage = 'Please provide a valid URL.';

/**
 * WARNING: This component is made aware of the Formik context it is part of, therefore
 * it mutates the state directly when needed.
 *
 * Due to the usage of `MockAttributeField`, we can't easily remove its awareness of Formik's context.
 */
const MediaEditorModal: FC<Props> = ({
  formKey,
  mediaReference: initialMediaReference,
  numberAttributeOptions,
  isOpen,
  onDismiss,
  onSubmit,
}) => {
  const { setMediaPositionDefaults } = useTemplate();

  const { media, settings } = initialMediaReference;

  const [isValidUrl, setIsValidUrl] = useState<boolean>(
    !media?.url || isUrl(media.url)
  );
  const [mediaUrl, setMediaUrl] = useState<string>(media?.url);
  const mediaType = media?.type || mediatypeOptions[0].value;

  const editorState = useToggleState([
    'editing',
    'hoveringPreview',
    'uploading',
  ]);

  const previewUrl = useMemo(() => {
    const url = mediaUrl || '';
    return media?.type === MediaType.image
      ? url
          // User uploads.
          .replace(`${UPLOADS_HOST}/media/`, '')
          // Bento provided images.
          .replace(
            'https://s3.us-west-1.amazonaws.com/assets.trybento.co/images/',
            ''
          )
          // Remove UUIDs.
          .replace(new RegExp(`${UUID_REGEX_STR}/`), '')
          .replace(new RegExp(`${UUID_REGEX_STR}_`), '')
      : url;
  }, [mediaUrl]);

  /**
   * Track preview dimensions to handle floating
   * controls positioning.
   */
  const [previewEl, setPreviewEl] = useState<HTMLImageElement>(null);
  const { setFieldValue } = useFormikContext();

  /**
   * Simply removing the need of casting settings everywhere.
   * May be undefined but typings won't show that even if explicitly set.
   */
  const { imageSettings, videoSettings, videoMeta } = useMemo(
    () => ({
      ...getParsedMediaSettings(settings),
      ...getParsedMediaMeta(media?.meta),
    }),
    [settings, media?.meta]
  );

  const handleTypeChange = useCallback(
    (option: SelectOptions): void => {
      const newType = option.value as MediaType;
      setFieldValue(formKey, getDefaultMediaReference(newType));
      setIsValidUrl(true);
      setMediaUrl('');
      setMediaPositionDefaults({ newMediaType: newType });
    },
    [formKey, setMediaPositionDefaults]
  );

  const previewActions = {
    [MediaType.image]: [
      {
        icon: ReplayIcon,
        tooltipLabel: 'Replace image/GIF',
        action: editorState.editing.isOn
          ? editorState.editing.off
          : editorState.editing.on,
        highlighted: editorState.editing.isOn,
      },
      {
        icon: CenterFocusStrongOutlinedIcon,
        tooltipLabel: 'Edge-to-edge',
        action: () =>
          setFieldValue(
            `${formKey}.settings.fill`,
            isEdgeToEdge(imageSettings?.fill)
              ? FillEnum.unset
              : FillEnum.marginless
          ),
        highlighted: isEdgeToEdge(imageSettings?.fill),
      },
      {
        icon: PhotoLibraryOutlinedIcon,
        tooltipLabel: 'Open in lightbox when clicked',
        action: () =>
          setFieldValue(
            `${formKey}.settings.lightboxDisabled`,
            !imageSettings?.lightboxDisabled
          ),
        highlighted: !imageSettings?.lightboxDisabled,
      },
    ],
    [MediaType.video]: [
      {
        icon: ReplayIcon,
        tooltipLabel: 'Replace video',
        action: editorState.editing.isOn
          ? editorState.editing.off
          : editorState.editing.on,
        highlighted: editorState.editing.isOn,
      },
      {
        icon: OndemandVideoOutlinedIcon,
        tooltipLabel: 'Play inline',
        action: () =>
          setFieldValue(
            `${formKey}.settings.playsInline`,
            !videoSettings?.playsInline
          ),
        highlighted: videoSettings?.playsInline,
      },
    ],
  };

  const handleUploadedFile = useCallback(
    (uploadedFileUrl: string) => {
      if (uploadedFileUrl) {
        setFieldValue(`${formKey}.media.url`, uploadedFileUrl);
        setMediaUrl(uploadedFileUrl);
        editorState.allOff();
      }
    },
    [editorState]
  );

  const handleUrlChange = useCallback(
    (newUrl: string) => setMediaUrl(newUrl),
    []
  );

  const handleSubmit = useCallback(() => {
    const newUrl = mediaUrl;

    if (mediaType === MediaType.numberAttribute) {
      /** Simply allow the form changes to remain without "url" validation */
      editorState.editing.off();
      onSubmit();
    } else {
      if (!newUrl || !isUrl(newUrl)) {
        setIsValidUrl(false);
        return;
      }

      if (mediaType === MediaType.image) {
        setFieldValue(`${formKey}.media.url`, newUrl);
      } else if (mediaType === MediaType.video) {
        const [videoId, videoType] = extractVideoId(newUrl);
        setFieldValue(`${formKey}.media.meta`, { videoId, videoType });
        setFieldValue(`${formKey}.media.url`, newUrl);
      }
      setIsValidUrl(true);
      editorState.editing.off();
      onSubmit();
    }
  }, [editorState.editing, formKey, mediaType, onSubmit, mediaUrl]);

  const handleUrlKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }, []);

  const show = {
    editControls: editorState.editing.isOn || !media?.url,
  };

  return (
    <Modal isOpen={isOpen} onClose={onDismiss} size="lg" closeOnEsc={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit media</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDir="column" gap="4">
            <Flex flexDir="column" gap="4">
              <SelectField
                label="Media type"
                isSearchable={false}
                options={mediatypeOptions}
                defaultValue={
                  mediatypeOptions.find((o) => mediaType === o.value).value
                }
                onChange={handleTypeChange}
              />
              {mediaType === MediaType.image && (
                <>
                  {media?.url && (
                    <Flex flexDir="column" gap="2">
                      <Box color="black" fontWeight="bold">
                        Image/GIF
                      </Box>
                      <Flex
                        position="relative"
                        onMouseEnter={editorState.hoveringPreview.on}
                        onMouseLeave={editorState.hoveringPreview.off}
                      >
                        {previewEl && editorState.hoveringPreview.isOn && (
                          <FloatingControls
                            top={px(previewEl.height / 2)}
                            left={px(previewEl.width / 2)}
                            transform="translate(-50%, -50%)"
                            additionalActions={previewActions.image}
                          />
                        )}
                        <Image
                          key={`image-preview-${media.url}`}
                          onLoad={(e) => setPreviewEl(e.currentTarget)}
                          mr="auto"
                          src={media.url}
                          objectFit="contain"
                          {...previewSize}
                        />
                      </Flex>
                      <Box color="black" isTruncated>
                        {previewUrl}
                      </Box>
                    </Flex>
                  )}
                  {show.editControls && (
                    <Flex flexDir="column" gap="4">
                      <Flex flexDir="column" cursor="pointer">
                        <FormLabel>
                          Upload from computer
                          <PopoverTip placement="top">
                            We suggest image/gifs no larger than 300kbs in size
                            for loading speed
                          </PopoverTip>
                        </FormLabel>
                        <S3Uploader
                          onUploadStart={editorState.uploading.on}
                          onUploadedFile={handleUploadedFile}
                        >
                          <Button
                            isLoading={editorState.uploading.isOn}
                            _hover={{ opacity: 0.8 }}
                            loadingText="Uploading"
                          >
                            Select a file
                          </Button>
                        </S3Uploader>
                      </Flex>
                      <Box color="black">or</Box>
                      <TextField
                        onChange={handleUrlChange}
                        onKeyDown={handleUrlKeyDown}
                        disabled={editorState.uploading.isOn}
                        fontSize="sm"
                        label={
                          <>
                            Image/GIF URL
                            {!isValidUrl && (
                              <PopoverTip
                                iconBoxProps={{
                                  color: colors.error.bright,
                                }}
                                placement="top"
                              >
                                {invalidUrlMessage}
                              </PopoverTip>
                            )}
                          </>
                        }
                        defaultValue={mediaUrl || ''}
                        helperText="Press enter to submit"
                        helperTextProps={{
                          fontSize: 'xs',
                        }}
                        isInvalid={!isValidUrl}
                      />
                    </Flex>
                  )}
                </>
              )}
              {mediaType === MediaType.video && (
                <>
                  {media?.url && (
                    <Flex flexDir="column" gap="2">
                      <Box color="black" fontWeight="bold">
                        Video
                      </Box>
                      <Flex
                        position="relative"
                        onMouseEnter={editorState.hoveringPreview.on}
                        onMouseLeave={editorState.hoveringPreview.off}
                      >
                        {editorState.hoveringPreview.isOn && (
                          <FloatingControls
                            top={px(defaultVideoElementSize.height / 2)}
                            left={px(defaultVideoElementSize.width / 2)}
                            transform="translate(-50%, -50%)"
                            additionalActions={previewActions.video}
                          />
                        )}
                        <VideoElement
                          element={{
                            videoId: videoMeta?.videoId,
                            type: videoMeta?.videoType as any,
                            children: [],
                          }}
                          style={{
                            width: px(defaultVideoElementSize.width),
                            height: px(defaultVideoElementSize.height),
                            pointerEvents: 'none',
                          }}
                        />
                      </Flex>
                      <Box color="black" isTruncated>
                        {previewUrl}
                      </Box>
                    </Flex>
                  )}
                  {show.editControls && (
                    <TextField
                      onChange={handleUrlChange}
                      onKeyDown={handleUrlKeyDown}
                      label={
                        <>
                          Video URL
                          <PopoverTip
                            iconBoxProps={{
                              color: isValidUrl
                                ? undefined
                                : colors.error.bright,
                            }}
                            placement="top"
                          >
                            {(isValidUrl ? '' : invalidUrlMessage + ' ') +
                              'Currently supported: Loom, Vidyard, Vimeo, Wistia, YouTube.'}
                          </PopoverTip>
                        </>
                      }
                      fontSize="sm"
                      defaultValue={mediaUrl}
                      placeholder="https://"
                      helperText="Press enter to submit"
                      helperTextProps={{
                        fontSize: 'xs',
                      }}
                      isInvalid={!isValidUrl}
                    />
                  )}
                </>
              )}
              {mediaType === MediaType.numberAttribute && (
                <>
                  <SelectField
                    name={`${formKey}.media.url`}
                    label="Which dynamic attribute should be shown"
                    isSearchable={true}
                    options={numberAttributeOptions}
                    defaultValue={
                      numberAttributeOptions.find((o) => media.url === o.value)
                        ?.value
                    }
                  />
                  <MockAttributeField
                    label="Preview dynamic attribute value"
                    helperText="Enter in an example value to preview how it will look"
                    placeholder="Example value e.g. 74"
                    fontSize="sm"
                    defaultValue={media?.url}
                    defaultMockValue="0"
                    fieldToMock={`${formKey}.media.url`}
                    type="number"
                    helperTextProps={{
                      fontSize: 'xs',
                    }}
                  />
                </>
              )}
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={onDismiss}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Done</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MediaEditorModal;
