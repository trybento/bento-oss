import Dataloader from 'dataloader';
import { unzip } from 'lodash';

import { AuthType } from 'src/data/models/types';
import UserAuth from 'src/data/models/UserAuth.model';

export default function userAuthLoader() {
  return new Dataloader<[number, AuthType], UserAuth | null>(
    async (userIdsAndTypes) => {
      const [userIds, types] = unzip(userIdsAndTypes) as [number[], AuthType[]];
      const userAuths = await UserAuth.findAll({
        where: { userId: userIds, type: types },
      });
      const userAuthsByUserAndType = userAuths.reduce(
        (acc, userAuth) => ({
          ...acc,
          [userAuth.userId]: {
            ...acc[userAuth.userId],
            [userAuth.type]: userAuth,
          },
        }),
        {} as Record<number, Record<AuthType, UserAuth>>
      );
      return userIdsAndTypes.map(
        ([userId, type]) => userAuthsByUserAndType[userId]?.[type] || null
      );
    },
    // @ts-ignore
    { cacheKeyFn: (key) => key.join('-') }
  );
}
