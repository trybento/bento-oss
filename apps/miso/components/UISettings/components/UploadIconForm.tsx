import React, { useCallback, useState } from 'react';
import { Box, Button, ButtonProps, Flex, Image } from '@chakra-ui/react';
import NextImage from 'next/image';

import S3Uploader from 'components/S3Uploader';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import UploadImageIcon from 'icons/UploadImage.svg';

export type UploadIconFormProps = {
  iconUrl?: string;
  onSuccess: (url: string) => void;
  showIcon?: boolean;
  buttonVariant?: ButtonProps['variant'];
};

const ICON_SIZE_LIMIT = 100; // 100kb

export default function UploadIconForm({
  iconUrl,
  onSuccess,
  showIcon,
  buttonVariant,
}: UploadIconFormProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onUploadStarted = useCallback(() => {
    setIsUploading(true);
  }, []);

  const onUploadFinished = useCallback(
    (uploadedFileUrl: string) => {
      setIsUploading(false);
      uploadedFileUrl && onSuccess(uploadedFileUrl);
    },
    [onSuccess]
  );

  return (
    <>
      <CalloutText calloutType={CalloutTypes.Tip} mb="4">
        Only PNG and SVG icons with a maximum size of 100kb are supported. For
        the best results, PNGs should have a transparent background.
      </CalloutText>
      <S3Uploader
        accept="image/png, image/svg+xml"
        onUploadStart={onUploadStarted}
        onUploadedFile={onUploadFinished}
        sizeLimitKb={ICON_SIZE_LIMIT}
      >
        <Flex gap="4">
          {showIcon && (
            <Flex
              alignItems="center"
              justifyContent="center"
              w="10"
              h="10"
              bgColor={iconUrl ? 'none' : 'gray.100'}
              borderRadius="full"
              overflow="hidden"
            >
              {iconUrl ? (
                <Image
                  src={iconUrl}
                  w="full"
                  h="full"
                  maxW="full"
                  maxH="full"
                />
              ) : (
                <Box w="4" h="4" position="relative" top="-1px" left="1px">
                  <NextImage src={UploadImageIcon} />
                </Box>
              )}
            </Flex>
          )}
          <Button
            variant={buttonVariant}
            colorScheme="primary"
            isLoading={isUploading}
            loadingText="Uploading"
          >
            {iconUrl ? 'Change icon' : 'Select a file'}
          </Button>
        </Flex>
      </S3Uploader>
    </>
  );
}
