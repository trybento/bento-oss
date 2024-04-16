import { useEffect, useState } from 'react';

interface UseFileReaderData {
  result: string | undefined | null;
  error: ProgressEvent<FileReader> | null;
  file: Blob | null;
  isLoading: boolean;
}

type SetFile = (file: Blob) => void;

const useFileReader = (): [UseFileReaderData, SetFile] => {
  const [file, setFile] = useState<Blob | null>(null);
  const [error, setError] = useState<ProgressEvent<FileReader> | null>(null);
  const [result, setResult] = useState<UseFileReaderData['result']>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadstart = () => {
      setIsLoading(true);
    };
    reader.onloadend = () => {
      setIsLoading(false);
    };
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        return;
      }
      setResult(result);
    };
    reader.onerror = (e) => {
      setError(e);
    };
    try {
      reader.readAsDataURL(file);
    } catch (e) {
      // @ts-ignore - not sure how to type this error
      setError(e);
    }
  }, [file]);

  return [{ result, error, file, isLoading }, setFile];
};

export default useFileReader;
