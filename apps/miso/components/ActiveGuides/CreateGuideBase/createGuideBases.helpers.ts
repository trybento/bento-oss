import * as CreateGuideBaseMutation from 'mutations/CreateGuideBase';
import * as LaunchGuideBaseMutation from 'mutations/LaunchGuideBase';

export const launchGuideBase = async ({
  accountEntityId,
  templateEntityId,
}: {
  accountEntityId: string;
  templateEntityId: string;
}) => {
  const mutationArgs = {
    accountEntityId,
    templateEntityId,
  };

  const response = await CreateGuideBaseMutation.commit(mutationArgs);

  const guideBaseEntityId = response.createGuideBase.guideBase.entityId;

  await LaunchGuideBaseMutation.commit({ guideBaseEntityId });

  return guideBaseEntityId;
};
