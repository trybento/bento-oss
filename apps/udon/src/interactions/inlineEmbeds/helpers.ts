import { GuideDesignType, SelectedModelAttrs } from 'bento-common/types';
import { isInlineEmbed } from 'bento-common/utils/formFactor';

import { Template } from 'src/data/models/Template.model';

export const templateAllowsInlineEmbedding = (
  template: SelectedModelAttrs<Template, 'formFactor' | 'designType'>
): boolean => {
  return (
    // is inline
    isInlineEmbed(template.formFactor) &&
    // is everboarding
    template.designType === GuideDesignType.everboarding
  );
};
