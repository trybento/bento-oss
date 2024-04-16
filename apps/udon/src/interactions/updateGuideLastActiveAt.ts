import { Guide } from 'src/data/models/Guide.model';

type Args = {
  guide: Guide;
};

export async function updateGuideLastActiveAt({ guide }: Args) {
  const now = new Date();

  return await guide.update({
    lastActiveAt: now,
  });
}
