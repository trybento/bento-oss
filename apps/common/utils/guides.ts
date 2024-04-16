import { FormEntityType } from '../types/forms';

export const isGuideBase = (formEntityType: FormEntityType) =>
  formEntityType === FormEntityType.guideBase;
