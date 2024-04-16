import React, { useState } from 'react';
import { FormLabel } from '@chakra-ui/react';

import InfoCard from 'system/InfoCard';
import TroubleshootInputSection from './TroubleshootInputSection';
import H5 from 'system/H5';
import { AccountSelect, AccountUserSelect } from '../CustomerEntitySelect';
import {
  AccountSelection,
  AccountUserSelection,
} from '../CustomerEntitySelect';
import Radio from 'system/Radio';
import RadioGroup from 'system/RadioGroup';
import Box from 'system/Box';

type Props = {
  accountEntityId?: string;
  accountUserEntityId: string;
  handleAccountChange: (wipe: boolean) => (val: AccountSelection) => void;
  handleAccountUserChange: (
    wipe: boolean
  ) => (val: AccountUserSelection) => void;
};

enum Method {
  userName = 'useName',
  userEmail = 'userEmail',
  userExternalId = 'userExternalId',
}

const TroubleshootUserSelection: React.FC<Props> = ({
  accountUserEntityId,
  accountEntityId,
  handleAccountChange,
  handleAccountUserChange,
}) => {
  const [findMethod, setFindMethod] = useState(Method.userName);

  return (
    <InfoCard w="full">
      <TroubleshootInputSection showArrow>
        <H5>Which user?</H5>
        <FormLabel>Find user by</FormLabel>
        <RadioGroup
          defaultValue={findMethod}
          onChange={
            setFindMethod as React.Dispatch<React.SetStateAction<string>>
          }
        >
          <Radio value={Method.userName} label="Account and name" />
          <Radio value={Method.userEmail} label="Email" />
          <Radio value={Method.userExternalId} label="User ID" />
        </RadioGroup>
        {findMethod === Method.userName ? (
          <>
            <FormLabel mt="4">Account</FormLabel>
            <AccountSelect
              value={accountEntityId}
              onChange={handleAccountChange(true)}
              placeholder="Select account"
              queryField="name"
            />
            <FormLabel mt="4">User's name</FormLabel>
            <AccountUserSelect
              key={accountEntityId ?? ''}
              value={accountEntityId ? accountUserEntityId : undefined}
              isDisabled={!accountEntityId}
              filterEntityId={accountEntityId}
              onChange={handleAccountUserChange(false)}
              placeholder="Select user"
              queryField="fullName"
              autoSelect
            />
          </>
        ) : (
          <Box key={findMethod}>
            <FormLabel mt="4">
              User's {findMethod === Method.userEmail ? 'email' : 'ID'}
            </FormLabel>
            <AccountUserSelect
              value={accountUserEntityId}
              onChange={handleAccountUserChange(true)}
              placeholder="Select user"
              queryField={
                findMethod === Method.userEmail ? 'email' : 'externalId'
              }
              selectFormat={(base, e) =>
                `${base} (${e.account?.name || 'Unknown account'})`
              }
            />
            <FormLabel mt="4">Account</FormLabel>
            <AccountSelect
              key={accountUserEntityId ?? ''}
              value={accountUserEntityId ? accountEntityId : undefined}
              onChange={handleAccountChange(false)}
              filterEntityId={accountUserEntityId}
              placeholder="Select account"
              queryField="name"
              isDisabled
              autoSelect
            />
          </Box>
        )}
      </TroubleshootInputSection>
    </InfoCard>
  );
};

export default TroubleshootUserSelection;
