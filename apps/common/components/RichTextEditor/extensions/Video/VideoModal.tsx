import React, { useState } from 'react';
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
import SwitchField from '../../../SwitchField';
import { extractVideoId } from '../../../SlateContentRenderer/videoHelpers';
import { VideoSourceType } from 'bento-common/types/slate';
import { Modal } from '../../../Modal';

interface VideoModalProps {
  isOpen: boolean;
  onVideo: (
    videoId: string,
    source: VideoSourceType,
    playsInline?: boolean
  ) => void;
  onCancel: () => void;
}

export default function VideoModal({
  isOpen,
  onVideo,
  onCancel,
}: VideoModalProps): JSX.Element {
  const [videoId, setVideoId] = useState('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [playsInline, setPlaysInline] = useState(false);

  const cancelAndClear = (): void => {
    onCancel();
    setVideoId('');
    setIsValid(true);
  };

  const handleVideo = () => {
    const [extractedVideoId, source] = extractVideoId(videoId);
    if (!extractedVideoId || !source) {
      setIsValid(false);
    } else {
      setIsValid(true);
      onVideo(extractedVideoId, source, playsInline);
      setVideoId('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={cancelAndClear} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Video Link</ModalHeader>
        <ModalBody>
          <Input
            value={videoId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVideoId(e.currentTarget.value)
            }
            onKeyPress={(event: React.KeyboardEvent<unknown>) => {
              if (event.key === 'Enter') {
                if (videoId.trim() !== '') {
                  handleVideo();
                  event.preventDefault();
                }
              }
            }}
          />
          <Box mt="2" color="gray.800">
            <span style={{ fontWeight: 600 }}>Currently supported:</span> Loom,
            Vidyard, Vimeo, Wistia, YouTube.
          </Box>
          {!isValid && (
            <Box mt="1" color="red.500">
              Please provide a valid URL.
            </Box>
          )}

          <SwitchField
            mt="4"
            defaultValue={playsInline}
            checkedOption={{ value: true }}
            uncheckedOption={{ value: false, label: 'Play inline' }}
            onChange={
              setPlaysInline as (value: string | number | boolean) => void
            }
            fontWeight="normal"
            fontSize="sm"
            color="gray.500"
            as="checkbox"
          />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelAndClear}>
              Cancel
            </Button>
            <Button
              // variantColor="b-primary"
              isDisabled={videoId.trim() === ''}
              onClick={() => {
                handleVideo();
              }}
            >
              Add video
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
