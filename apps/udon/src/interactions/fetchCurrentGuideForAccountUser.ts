import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';

type FetchCurrentGuideForAccountUserArgs = {
  accountUser: AccountUser;
  guideEntityId?: Guide['entityId'];
  loaders: Loaders;
};

/**
 * @todo drop data loader
 */
export async function fetchCurrentGuideForAccountUser({
  accountUser,
  guideEntityId = '',
  loaders,
}: FetchCurrentGuideForAccountUserArgs) {
  const allGuides = await loaders.availableGuidesForAccountUserLoader.load(
    accountUser.id
  );
  const guide = allGuides.find((g) => g.entityId === guideEntityId);

  const incompleteGuidesCount = allGuides.reduce(
    (acc, guide) => (!guide.completedAt ? ++acc : acc),
    0
  );

  const isLastGuide =
    !allGuides[1] ||
    incompleteGuidesCount === 0 ||
    (!guide?.completedAt && incompleteGuidesCount === 1);

  return {
    guide: guide || null,
    guideParticipant: guide?.guideParticipants[0] || null,
    isLastGuide,
  };
}
