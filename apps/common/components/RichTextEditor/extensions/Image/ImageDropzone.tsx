import React, { useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import ReactS3Uploader from 'react-s3-uploader';
import useImageTrigger from './useImageTrigger';
import { findDOMNode } from 'react-dom';
import { Box } from '@chakra-ui/react';

interface ImageDropzoneProps {
  accessToken: string;
  fileUploadConfig: {
    apiHost: string;
    uploadsHost: string;
  };
  isDraggingFile: boolean;
  filesDropped?: any;
  onDropped?: (e?: any) => void;
  onDragEnter?: (e?: any) => void;
  onDragLeave?: (e?: any) => void;
  onDrop?: (e?: any) => void;
  onUploadStart?: () => void;
  onUploaded?: () => void;
}

export default function ImageDropzone({
  accessToken,
  fileUploadConfig,
  isDraggingFile,
  filesDropped,
  onDragEnter,
  onDragLeave,
  onDrop,
  onUploadStart,
  onUploaded,
}: ImageDropzoneProps): JSX.Element {
  const uploadInput = useRef<any>(null);
  const { onImage } = useImageTrigger();
  const toast = useToast();

  const handleUploadStart = (file: any, next: (file: any) => void) => {
    onUploadStart && onUploadStart();
    next(file);
  };

  const handleFinish = ({ fileKey }) => {
    const fileUrl = `${fileUploadConfig.uploadsHost}/${fileKey}`;
    onImage(fileUrl, false);
    onUploaded();
  };

  const handleError = () => {
    toast({
      title: 'An error has occurred while uploading',
      isClosable: true,
      status: 'error',
    });
    onUploaded();
  };

  if (filesDropped) {
    const uploaderDOM = findDOMNode(uploadInput.current);
    if (uploaderDOM && uploaderDOM instanceof HTMLInputElement) {
      uploaderDOM.files = filesDropped;
      uploaderDOM.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  return (
    <Box
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      transition="opacity .218s"
      opacity={isDraggingFile ? '1' : '0'}
    >
      <ReactS3Uploader
        style={{ display: 'none' }}
        ref={uploadInput}
        signingUrl="/s3/media/uploads/sign"
        signingUrlMethod="GET"
        accept="image/*"
        uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
        signingUrlHeaders={
          {
            Authorization: `Bearer ${accessToken}`,
          } as any
        }
        server={fileUploadConfig.apiHost}
        preprocess={handleUploadStart}
        onFinish={handleFinish}
        onError={handleError}
      />
    </Box>
  );
}
