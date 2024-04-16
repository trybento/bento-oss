import React, { useCallback, useEffect, useState } from 'react';

import {
  Button,
  ButtonGroup,
  Input,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Box,
} from '@chakra-ui/react';
import ModalBody from '../../../ModalBody';
import Text from '../../../Text';

import S3Uploader from '../../../S3Uploader';
import CalloutText, { CalloutTypes } from '../../../CalloutText';
import SwitchField from '../../../SwitchField';
import { GuideFormFactor } from 'bento-common/types';
import {
  isModalGuide,
  isTooltipGuide,
  isFlowGuide,
} from 'bento-common/utils/formFactor';
import { Modal } from '../../../Modal';

interface ImageModalProps {
  isOpen: boolean;
  formFactor: GuideFormFactor | undefined;
  onImage: (url: string, lightboxDisabled: boolean) => void;
  onCancel: () => void;
  initialUrl?: string;
  initialLightboxDisabled?: boolean;
  accessToken: string;
  fileUploadConfig: {
    apiHost: string;
    uploadsHost: string;
  };
}

export default function ImageModal({
  isOpen,
  onImage,
  onCancel,
  initialUrl = '',
  initialLightboxDisabled = false,
  formFactor,
  accessToken,
  fileUploadConfig,
}: ImageModalProps): JSX.Element {
  const show = {
    lightboxDisabled:
      !isModalGuide(formFactor) &&
      !isTooltipGuide(formFactor) &&
      !isFlowGuide(formFactor),
  };

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(initialUrl);
  const [lightboxDisabled, setLightboxDisabled] = useState<boolean>(
    initialLightboxDisabled
  );
  const submitDisabled = isUploading || url.trim() === '';

  useEffect(() => {
    isOpen && setUrl(initialUrl);
  }, [isOpen]);

  const cancelAndClear = useCallback((): void => {
    onCancel();
    setUrl('');
  }, [onCancel]);

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
  }, []);

  const handleUploadedFile = useCallback(
    (uploadedFileUrl: string) => {
      setIsUploading(false);
      setUrl('');
      if (uploadedFileUrl) {
        onImage(uploadedFileUrl, lightboxDisabled);
      }
    },
    [onImage, lightboxDisabled]
  );

  const handleLightboxDisabledChange = useCallback((v: boolean) => {
    setLightboxDisabled(v);
  }, []);

  const handleSubmit = useCallback(() => {
    if (submitDisabled) return;

    onImage(url, lightboxDisabled);
    setUrl('');
  }, [onImage, url, lightboxDisabled, submitDisabled]);

  const handleUrlInputKeyPress = useCallback(
    (event: React.KeyboardEvent<unknown>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Modal isOpen={isOpen} onClose={cancelAndClear} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialUrl ? 'Edit' : 'Add'} Image or GIF</ModalHeader>
        <ModalBody>
          <Box>
            <CalloutText calloutType={CalloutTypes.Tip} mb="4">
              We recommend uploading images with a min width of 387px, which is
              the full width of the sidebar.
            </CalloutText>
            <Text mb="1" color="gray.600" fontWeight="bold">
              Upload from computer
            </Text>
            <S3Uploader
              onUploadStart={handleUploadStart}
              onUploadedFile={handleUploadedFile}
              accessToken={accessToken}
              fileUploadConfig={fileUploadConfig}
            >
              <Button isLoading={isUploading} loadingText="Uploading">
                Select file
              </Button>
            </S3Uploader>
          </Box>
          <Box mt="6">
            <Text mb="1" color="gray.600" fontWeight="bold">
              Image / GIF URL
            </Text>
            <Input
              value={url}
              isDisabled={isUploading}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUrl(e.currentTarget.value)
              }
              fontSize="sm"
              onKeyPress={handleUrlInputKeyPress}
            />
          </Box>
          {show.lightboxDisabled && (
            <SwitchField
              mt="6"
              checkedOption={{
                value: false,
                label: 'Open image in lightbox when clicked by user',
              }}
              uncheckedOption={{
                value: true,
              }}
              defaultValue={lightboxDisabled}
              onChange={handleLightboxDisabledChange}
              as="checkbox"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelAndClear}>
              Cancel
            </Button>
            <Button isDisabled={submitDisabled} onClick={handleSubmit}>
              {initialUrl ? 'Update' : 'Add'}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
