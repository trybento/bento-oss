import Dataloader from 'dataloader';

import templateHasActiveGuideBases from 'src/interactions/analytics/stats/templateHasActiveGuideBases';

/** Loads whether or not a template has any active guide bases */
export default function hasActiveGuideBasesLoader() {
  return new Dataloader<number, boolean>(async (templateIds) => {
    const rows = await templateHasActiveGuideBases(templateIds as number[]);
    return rows.map((r) => r.hasActiveGuideBases);
  });
}
