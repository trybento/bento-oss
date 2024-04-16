import DataLoader from 'dataloader';
import { uniqBy } from 'lodash';
import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';

export enum MixinResultType {
  accountUsers = 'accountUsers',
  count = 'count',
}

type ReturnType<T extends MixinResultType> =
  T extends MixinResultType.accountUsers ? AccountUser[] : number;

/**
 * Count users that completed steps as having seen steps
 * This is a temporary stopgap set of helpers until we have pre-aggregation set up.
 * Having the helpers makes it easier to adjust until then, and target to rip out when needed
 * TODO: Replace these when tasks aggregate this data
 */
export default async function mixInCompletionStatsToViews<
  DL extends DataLoader<number, AccountUser[]>,
  K extends MixinResultType
>(
  id: number,
  loaders: Loaders,
  loader: DL,
  returnType: K
): Promise<ReturnType<K>> {
  const viewed = await loader.load(id);
  const completed = await loaders.usersCompletedAStepInGuideBaseLoader.load(id);
  const skipped = await loaders.usersSkippedAStepInGuideBaseLoader.load(id);

  const uniqueUsers = uniqBy(viewed.concat(completed).concat(skipped), 'id');

  if (returnType === MixinResultType.accountUsers) {
    return uniqueUsers as ReturnType<K>;
  } else {
    return uniqueUsers.length as ReturnType<K>;
  }
}

/** Could have probably just made the above more generic */
export async function mixInStepCompletionStatsToViews<
  DL extends DataLoader<number, AccountUser[]>,
  K extends MixinResultType
>(
  id: number,
  loaders: Loaders,
  loader: DL,
  returnType: K
): Promise<ReturnType<K>> {
  const viewed = await loader.load(id);
  const completed = await loaders.usersCompletedGuideStepBaseLoader.load(id);

  const uniqueUsers = uniqBy(viewed.concat(completed), 'id');

  if (returnType === MixinResultType.accountUsers) {
    return uniqueUsers as ReturnType<K>;
  } else {
    return uniqueUsers.length as ReturnType<K>;
  }
}
