import React, { useCallback, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { Text, Button } from '@chakra-ui/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { GuidePageTargetingType, InlineEmbedState } from 'bento-common/types';
import { WysiwygEditorAction } from './WysiwygEditor/utils';
import { useTemplate } from 'providers/TemplateProvider';
import { MainFormKeys } from 'helpers/constants';
import { TemplateFormValues } from './Templates/Template';
import InteractiveTooltip from 'system/InteractiveTooltip';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import { ExtensionRequiredTooltipLabel } from './WysiwygEditor/ExtensionRequiredTooltip';
import { useOrganizationInlineEmbed } from 'providers/OrganizationInlineEmbedProvider';

const ViewInAppButton: React.FC = () => {
  const extension = useChromeExtensionInstalled();
  const { inlineEmbed, handleEditOrCreateOrganizationInlineEmbed } =
    useOrganizationInlineEmbed();
  const { values } = useFormikContext<TemplateFormValues>();
  const {
    isTemplateContext,
    template,
    handleEditOrCreateTag,
    handleEditOrCreateInlineEmbed,
    isFlow,
    isTooltip,
    isOnboarding,
    allStepsHaveATag,
    isAnnouncement,
    isEverboarding,
  } = useTemplate();

  const handleOpenInApp = useCallback(() => {
    const step = isFlow
      ? values.templateData?.modules?.[0]?.stepPrototypes?.[0]
      : null;

    const taggedElement = (
      step ? step.taggedElements : values.templateData?.taggedElements
    )?.[0];

    if (isTooltip || isFlow) {
      const action = !taggedElement
        ? WysiwygEditorAction.create
        : WysiwygEditorAction.edit;

      handleEditOrCreateTag(step, MainFormKeys.template, action);
    } else if (
      values.templateData.pageTargetingType === GuidePageTargetingType.visualTag
    ) {
      const action = !taggedElement
        ? WysiwygEditorAction.create
        : WysiwygEditorAction.edit;

      handleEditOrCreateTag(null, MainFormKeys.template, action);
    } else if (isOnboarding) {
      handleEditOrCreateOrganizationInlineEmbed(values.templateData);
    } else {
      const inlineEmbed = values.templateData.inlineEmbed;
      const action = !inlineEmbed
        ? WysiwygEditorAction.create
        : WysiwygEditorAction.edit;

      handleEditOrCreateInlineEmbed(action);
    }
  }, [values, handleEditOrCreateOrganizationInlineEmbed]);

  const disabledReason = useMemo(() => {
    if (isFlow && !allStepsHaveATag) {
      return 'All steps require a visual tag to preview';
    }

    return null;
  }, [allStepsHaveATag, isTemplateContext]);

  if (
    !isTemplateContext ||
    isAnnouncement ||
    (isOnboarding &&
      (!inlineEmbed || inlineEmbed.state === InlineEmbedState.inactive)) ||
    (isEverboarding &&
      [
        GuidePageTargetingType.anyPage,
        GuidePageTargetingType.specificPage,
      ].includes(template.pageTargetingType as GuidePageTargetingType))
  ) {
    return null;
  }

  return (
    <InteractiveTooltip
      placement="top-start"
      label={
        !extension.installed ? (
          <ExtensionRequiredTooltipLabel />
        ) : (
          disabledReason
        )
      }
    >
      {/* Button needs to be wrapped, otherwise the InteractiveTooltip will not show when disabled */}
      <span>
        <Button
          variant="link"
          display="flex"
          size="sm"
          onClick={handleOpenInApp}
          isDisabled={!extension.installed || !!disabledReason}
        >
          <OpenInNewIcon fontSize="small" />{' '}
          <Text ml={1}>Preview in your app</Text>
        </Button>
      </span>
    </InteractiveTooltip>
  );
};

export default ViewInAppButton;
