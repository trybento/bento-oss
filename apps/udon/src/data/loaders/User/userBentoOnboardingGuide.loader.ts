import Dataloader from 'dataloader';
import { unzip } from 'lodash';

import { Guide } from 'src/data/models/Guide.model';
import { Organization } from 'src/data/models/Organization.model';
import { fetchCurrentGuideForAccountUser } from 'src/interactions/fetchCurrentGuideForAccountUser';
import { Loaders } from '..';

export default function userBentoOnboardingGuide(loaders: Loaders) {
  return new Dataloader<
    { orgEntityId: string; userEntityId: string },
    Guide,
    string
  >(
    async (orgAndUserIds) => {
      const [orgEntityIds, userEntityIds] = unzip(
        orgAndUserIds.map((ids) => [ids.orgEntityId, ids.userEntityId])
      );
      const bentoOrg = await Organization.scope({
        method: ['withAccountsAndUsers', orgEntityIds, userEntityIds],
      }).findOne({
        where: { slug: 'bento' },
        attributes: ['id'],
      });

      if (!bentoOrg) {
        return Array(orgAndUserIds.length).fill([]);
      }

      const accountsByOrg = Object.fromEntries(
        bentoOrg.accounts.map((account) => [
          account.externalId,
          Object.fromEntries(
            account.accountUsers.map((au) => [au.externalId, au])
          ),
        ])
      );

      const guides: (Guide | null)[] = [];

      for (const { orgEntityId, userEntityId } of orgAndUserIds) {
        const { guide } = await fetchCurrentGuideForAccountUser({
          accountUser: accountsByOrg[orgEntityId][userEntityId],
          loaders,
        });
        guides.push(guide);
      }
      return guides;
    },
    {
      cacheKeyFn: ({ orgEntityId, userEntityId }) =>
        `${orgEntityId}-${userEntityId}`,
    }
  );
}
