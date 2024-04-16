import { add } from 'date-fns';
import { AtLeast, GuideExpirationCriteria } from 'bento-common/types';

import { Template } from 'src/data/models/Template.model';

type TemplateWithAtLeastExpirationData = AtLeast<
  Template,
  'expireBasedOn' | 'expireAfter'
>;

export const isTemplateSetToExpire = (
  template: TemplateWithAtLeastExpirationData
) => {
  return (
    template.expireBasedOn &&
    template.expireBasedOn !== GuideExpirationCriteria.never
  );
};

export const computeExpireAtBasedOnTemplate = (
  template: TemplateWithAtLeastExpirationData,
  /** The referential date according to the expiration criteria (e.g. launch or last step completed dates) */
  referentialDate: Date
) => {
  if (!isTemplateSetToExpire(template)) return null;

  return addToGuideExpirationDate(referentialDate, template.expireAfter!);
};

export const addToGuideExpirationDate = (expireAt: Date, days: number) => {
  return add(expireAt, { days });
};
