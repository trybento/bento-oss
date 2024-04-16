import { MAX_GUIDE_RESET } from 'bento-common/data/helpers';
import { SelectedModelAttrs } from 'bento-common/types';

import { Guide } from 'src/data/models/Guide.model';
import { Step } from 'src/data/models/Step.model';
import { queueCleanup } from 'src/jobsBull/jobs/cleanup/processQueuedCleanups';
import { GUIDE_DELETION_GUIDES_BATCH_SIZE } from 'src/jobsBull/jobs/guideDeletion/helpers';
import { chunkArray } from 'src/utils/helpers';

/**
 * Clean up step events and events so they won't be counted in rollups.
 * We need to pre-fetch the ids/entityIds because the objects will be deleted and we can't trace them later
 */
export default async function clearEventsForGuides({
  guides,
}: {
  guides: SelectedModelAttrs<Guide, 'id' | 'entityId'>[];
}) {
  /* Refuse to do huge load */
  if (guides.length > MAX_GUIDE_RESET) return;

  const chunkedGuides = chunkArray(guides, GUIDE_DELETION_GUIDES_BATCH_SIZE);

  /* Delete guide rollup tables entries, guide events */
  chunkedGuides.forEach((chunk) => {
    queueCleanup({
      type: 'guideRollups',
      guideIds: chunk.map((g) => g.id),
    });
    queueCleanup({
      type: 'events-guide',
      guideEntityIds: chunk.map((g) => g.entityId),
    });
  });

  /* Delete step events, events */
  const steps = await Step.findAll({
    where: { guideId: guides.map((g) => g.id) },
  });
  const chunkedStepEntityIds = chunkArray(
    steps.map((s) => s.entityId),
    GUIDE_DELETION_GUIDES_BATCH_SIZE
  );

  chunkedStepEntityIds.forEach((chunk, i) => {
    queueCleanup({ type: 'events-step', stepEntityIds: chunk });
    queueCleanup({ type: 'stepEvents', stepEntityIds: chunk });
  });
}
