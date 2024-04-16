import { AccountUserProperties } from 'bento-common/types';
import { AccountUser } from 'src/data/models/AccountUser.model';

type Args<K extends keyof AccountUserProperties> = {
  accountUser: AccountUser;
  properties: Array<{ key: K; value: AccountUserProperties[K] }>;
};

/**
 * Checks if the requested properties are different, before applying new
 *   properties and saving.
 */
export default async function updateAccountUserProperties<
  K extends keyof AccountUserProperties
>({ accountUser, properties }: Args<K>) {
  const updatedProperties: Partial<AccountUserProperties> = {};

  properties.forEach(({ key, value }) => {
    if (accountUser.properties?.[key] !== value) updatedProperties[key] = value;
  });

  if (Object.keys(updatedProperties).length > 0)
    await accountUser.update({
      properties: {
        ...accountUser.properties,
        ...updatedProperties,
      },
    });
}
