import { Template } from 'src/data/models/Template.model';

type Args = {
  template: Template;
};

/**
 * Marks that this template no longer needs user attention to set targeting.
 */
export default async function markTargetingSetForTemplate({ template }: Args) {
  if (template.targetingSet) return;

  const now = new Date();

  await template.update({
    targetingSet: now,
  });
}
