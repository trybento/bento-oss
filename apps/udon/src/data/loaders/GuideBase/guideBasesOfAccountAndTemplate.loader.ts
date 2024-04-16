import Dataloader from 'dataloader';
import { unzip } from 'lodash';

import { collateLoaderResultsBulk } from 'src/data/loaders/helpers';
import { Account } from 'src/data/models/Account.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';

export default function guideBasesOfAccountAndTemplate() {
  return new Dataloader<
    { accountId: number; templateEntityId: string },
    GuideBase[]
  >(
    async (accountTemplatePairs) => {
      const [accountIds, templateEntityIds] = unzip(
        accountTemplatePairs.map((pair) => [
          pair.accountId,
          pair.templateEntityId,
        ])
      ) as [number[], string[]];
      const guideBases = await GuideBase.findAll({
        where: { accountId: accountIds },
        include: [
          {
            model: Account.scope('notArchived'),
            required: true,
            attributes: [],
          },
          {
            model: Template,
            required: true,
            where: { entityId: templateEntityIds },
            attributes: [],
          },
        ],
      });

      return collateLoaderResultsBulk(accountIds, guideBases, 'accountId');
    },
    {
      // @ts-ignore
      cacheKeyFn: ({ accountId, templateEntityId }) =>
        `${accountId}_${templateEntityId}`,
    }
  );
}
