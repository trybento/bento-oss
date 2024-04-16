import React, { useEffect, useMemo, useState } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { BentoLoadingSpinner } from 'components/TableRenderer';
import { GenerationMethod } from './autoGenerateContent.helpers';

interface GptLoaderProps extends FlexProps {
  /** If provided, uses default guide generation messages but swaps out object type */
  generationMethod?: GenerationMethod;
  /** Replaces guide generation messages with something custom */
  customLoadingMessages?: string[];
  /** Fires a hook when updating the timer. Time is in seconds. */
  onLoadingTime?: (time: number) => void;
  hideSpinner?: boolean;
}

const TIMER_INTERVAL = 2000;

const GptLoader: React.FC<GptLoaderProps> = ({
  customLoadingMessages,
  generationMethod,
  onLoadingTime,
  hideSpinner,
  ...flexProps
}) => {
  const [secondsLoading, setSecondsLoading] = useState<number>(0);

  const loadingMessages = useMemo(() => {
    return (
      customLoadingMessages ?? [
        `Processing your ${
          generationMethod === GenerationMethod.links
            ? 'article'
            : generationMethod === GenerationMethod.clickThrough
            ? 'actions'
            : 'transcript'
        }`,
        'Generating steps',
        'Adding calls to action',
        'Final polish and style',
      ]
    );
  }, [generationMethod, customLoadingMessages]);

  useEffect(() => {
    const waitInterval = setInterval(() => {
      setSecondsLoading((s) => {
        const newTime = s + 1;
        onLoadingTime?.(newTime);
        return newTime;
      });
    }, TIMER_INTERVAL);

    return () => {
      clearInterval(waitInterval);
    };
  }, []);

  return (
    <Flex flexDir="column" pt="10" {...flexProps}>
      {!hideSpinner && <BentoLoadingSpinner size={80} />}
      <Flex
        mt={hideSpinner ? '4' : '12'}
        flexDir="column"
        gap="5"
        w="full"
        maxW="380px"
        mx="auto"
        h="10em"
        textAlign="center"
      >
        {[...Array(secondsLoading)].map((_, i) => {
          const msg = loadingMessages[i];
          return msg ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: 'easeOut', duration: 0.5 }}
              key={`loading-message-${i}`}
            >
              {msg}...
            </motion.div>
          ) : null;
        })}
      </Flex>
    </Flex>
  );
};

export default GptLoader;
