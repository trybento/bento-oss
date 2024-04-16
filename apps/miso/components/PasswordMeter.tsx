import { Box, Progress, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { getPasswordStrength } from 'utils/passwords';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';

type Props = {
  password: string;
  showErrors: boolean;
  errors?: string;
};

type PasswordStrength = Awaited<ReturnType<typeof getPasswordStrength>>;

const colors = ['red', 'red', 'orange', 'yellow', 'green'];

const PasswordMeter: React.FC<Props> = ({ password, errors, showErrors }) => {
  const [score, setScore] = useState<PasswordStrength['score']>(null);
  const [feedback, setFeedback] = useState<PasswordStrength['feedback']>();

  useEffect(() => {
    (async () => {
      const strength = await getPasswordStrength(password);
      setScore(strength.score);
      setFeedback(strength.feedback);
    })();
  }, [password]);

  return (
    <Box>
      {password.length > 0 && (
        <Progress max={4} value={score} colorScheme={colors[score]} mt={1} />
      )}
      {showErrors && (feedback?.suggestions.length > 0 || errors) && (
        <CalloutText mt={1} calloutType={CalloutTypes.Error}>
          {errors ? (
            <Text>{errors}</Text>
          ) : (
            feedback.suggestions.map((suggestion, i) => (
              <Text key={i}>{suggestion}</Text>
            ))
          )}
        </CalloutText>
      )}
    </Box>
  );
};

export default PasswordMeter;
