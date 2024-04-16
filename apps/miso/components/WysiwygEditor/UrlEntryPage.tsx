import React, { useCallback, useState } from 'react';
import { Box, Button, InputGroup, Text } from '@chakra-ui/react';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';
import Input from 'system/Input';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';

type Props = {
  onSelect: (url: string) => Promise<void>;
  defaultUrl?: string;
};

const WysiwygUrlEntryPage: React.FC<Props> = ({ onSelect, defaultUrl }) => {
  const extension = useChromeExtensionInstalled();
  const [urlSelected, setUrlSelected] = useState<string>(defaultUrl || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (_event: React.UIEvent) => {
      try {
        setLoading(true);
        await onSelect(urlSelected);
      } finally {
        setLoading(false);
      }
    },
    [urlSelected]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrlSelected(e.target.value);
    },
    []
  );

  return (
    <Box display="flex" w="100vw" h="100vh" p="32px">
      <Box m="auto" display="flex" flexDir="column">
        <Box mb="6" fontSize="lg" fontWeight="semibold">
          Open your app
        </Box>
        <InputGroup w="2xl" mb="2">
          <Box m="auto" w="full" maxWidth="800px">
            <Input
              placeholder="Enter the URL of your app and press ENTER"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              defaultValue={urlSelected}
              isDisabled={loading || !extension.installed}
            />
          </Box>
          <Button
            onClick={handleSubmit}
            isDisabled={loading || !extension.installed || !urlSelected}
            ml="3"
            isLoading={loading}
          >
            Go
          </Button>
        </InputGroup>
        <Box color="gray.500">
          You can navigate in your app before starting the tag design
          experience.
        </Box>

        {!extension.installed && (
          <CalloutText my="8" calloutType={CalloutTypes.Info} maxWidth="2xl">
            <Box>
              ❗️ To use Bento's no code editor please ensure you are using a{' '}
              <Text display="inline" fontWeight="bold">
                Chromium based browser (e.g. Chrome or Brave)
              </Text>{' '}
              and have installed the Bento Chrome extension.
            </Box>
          </CalloutText>
        )}
      </Box>
    </Box>
  );
};

export default WysiwygUrlEntryPage;
