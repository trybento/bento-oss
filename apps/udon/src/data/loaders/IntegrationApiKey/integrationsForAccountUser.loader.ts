import DataLoader from 'dataloader';
import unzip from 'lodash/unzip';
import { IntegrationState } from 'bento-common/types/integrations';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { Loaders } from '..';
import { IntegrationApiKey } from 'src/data/models/IntegrationApiKey.model';

const integrationsForAccountUserLoader = (_loaders: Loaders) =>
  new DataLoader<AccountUser, IntegrationApiKey<unknown>[], number>(
    async (accountUsers) => {
      // extract pertinent data from the account users
      const [_accountIds, _accountUserIds, organizationIds] = unzip(
        accountUsers.map((au) => [au.accountId, au.id, au.organizationId])
      );

      const integrations = await IntegrationApiKey.scope(
        IntegrationState.Active
      ).findAll({
        where: {
          organizationId: organizationIds,
        },
      });

      const integrationsByOrgId = organizationIds.map((oid) =>
        integrations.filter((ai) => ai.organizationId === oid)
      );

      /**
       * Note: Integration targeting was removed from here.
       *
       * In the future, use GroupTargetingSegment format and associated helpers
       *   to rebuild so we don't manage separate systems, and don't have to
       *   convert back and forth.
       *
       * Especially important when considering support for "extra" attributes
       *   so we can use the same set of helpers to punt or determine rules.
       */

      // Check if any integrations have specific targeting
      // if (
      //   integrationsByOrgId.some((integrations) =>
      //     integrations.some(
      //       (integration) =>
      //         integration.targeting.account.type ===
      //           TargetingType.attributeRules ||
      //         integration.targeting.accountUser.type ===
      //           TargetingType.attributeRules
      //     )
      //   )
      // ) {
      // 	//
      // }

      return integrationsByOrgId.map((integrations) =>
        Array.isArray(integrations) ? integrations : []
      );
    },
    { cacheKeyFn: (au) => au.id }
  );

export default integrationsForAccountUserLoader;
