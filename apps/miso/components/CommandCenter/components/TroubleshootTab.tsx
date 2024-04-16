import React, { useCallback, useState } from 'react';
import { VStack } from '@chakra-ui/react';

import TroubleshooterHome from './TroubleshootHome';
import {
  TroubleshootChoice,
  TROUBLESHOOTER_LABELS,
} from './commandCenter.types';
import Tag from 'system/Tag';
import TroubleshootUserNotGettingContent from './Troubleshooter/TroubleshootUserNotGettingContent';
import TroubleshootNotImplemented from './Troubleshooter/TroubleshootNotImplemented';
import { getUrlQuery } from 'utils/helpers';
import InlineLink from 'components/common/InlineLink';
import TabInfoHeader from '../../layout/TabInfoHeader';

const TROUBLESHOOT_COMPONENTS = {
  [TroubleshootChoice.userNotGettingContent]: TroubleshootUserNotGettingContent,
};

const getInitTroubleshooter = () => {
  const select = getUrlQuery('diagnose') as TroubleshootChoice;

  if (select && Object.values(TroubleshootChoice).includes(select))
    return select;

  return null;
};

export default function TroubleshootTab() {
  const [selected, setSelected] = useState<TroubleshootChoice>(
    getInitTroubleshooter()
  );

  const TroubleshooterComponent =
    TROUBLESHOOT_COMPONENTS[selected] ?? TroubleshootNotImplemented;

  const handleReset = useCallback(() => setSelected(null), []);

  return (
    <VStack alignItems="flex-start" maxW={1600}>
      {!selected ? (
        <>
          <TabInfoHeader title="What do you need help with?">
            Troubleshooting allows Bento to point out why a user may or may not
            get the experience you expect, so you can adjust things on your own.{' '}
            <InlineLink
              ml="1"
              label="Learn more."
              href="https://help.trybento.co/en/articles/8671735-command-center#h_1d29dd7863"
            />
          </TabInfoHeader>
          <TroubleshooterHome selectChoice={setSelected} />
        </>
      ) : (
        <VStack alignItems="flex-start">
          <Tag text={TROUBLESHOOTER_LABELS[selected]} />
          <TroubleshooterComponent onReset={handleReset} />
        </VStack>
      )}
    </VStack>
  );
}
