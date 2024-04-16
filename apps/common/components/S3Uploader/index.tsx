import React, { ReactNode, useCallback, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import ReactS3Uploader from 'react-s3-uploader';
import { useToast } from '@chakra-ui/react';
import env from '@beam-australia/react-env';
import { Box } from '@chakra-ui/react';

// const API_HOST = env('API_HOST')!;
// const UPLOADS_HOST = env('UPLOADS_HOST')!;

type S3UploaderProps = {
  accessToken: string;
  fileUploadConfig: {
    apiHost: string;
    uploadsHost: string;
  };
  children: ReactNode;
  onUploadStart: () => void;
  onUploadedFile: (url: string | null) => void;
  accept?: string;
  sizeLimitKb?: number;
};

export default function S3Uploader({
  accessToken,
  fileUploadConfig,
  children,
  onUploadStart,
  onUploadedFile,
  accept = 'image/*',
  sizeLimitKb,
}: S3UploaderProps) {
  const uploadInput = useRef();
  const toast = useToast();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const uploaderDOM = findDOMNode(uploadInput.current);
    if (uploaderDOM && uploaderDOM instanceof HTMLInputElement)
      uploaderDOM.click();
  }, []);

  const handleUploadStart = useCallback(
    (file: any, next: (file: any) => void) => {
      if (sizeLimitKb && file.size > sizeLimitKb * 1024) {
        toast({
          title: `File is too big (maximum: ${sizeLimitKb}kb)`,
          isClosable: true,
          status: 'error',
        });
        return;
      }
      onUploadStart?.();
      next(file);
    },
    []
  );

  const handleFinish = useCallback(({ fileKey }) => {
    const fileUrl = `${fileUploadConfig.uploadsHost}/${fileKey}`;

    onUploadedFile(fileUrl);
  }, []);

  const handleError = useCallback(() => {
    toast({
      title: 'An error has occurred while uploading',
      isClosable: true,
      status: 'error',
    });
    onUploadedFile(null);
  }, []);

  return (
    <>
      <Box onClick={handleClick}>{children}</Box>
      <Box display="none" height="0" opacity="0" width="0">
        <ReactS3Uploader
          ref={uploadInput}
          signingUrl="/s3/media/uploads/sign"
          signingUrlMethod="GET"
          accept={accept}
          uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
          signingUrlHeaders={{
            // @ts-ignore
            Authorization: `Bearer ${accessToken}`,
          }}
          server={fileUploadConfig.apiHost}
          autoUpload
          preprocess={handleUploadStart}
          onFinish={handleFinish}
          onError={handleError}
        />
      </Box>
    </>
  );
}
