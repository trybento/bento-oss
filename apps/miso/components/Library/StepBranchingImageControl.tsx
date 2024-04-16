import React, { useCallback, useMemo, useState } from 'react';
import NextImage from 'next/image';
import {
  FormControl,
  FormLabel,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';

import { BranchingChoice } from 'bento-common/types/globalShoyuState';
import { px } from 'bento-common/utils/dom';
import {
  BranchingCardStyle,
  CYOABackgroundImagePosition,
} from 'bento-common/types';
import BranchingCard from 'bento-common/components/BranchingCard';

import S3Uploader from 'components/S3Uploader';
import Button from 'system/Button';
import Box from 'system/Box';
import Tooltip from 'system/Tooltip';
import Text from 'system/Text';
import RadioGroup from 'system/RadioGroup';
import Radio from 'system/Radio';
import Input from 'system/Input';
import UploadImageIcon from 'icons/UploadImage.svg';
import colors from 'helpers/colors';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';

const IMAGE_POSITION_OPTIONS = [
  {
    label: 'Background',
    value: CYOABackgroundImagePosition.background,
  },
  {
    label: 'Left',
    value: CYOABackgroundImagePosition.left,
  },
  {
    label: 'Right',
    value: CYOABackgroundImagePosition.right,
  },
  {
    label: 'Top',
    value: CYOABackgroundImagePosition.top,
  },
  {
    label: 'Bottom',
    value: CYOABackgroundImagePosition.bottom,
  },
];

type CommonProps = {
  branchingChoice: Pick<BranchingChoice, 'key' | 'label'>;
  branchingStyle?: BranchingCardStyle;
};

type UploadModalProps = CommonProps & {
  isOpen: boolean;
  onSuccess: (branchingStyle: BranchingCardStyle) => void;
  onCancel: () => void;
};

export const UploadModal: React.FC<UploadModalProps> = ({
  branchingChoice,
  branchingStyle,
  isOpen,
  onSuccess,
  onCancel,
}) => {
  const uiSettings = useUISettings();

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [dummySelected, setDummySelected] = useState<boolean>(false);

  const [branchingStyleSet, setBranchingStyle] = useState(
    branchingStyle || {
      backgroundImageUrl: null,
      backgroundImagePosition: CYOABackgroundImagePosition.background,
    }
  );

  const setBranchingStyleKey = useCallback(
    (key: keyof BranchingCardStyle, value: any) => {
      setBranchingStyle({
        ...branchingStyleSet,
        [key]: value,
      });
    },
    [branchingStyleSet, setBranchingStyle]
  );

  const onClose = useCallback(() => onCancel(), [onCancel]);

  const onSave = useCallback(
    () => onSuccess(branchingStyleSet),
    [onSuccess, branchingStyleSet]
  );

  const onUploadStarted = useCallback(() => {
    setIsUploading(true);
  }, []);

  const onUploadFinished = useCallback(
    (uploadedFileUrl: string) => {
      setIsUploading(false);
      setBranchingStyleKey('backgroundImageUrl', uploadedFileUrl);
    },
    [setBranchingStyleKey]
  );

  const onPositionChange = useCallback(
    (newPosition: CYOABackgroundImagePosition) => {
      setBranchingStyleKey('backgroundImagePosition', newPosition);
    },
    [setBranchingStyleKey]
  );

  const onImageUrlChange = useCallback(
    (event: any) => {
      setBranchingStyleKey('backgroundImageUrl', event.target.value);
    },
    [setBranchingStyleKey]
  );

  const onImageUrlRemoved = useCallback(() => {
    setBranchingStyleKey('backgroundImageUrl', undefined);
  }, [setBranchingStyleKey]);

  const hasImageSet = useMemo(
    () => !!branchingStyleSet?.backgroundImageUrl,
    [branchingStyleSet?.backgroundImageUrl]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Card image</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          {/* Card preview goes here */}

          <Box bgColor="gray.50" p={4}>
            <FormLabel as="legend">Card preview</FormLabel>
            <BranchingCard
              backgroundColor={
                uiSettings?.cyoaOptionBackgroundColor || 'transparent'
              }
              choice={{
                ...branchingChoice,
                selected: dummySelected,
                style: branchingStyleSet,
              }}
              isBackgroundColorDark={
                uiSettings?.isCyoaOptionBackgroundColorDark || false
              }
              isInline={true}
              maxWidth={999}
              minWidth={0}
              textColor={uiSettings?.cyoaTextColor || 'inherit'}
              onClick={() => setDummySelected(!dummySelected)}
            />
          </Box>

          <FormControl as="fieldset" my={4}>
            <FormLabel as="legend">Image position</FormLabel>
            <RadioGroup
              defaultValue={branchingStyleSet.backgroundImagePosition}
              onChange={onPositionChange}
              alignment="horizontal"
              spacing={'unset'}
            >
              {IMAGE_POSITION_OPTIONS.map((option) => (
                <Radio
                  key={`radio-${option.value}`}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl as="fieldset" my={4}>
            <FormLabel as="legend">Image URL</FormLabel>
            <Input
              placeholder="https://"
              value={branchingStyleSet.backgroundImageUrl || ''}
              onChange={onImageUrlChange}
              isDisabled={isUploading}
            />
          </FormControl>

          <Box my={6} fontWeight="bold">
            or
          </Box>

          <Text mb="1" color="gray.600" fontWeight="bold">
            Upload from computer
          </Text>
          <S3Uploader
            onUploadStart={onUploadStarted}
            onUploadedFile={onUploadFinished}
          >
            <Button
              variant="solid"
              colorScheme="primary"
              isLoading={isUploading}
              loadingText="Uploading"
            >
              Select file
            </Button>
          </S3Uploader>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            width="100%"
            justifyContent={hasImageSet ? 'space-between' : 'end'}
          >
            {hasImageSet && (
              <Button
                variant="link"
                color={colors.error.text}
                leftIcon={<DeleteIcon />}
                onClick={onImageUrlRemoved}
              >
                Remove image
              </Button>
            )}
            <Button
              variant="secondary"
              isDisabled={isUploading}
              onClick={onSave}
            >
              Done
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type StepBranchingImageControlProps = CommonProps & {
  onSuccess: (branchingStyle: BranchingCardStyle) => void;
};

const StepBranchingImageControl: React.FC<StepBranchingImageControlProps> = ({
  branchingChoice,
  branchingStyle,
  onSuccess,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const onUploadIconClicked = useCallback(
    () => setModalOpen(true),
    [setModalOpen]
  );

  const onUploadSuccess = useCallback(
    (newBranchingStyle: BranchingCardStyle) => {
      setModalOpen(false);
      onSuccess(newBranchingStyle);
    },
    [onSuccess, setModalOpen]
  );

  const onUploadCancel = useCallback(() => setModalOpen(false), [setModalOpen]);

  const hasImageSet = useMemo(
    () => !!branchingStyle?.backgroundImageUrl,
    [branchingStyle?.backgroundImageUrl]
  );

  return (
    <>
      <Tooltip
        label={hasImageSet ? 'Edit card image' : 'Upload card image'}
        placement="top"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w={10}
          h={10}
          bgColor="gray.100"
          bgImage={branchingStyle?.backgroundImageUrl}
          bgSize="cover"
          borderRadius="full"
          textColor="white"
          position="relative"
          marginLeft="1.5"
          cursor="pointer"
          role="button"
          onClick={onUploadIconClicked}
        >
          <Box
            m="auto"
            w={hasImageSet ? 5 : 4}
            h={4}
            position="relative"
            top={px(-1)}
            left={px(1)}
          >
            {hasImageSet ? (
              <EditIcon fontSize="small" color="inherit" />
            ) : (
              <NextImage src={UploadImageIcon} />
            )}
          </Box>
        </Box>
      </Tooltip>

      <UploadModal
        branchingChoice={branchingChoice}
        branchingStyle={branchingStyle}
        onSuccess={onUploadSuccess}
        onCancel={onUploadCancel}
        isOpen={isModalOpen}
      />
    </>
  );
};

export default StepBranchingImageControl;
