import React, { useCallback, useMemo, useRef } from 'react';
import { useFormikContext } from 'formik';
import { FormLabel } from '@chakra-ui/react';
import OpenInNew from '@mui/icons-material/OpenInNew';

import { guideNameOrFallback } from 'bento-common/utils/naming';
import { GuideShape } from 'bento-common/types/globalShoyuState';

import Box from 'system/Box';
import Select, {
  ExtendedSelectOptions,
  OptionWithSubLabel,
  SelectOptions,
  SingleValueWithIcon,
} from 'system/Select';
import { useAllTemplates } from 'providers/AllTemplatesProvider';
import {
  guideComponentIcon,
  guideComponentLabel,
} from 'helpers/presentational';
import { StepCompletionFormValues } from 'components/GuideForm/SelectedStep/StepCompletionModal';

interface GuideSelectionProps {
  disabled?: boolean;
  // determine the type
  onChange?: (arg: any) => void;
}

const GuideSelection = ({ onChange }: GuideSelectionProps) => {
  const keyRef = useRef(0);
  const { values } = useFormikContext<StepCompletionFormValues>();
  const { templates, isLoading } = useAllTemplates();

  const templateOptions = useMemo(() => {
    return templates.reduce((list, template) => {
      /** @todo replace by current template entityId */
      if (template.entityId === 0) {
        return list;
      }

      const IconElement = guideComponentIcon(template as GuideShape);
      list.push({
        Icon: <IconElement />,
        alt: guideComponentLabel(template as GuideShape),
        label: guideNameOrFallback(template.name),
        value: template.entityId,
        extra: {
          title: 'Open in new window',
          icon: OpenInNew,
          callback: () =>
            window.open(`/library/templates/${template.entityId}`, '_blank'),
        },
      });

      return list;
    }, [] as ExtendedSelectOptions[]);
  }, [templates]);

  const selectedTemplate = useMemo(() => {
    return templateOptions.find(
      (option) =>
        option.value === values.autoCompleteInteractions[0]?.templateEntityId
    );
  }, [values.autoCompleteInteractions, templateOptions]);

  const onTemplateSelected = useCallback(
    (option: SelectOptions) => void onChange?.(option),
    [onChange]
  );

  return (
    <Box key={keyRef.current}>
      <FormLabel variant="secondary">When this guide is completed</FormLabel>
      <Select
        options={templateOptions}
        defaultValue={selectedTemplate}
        isLoading={isLoading}
        onChange={onTemplateSelected}
        components={{
          Option: OptionWithSubLabel(),
          SingleValue: SingleValueWithIcon(),
        }}
      />
    </Box>
  );
};

export default GuideSelection;
