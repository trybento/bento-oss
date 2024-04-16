import React, { useCallback } from 'react';
import { Text, Button, ButtonProps } from '@chakra-ui/react';

type Props = {
  variant?: ButtonProps['variant'];
};

/**
 * @todo remove associated paywalls and this component
 * @deprecated soon to be removed
 */
const UpgradePlanButton = ({ variant }: Props) => {
  const handleOnClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    window.location.href = 'mailto:support@trybento.co?subject=Upgrade my plan';

    e.preventDefault();
  }, []);

  return (
    <Button
      onClick={handleOnClick}
      variant={variant || 'secondary'}
      position="absolute"
      bottom="1.5em"
      left="50%"
      transform="translateX(-50%)"
    >
      <Text ml="2">Upgrade your plan</Text>
    </Button>
  );
};

export default UpgradePlanButton;
