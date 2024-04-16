import React, { useCallback } from 'react';
import Box from 'system/Box';
import { Button, Flex, Text, Icon } from '@chakra-ui/react';
import CheckCircle from '@mui/icons-material/CheckCircleOutline';
import Image from 'system/Image';
import { IntegrationOption } from './types';
import BentoInfo from 'system/BentoInfo';
import UpgradePlanButton from './UpgradePlanButton';

const PLACEHOLDER = 'Coming soon!';

const IntegrationBlock: React.FC<IntegrationOption> = ({
  name,
  logoUrl,
  logoStyling,
  onClick,
  onCancel,
  calloutText,
  currentIntegration,
  startButtonLabel,
  description,
  cancelButtonLabel,
  editButtonLabel,
  actionButton,
  CustomBody,
  disabled,
}) => {
  const handleAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick();
      e.preventDefault();
    },
    [onClick]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onCancel?.();
      e.preventDefault();
    },
    [onCancel]
  );

  const isActive = !!currentIntegration?.value;

  const showCheck = currentIntegration.check
    ? currentIntegration.check() && isActive
    : isActive;

  return (
    <Box
      mr={4}
      borderRadius="9px"
      border="4px solid"
      borderColor="white"
      textAlign="center"
      id={`integration-item-${name.toLowerCase().replace(' ', '')}`}
    >
      <Box
        borderRadius="4px"
        border="1px solid"
        borderColor="border"
        height="262px"
        width="306px"
        className="integration-outer-box"
      >
        <Box
          width="100%"
          margin="auto"
          height="100%"
          textAlign="center"
          padding="2em 0 0.5em"
          position="relative"
          className="integration-inner-box"
        >
          {showCheck && (
            <Icon
              className="integration-setup-indicator"
              style={{
                color: '#38A169',
                position: 'absolute',
                top: '0.5em',
                left: '0.5em',
              }}
              as={CheckCircle}
              w={18}
              h={18}
            />
          )}
          <Image
            src={logoUrl}
            maxHeight="32px"
            objectFit="contain"
            maxWidth="200px"
            margin="auto"
            {...logoStyling}
          />
          <Text fontSize="s" margin="1em 0" padding="0 2em" userSelect="none">
            {description}
          </Text>
          {calloutText ? (
            <BentoInfo
              mx="6"
              fontSize="11px"
              p="1"
              className="integration-callout"
            >
              {calloutText}
            </BentoInfo>
          ) : null}
          {CustomBody ? (
            CustomBody
          ) : (
            <>
              {isActive && <Box>{actionButton}</Box>}
              {isActive ? (
                onCancel ? (
                  <Flex
                    justifyContent="space-between"
                    width="100%"
                    p="0.5em"
                    position="absolute"
                    bottom="0"
                  >
                    <Button
                      variant="ghost"
                      isDisabled={!onCancel}
                      onClick={handleCancel}
                    >
                      {cancelButtonLabel || 'Disconnect'}
                    </Button>
                    <Button variant="ghost" onClick={handleAction}>
                      {editButtonLabel || 'Edit'}
                    </Button>
                  </Flex>
                ) : (
                  <Button
                    variant="secondary"
                    position="absolute"
                    bottom="1.5em"
                    left="50%"
                    transform="translateX(-50%)"
                    onClick={handleAction}
                  >
                    {editButtonLabel || 'Edit'}
                  </Button>
                )
              ) : disabled ? (
                <UpgradePlanButton />
              ) : (
                <Button
                  variant="secondary"
                  position="absolute"
                  bottom="1.5em"
                  left="50%"
                  transform="translateX(-50%)"
                  isDisabled={description === PLACEHOLDER}
                  onClick={handleAction}
                >
                  {startButtonLabel || 'Connect'}
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default IntegrationBlock;
