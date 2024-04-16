import { Flex, Link } from '@chakra-ui/layout';
import Text from 'system/Text';
import NoSIMIcon from '@mui/icons-material/NoSimOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import { Avatar } from '@chakra-ui/react';
import { useCallback } from 'react';
import { MAILTO_RESTART_TRIAL } from 'bento-common/utils/docs';

export enum WysiwygError {
  /**
   * When some error prevents the extension from loading the visual builder.
   * This is the most generic error, therefore we should always attempt to determine/handle
   * errors in a more specific way to help users.
   */
  generic = 'generic',
  /**
   * When there is another visual builder session open,
   * therefore the user shouldn't be allowed to start a new one.
   */
  duplicateSession = 'duplicateSession',
  /**
   * Organization is not active (trial or subscription of Bento has ended),
   * therefore it should not be allowed to use the visual builder. Otherwise, the preview
   * experiences that currently depend on the snippet will break.
   */
  inactiveOrg = 'inactiveOrg',
}

type Props = {
  /**
   * Specifies the error that caused the visual builder to fail loading.
   * @default generic
   */
  error?: WysiwygError;
};

const HEADING_PROPS = { className: 'text-2xl font-bold' };
const TEXT_PROPS = { className: 'text-lg leading-7' };

const WysiwygErrorPage: React.FC<Props> = ({ error }) => {
  const handleRestartTrial = useCallback(
    (_event: React.MouseEvent<HTMLElement>) => {
      window.location.href = MAILTO_RESTART_TRIAL;
    },
    []
  );

  /**
   * Determines which icon to show based on the error type.
   */
  const ErrorIcon = () => {
    switch (error) {
      case WysiwygError.inactiveOrg:
        return <PauseIcon />;
      default:
        return <NoSIMIcon />;
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center" w="100vw" h="100vh">
      <Flex alignItems="center" gap={6}>
        <Avatar
          w={14}
          h={14}
          backgroundColor="gray.100"
          color="gray.600"
          icon={<ErrorIcon sx={{ fontSize: '40px' }} />}
        />
        <Flex flexDirection="column" gap={2}>
          {error === WysiwygError.generic && (
            <>
              <Text {...HEADING_PROPS}>
                There has been an error loading the visual builder.
              </Text>
              <Text {...TEXT_PROPS}>Please close this page and try again.</Text>
            </>
          )}

          {error === WysiwygError.duplicateSession && (
            <>
              <Text {...HEADING_PROPS}>
                You have another visual builder session open.
              </Text>
              <Text {...TEXT_PROPS}>
                Please close the existing session and this page, and try again.
              </Text>
            </>
          )}

          {error === WysiwygError.inactiveOrg && (
            <>
              <Text {...HEADING_PROPS}>Your organization is inactive</Text>
              <Text {...TEXT_PROPS}>
                Your Bento subscription is not active so we cannot load elements
                into your app.
                <br /> Please{' '}
                <Link
                  onClick={handleRestartTrial}
                  fontWeight="bold"
                  color="bento.bright"
                >
                  contact us
                </Link>{' '}
                to restart your trial.
              </Text>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default WysiwygErrorPage;
