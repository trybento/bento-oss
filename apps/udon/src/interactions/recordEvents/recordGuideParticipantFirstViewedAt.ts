import { SelectedModelAttrs } from 'bento-common/types';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';

type Args = {
  guide: SelectedModelAttrs<Guide, 'id'>;
  accountUser: SelectedModelAttrs<AccountUser, 'id'>;
};

export async function recordGuideParticipantFirstViewedAt({
  guide,
  accountUser,
}: Args) {
  const now = new Date();
  const unviewedGuideParticipant = await GuideParticipant.findOne({
    where: {
      guideId: guide.id,
      accountUserId: accountUser.id,
      firstViewedAt: null,
    },
  });

  if (!unviewedGuideParticipant) return false;

  await unviewedGuideParticipant.update({
    firstViewedAt: now,
  });
  return true;
}
