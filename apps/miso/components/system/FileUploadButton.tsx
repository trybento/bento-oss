import React, { useRef, forwardRef, useCallback, useEffect } from 'react';
import { Box, Button, ButtonProps } from '@chakra-ui/react';

interface FileUploadButtonProps extends ButtonProps {
  onSelected: (file: File) => void;
  label?: string;
  accept: string;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
}

const FileUploadButton = forwardRef<HTMLDivElement, FileUploadButtonProps>(
  (
    {
      onSelected,
      label = 'Upload file',
      accept,
      inputRef,
      ...rest
    }: FileUploadButtonProps,
    ref
  ) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const handleSelectFile = useCallback(() => {
      fileInput && fileInput.current && fileInput.current.click();
    }, [fileInput]);

    useEffect(() => {
      if (fileInput.current) inputRef.current = fileInput.current;
    }, [fileInput]);

    const handleSelected = useCallback(
      (e: React.FormEvent<HTMLInputElement>) => {
        if (!fileInput) return;

        const [file] = fileInput.current.files;

        if (!file) return;

        onSelected(file);
      },
      [fileInput, onSelected]
    );

    return (
      <Box ref={ref}>
        <input
          id="file"
          type="file"
          onInput={handleSelected}
          style={{ display: 'none' }}
          ref={fileInput}
          accept={accept}
        />
        <Button {...rest} onClick={handleSelectFile}>
          {label}
        </Button>
      </Box>
    );
  }
);

export default FileUploadButton;
