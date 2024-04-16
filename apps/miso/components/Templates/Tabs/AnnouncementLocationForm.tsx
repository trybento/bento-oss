import React, { useCallback } from 'react';
import { useFormikContext } from 'formik';

import { GuidePageTargetingType } from 'bento-common/types';
import PageTargeting from 'components/EditorCommon/PageTargeting';
import { TemplateFormValues } from '../Template';
import { TemplateForm } from '../EditTemplate';
import { isDesignType } from 'helpers/transformedHelpers';

interface AnnouncementLocationFormProps {
  disabled?: boolean;
  template: TemplateForm;
  currentValues: TemplateFormValues;
}

const AnnouncementLocationForm = ({
  template,
  currentValues,
  disabled,
}: AnnouncementLocationFormProps) => {
  const { setFieldValue } = useFormikContext<TemplateFormValues>();

  const isAnnouncementGuide = isDesignType.announcement(template.designType);

  const handlePageTargetingTypeChange = useCallback(
    (value) => setFieldValue(`templateData.pageTargetingType`, value),
    []
  );
  const handlePageTargetingUrlChange = useCallback(
    (value) => setFieldValue(`templateData.pageTargetingUrl`, value),
    [setFieldValue]
  );

  return isAnnouncementGuide ? (
    <PageTargeting
      pageTargetingType={template.pageTargetingType}
      pageTargetingUrl={template.pageTargetingUrl || null}
      optionsBlacklist={[GuidePageTargetingType.visualTag]}
      disabled={disabled}
      currentValues={currentValues}
      handlePageTargetingTypeChange={handlePageTargetingTypeChange}
      handlePageTargetingUrlChange={handlePageTargetingUrlChange}
    />
  ) : null;
};

export default AnnouncementLocationForm;
