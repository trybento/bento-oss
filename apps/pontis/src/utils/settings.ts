import {
  EXT_ATTRIBUTE_VALUE,
  EXT_TEST_ACCOUNTS,
} from 'bento-common/utils/constants';

import { Storage } from '@plasmohq/storage';

import { ExtensionSettings } from '~types';

const settingsStorage = new Storage({
  area: 'local',
});

/** Under which key we will store the extension settings. */
const SETTINGS_KEY = 'bento-ext-settings';

/** Chrome in Prod/Staging */
export const DEFAULT_APPID = 'bc585d8e-0ede-11ed-8014-335e9bf823b2';

export const LOGIN_ORGS = [
  { appId: 'ea373a8a-5cc5-11eb-85f3-13ae2e693d25', name: 'Payday' },
  { appId: '0016238c-6010-11eb-8c72-a7c10548a5e9', name: 'Bento' },
  { appId: 'ab8e7246-b4de-11eb-ba08-fb65b5e4b858', name: 'Bugfix Org' },
];

type LoginAccountOption = {
  accountId: string;
  accountName: string;
  accountUserId: string;
  accountUserFullname: string;
  accountUserEmail: string;
};

const dummyUsers = [
  { initial: 'rn', fullName: 'Rae Niya' },
  { initial: 'ac', fullName: 'Andi Chen' },
  { initial: 'aj', fullName: 'Angela Jones' },
  { initial: 'ks', fullName: 'Kat Saint' },
];

const getTestAccount = (accountName: string, i: number) => ({
  accountId: `bentoTest-${i}`,
  accountName: accountName,
  accountUserId: `${
    dummyUsers[Math.min(i, dummyUsers.length - 1)].initial
  }-bt-ext-${i}`,
  accountUserFullname: dummyUsers[Math.min(i, dummyUsers.length - 1)].fullName,
  accountUserEmail: `${
    dummyUsers[Math.min(i, dummyUsers.length - 1)].initial
  }@bentotest-${i}.fake.co.fake`,
});

/** Hardcoded account/user options to select from */
export const LOGIN_ACCOUNTS: LoginAccountOption[] =
  EXT_TEST_ACCOUNTS.map(getTestAccount);

/** Account id that will not send extension attribute */
export const SIM_ACCOUNT_ID = '';

/**
 * Returns the bentoSettings for the extension.
 *
 * @todo bring settings from the options page
 */
export async function getSettings(): Promise<ExtensionSettings> {
  const settings = await settingsStorage.get<ExtensionSettings>(SETTINGS_KEY);

  if (settings && settings.bentoSettings) return settings;

  const firstDefault = LOGIN_ACCOUNTS[0];

  return {
    bentoSettings: {
      chromeExtension: true,
      appId: DEFAULT_APPID,
      account: {
        id: firstDefault.accountId,
        name: firstDefault.accountName,
        createdAt: '2021-10-21T12:00:00.000Z',
        bentoExtension: EXT_ATTRIBUTE_VALUE,
      },
      accountUser: {
        id: firstDefault.accountUserId,
        email: firstDefault.accountUserEmail,
        fullName: firstDefault.accountUserFullname,
        createdAt: '2021-10-21T12:00:00.000Z',
      },
    },
  };
}

export async function setAppId(newAppId: string) {
  const newSettings = await getSettings();
  newSettings.bentoSettings.appId = newAppId;
  await settingsStorage.set(SETTINGS_KEY, newSettings);
}

/** Persist bento setting options to chrome storage */
export async function saveBentoSettings(
  bentoSettings: ExtensionSettings['bentoSettings'],
) {
  const currSettings = await getSettings();
  const newSettings = { ...currSettings, bentoSettings };
  await settingsStorage.set(SETTINGS_KEY, newSettings);
}
