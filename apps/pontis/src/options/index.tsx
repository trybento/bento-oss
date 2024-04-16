import { EXT_ATTRIBUTE_VALUE } from 'bento-common/utils/constants';
import React, { useCallback, useEffect, useState } from 'react';
import { ExtensionSettings } from 'types';

import '~src/ui/styles/styles.css';

import {
  getSettings,
  LOGIN_ACCOUNTS,
  saveBentoSettings,
  SIM_ACCOUNT_ID,
} from '~src/utils/settings';

const OptionsPage: React.FC = () => {
  const [bentoSettings, setBentoSettings] = useState<
    ExtensionSettings['bentoSettings'] | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  /** Determine if we should write settings to store, or surface an error */
  const persistBentoSettings = useCallback(
    (newBentoSettings: ExtensionSettings['bentoSettings']) => {
      /* Validate appId */
      if (!newBentoSettings.appId || newBentoSettings.appId.length !== 36) {
        if (!errorMessage) setErrorMessage('Invalid appId');
        return;
      }

      /* No errors, unsert all */
      if (errorMessage) setErrorMessage('');

      saveBentoSettings(newBentoSettings);
    },
    [errorMessage],
  );

  const onChangeAccount = useCallback(
    async (value) => {
      if (!bentoSettings) return;

      const newBentoSettings: ExtensionSettings['bentoSettings'] = {
        ...bentoSettings,
      };

      const option = LOGIN_ACCOUNTS.find((o) => o.accountId === value);

      if (!option) return;

      newBentoSettings.account.id = option.accountId;
      newBentoSettings.account.name = option.accountName;
      newBentoSettings.accountUser.id = option.accountUserId;
      newBentoSettings.accountUser.email = option.accountUserEmail;
      newBentoSettings.accountUser.fullName = option.accountUserFullname;

      /* Special casing for a chosen account to skip sending the extension attribute */
      if (option.accountId === SIM_ACCOUNT_ID && newBentoSettings.account) {
        newBentoSettings.account.bentoExtension = 'false';
      } else if (bentoSettings.account.bentoExtension === 'false') {
        newBentoSettings.account.bentoExtension = EXT_ATTRIBUTE_VALUE;
      }

      setBentoSettings(newBentoSettings);
      persistBentoSettings(newBentoSettings);
    },
    [bentoSettings],
  );

  const onChangeAppId = useCallback(
    (e) => {
      const newAppId = e?.target?.value;

      if (!bentoSettings) return;

      const newBentoSettings: ExtensionSettings['bentoSettings'] = {
        ...bentoSettings,
        appId: newAppId.trim(),
      };

      setBentoSettings(newBentoSettings);

      persistBentoSettings(newBentoSettings);
    },
    [bentoSettings],
  );

  const getCurrentSettings = useCallback(async () => {
    const settings = await getSettings();

    setBentoSettings(settings.bentoSettings);
  }, []);

  useEffect(() => {
    getCurrentSettings();
  }, []);

  return (
    <>
      <div style={{ padding: '2em' }}>
        <div
          style={{
            backgroundColor: '#F7FAFC',
            padding: '2em',
            margin: 'auto',
            maxWidth: '50%',
          }}>
          <h1>Bento extension settings</h1>
          <div
            style={{ color: 'red', fontWeight: 'semibold', height: '0.7em' }}>
            {errorMessage}
          </div>
          <h4>AppId</h4>
          <input
            type="text"
            value={bentoSettings?.appId || ''}
            placeholder="AppId goes here"
            onChange={onChangeAppId}
            style={{ width: '50%' }}
          />

          <br />
          <h4>Sample account</h4>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {LOGIN_ACCOUNTS.map((loginOpt) => {
              const addText =
                loginOpt.accountId === SIM_ACCOUNT_ID
                  ? 'This account will not send extension attribute'
                  : '';

              return (
                <div key={loginOpt.accountId}>
                  <input
                    type="radio"
                    value={loginOpt.accountId}
                    name="loginOpt"
                    checked={bentoSettings?.account.id === loginOpt.accountId}
                    onChange={() => onChangeAccount(loginOpt.accountId)}
                  />
                  {`${loginOpt.accountName} (${loginOpt.accountUserFullname})`}
                  {addText && (
                    <span
                      style={{
                        fontSize: '10px',
                        marginLeft: '1em',
                        color: 'gray',
                      }}>{`(${addText})`}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default OptionsPage;
