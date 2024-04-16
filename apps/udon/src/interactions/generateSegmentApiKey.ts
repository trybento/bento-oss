import type { Organization } from 'src/data/models/Organization.model';
import {
  BentoApiKeyType,
  SegmentApiKey,
} from 'src/data/models/SegmentApiKey.model';

type Args = {
  organization: Organization;
  recreate?: boolean;
  type?: BentoApiKeyType;
};

export default async function generateSegmentApiKey({
  organization,
  recreate,
  type = BentoApiKeyType.api,
}: Args) {
  if (recreate) {
    await SegmentApiKey.destroy({
      where: { organizationId: organization.id, type },
    });
  }
  return SegmentApiKey.create({
    organizationId: organization.id,
    type,
  });
}
