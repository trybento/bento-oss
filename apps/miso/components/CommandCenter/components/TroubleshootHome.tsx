import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Radio,
  RadioGroup,
  VStack,
  Text,
  Button,
  Tag,
} from '@chakra-ui/react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SvgIcon from '@mui/material/SvgIcon';

import colors from 'helpers/colors';
import HelperText from 'system/HelperText';
import {
  TroubleshootChoice,
  TROUBLESHOOTER_LABELS,
} from './commandCenter.types';
import { getUrlQuery } from 'utils/helpers';

const TROUBLESHOOTER_ICON: Record<TroubleshootChoice, typeof SvgIcon> = {
  [TroubleshootChoice.userGettingWrongContent]: VisibilityOutlinedIcon,
  [TroubleshootChoice.userNotGettingContent]: VisibilityOffOutlinedIcon,
  [TroubleshootChoice.willUserGetContent]: SearchOutlinedIcon,
};

type Props = {
  selectChoice: (choice: TroubleshootChoice) => void;
};

export default function TroubleshootHome({ selectChoice }: Props) {
  const [selected, setSelected] = useState<string | TroubleshootChoice>(
    TroubleshootChoice.userNotGettingContent
  );

  const handleSelected = useCallback(
    () => selectChoice(selected as TroubleshootChoice),
    [selected]
  );

  useEffect(() => {
    const select = getUrlQuery('diagnose', 'targeted') as TroubleshootChoice;

    if (select && Object.values(TroubleshootChoice).includes(select))
      selectChoice(select);
  }, []);

  return (
    <Box w="xl">
      <RadioGroup value={selected} onChange={setSelected}>
        <VStack spacing={2}>
          <TroubleshootChoiceButton
            type={TroubleshootChoice.userNotGettingContent}
          />
          <HelperText w="full">Coming soon</HelperText>
          <TroubleshootChoiceButton
            type={TroubleshootChoice.willUserGetContent}
            disabled
          />
          <TroubleshootChoiceButton
            type={TroubleshootChoice.userGettingWrongContent}
            disabled
          />
        </VStack>
      </RadioGroup>
      <Box mt="4" w="full" display="flex" justifyContent="flex-end">
        <Button onClick={handleSelected} isDisabled={!selected}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

function TroubleshootChoiceButton({
  disabled,
  type,
}: {
  disabled?: boolean;
  type: TroubleshootChoice;
}) {
  const Icon = TROUBLESHOOTER_ICON[type];

  return (
    <Box
      display="flex"
      w="full"
      border={`1px solid ${colors.gray[200]}`}
      borderRadius="sm"
      key={type}
      px="4"
      py="6"
      color={disabled ? colors.text.placeholder : undefined}
      bgColor={disabled ? colors.gray[50] : undefined}
    >
      <Radio w="full" value={type} isDisabled={disabled} position="relative">
        <Text ml="2">{TROUBLESHOOTER_LABELS[type]}</Text>
        <Tag
          color="gray.50"
          borderRadius="full"
          position="absolute"
          top="0"
          right="0"
          w="30px"
          h="30px"
        >
          <Box
            position="relative"
            right="2px"
            color="gray.500"
            display="flex"
            alignItems="center"
          >
            <Icon fontSize="small" />
          </Box>
        </Tag>
      </Radio>
    </Box>
  );
}
