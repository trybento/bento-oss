import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { Box, Button, Flex, FormLabel, Text } from '@chakra-ui/react';
import PreviewTag from 'components/Previews/PreviewTag';
import TagEditorModal from 'components/Tags/TagEditorModal';
import { wildcardUrlToDisplayUrl } from 'bento-common/utils/wildcardUrlHelpers';
import cx from 'classnames';

import { WysiwygEditorAction } from 'components/WysiwygEditor/utils';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';
import { useTemplate } from 'providers/TemplateProvider';
import { MainFormKeys } from 'helpers/constants';
import { TagContext, VisualTagPulseLevel } from 'bento-common/types';
import {
  StepPrototypeValue,
  TemplateValue,
} from 'bento-common/types/templateData';
import { Highlight } from 'components/common/Highlight';
import colors from 'helpers/colors';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';
import ExtensionRequiredTooltip, {
  ExtensionRequiredTooltipLabel,
} from 'components/WysiwygEditor/ExtensionRequiredTooltip';
import InteractiveTooltip from 'system/InteractiveTooltip';

export interface StepPrototype {
  name: string;
  entityId: string;
  body?: string;
  bodySlate?: object[];
  templateEntityId?: string;
}

export type StepPrototypeTagContextProps =
  | {
      context: TagContext.step;
      formKey: string;
      stepPrototype: StepPrototypeValue | undefined | null;
    }
  | {
      context: TagContext.template;
      formKey?: never;
      stepPrototype?: never;
    };

type Props = {
  templateData: TemplateValue;
  disabled?: boolean;
  label?: ReactNode;
  editLabel?: ReactNode;
  setLabel?: ReactNode;
  showPreview?: boolean;
  /**
   * Whether to warn the user when the visual tag is not yet set.
   * @default false
   * @todo can compute inside?
   */
  warnWhenNotSet?: boolean;
} & StepPrototypeTagContextProps;

const StepPrototypeTag: React.FC<Props> = ({
  context,
  stepPrototype: currentStepPrototype,
  templateData,
  disabled,
  formKey: parentFormkey,
  showPreview = true,
  label,
  editLabel = 'Edit location',
  setLabel = 'Set location',
  warnWhenNotSet = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const { handleEditOrCreateTag } = useTemplate();
  const uiSettings = useUISettings('store-or-network');
  const extension = useChromeExtensionInstalled();

  /**
   * NOTE: We shouldn't allow adding tags to Steps that haven't been saved yet because
   * our current logic for persisting tag prototypes and spawning bases/tags does not
   * handle that case, therefore the tags will never actually launch to end-users.
   */
  const unAllowedTagCreation =
    context === TagContext.step && !currentStepPrototype?.entityId;

  const { tag, formKey, stepPrototype } = useMemo(() => {
    const isTemplateContext = context === TagContext.template;
    const templateTag = templateData?.taggedElements?.[0];
    const currentStepTag = currentStepPrototype?.taggedElements?.[0];

    return {
      tag: isTemplateContext ? templateTag : currentStepTag,
      formKey: isTemplateContext ? MainFormKeys.template : parentFormkey,
      stepPrototype: isTemplateContext ? null : currentStepPrototype,
    };
  }, [
    templateData?.taggedElements,
    currentStepPrototype?.taggedElements,
    parentFormkey,
  ]);

  const displayUrl = useMemo(
    () => (tag ? wildcardUrlToDisplayUrl(tag.wildcardUrl) : ''),
    [tag?.wildcardUrl]
  );

  const {
    tagPrimaryColor,
    tagDotSize,
    tagPulseLevel,
    tagBadgeIconBorderRadius,
    tagTextColor,
    tagBadgeIconPadding,
    tagCustomIconUrl,
  } = uiSettings || {};

  const handleEditorWindowOpened = () => {
    handleEditOrCreateTag(stepPrototype, formKey, WysiwygEditorAction.create);
  };

  const handleModalEditorOpened = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleModalEditorClosed = useCallback(() => {
    setIsEditing(false);
  }, []);

  const canShowPreview = useMemo(
    () => !!tag && showPreview,
    [tag, showPreview]
  );

  return (
    <>
      <Box>
        <Flex
          flexDir="row"
          justifyContent="space-between"
          alignItems="baseline"
          overflow="hidden"
        >
          {/* Meta */}
          <Flex
            overflow="hidden"
            className={cx({
              'flex-row gap-2': !tag,
              'flex-col gap-0': tag && canShowPreview,
              'flex-col gap-2': tag && !canShowPreview,
            })}
          >
            {label && (
              <FormLabel variant="secondary" whiteSpace="nowrap" m="0">
                {label}
              </FormLabel>
            )}
            <Flex flexDir="row" gap={2} alignItems="center" overflow="hidden">
              {tag ? (
                <>
                  {canShowPreview && (
                    <Flex
                      minW="40px"
                      flex="none"
                      h="40px"
                      alignSelf="start"
                      justifyContent="center"
                      alignItems="center"
                      gridRow="2 / span 3"
                      mt="1"
                    >
                      {uiSettings && (
                        <PreviewTag
                          type={tag.type as any}
                          primaryColor={tagPrimaryColor}
                          textColor={tagTextColor}
                          dotSize={tagDotSize}
                          tagPulseLevel={tagPulseLevel as VisualTagPulseLevel}
                          padding={tagBadgeIconPadding}
                          borderRadius={tagBadgeIconBorderRadius}
                          customIconUrl={tagCustomIconUrl}
                          style={tag.style}
                          mini
                        />
                      )}
                    </Flex>
                  )}
                  <Highlight fontSize="xs" title={displayUrl} isTruncated>
                    {displayUrl}
                  </Highlight>
                  <Highlight
                    fontSize="xs"
                    title={tag.elementSelector}
                    isTruncated
                  >
                    {tag.elementSelector}
                  </Highlight>
                </>
              ) : warnWhenNotSet ? (
                <Text fontStyle="italic" color={colors.error.text}>
                  {warnWhenNotSet ? `⚠️ Not set yet` : `None`}
                </Text>
              ) : (
                <Text fontStyle="italic">None</Text>
              )}
            </Flex>
          </Flex>

          {/* Action buttons */}
          {!disabled && (
            <Flex flexDir="row" gap={4} alignItems="center" ml={8}>
              {tag ? (
                <ExtensionRequiredTooltip isDisabled={extension.installed}>
                  <Button
                    variant="link"
                    fontSize="xs"
                    onClick={handleModalEditorOpened}
                    isDisabled={!extension.installed}
                  >
                    {editLabel}
                  </Button>
                </ExtensionRequiredTooltip>
              ) : (
                <InteractiveTooltip
                  placement="top-start"
                  label={
                    unAllowedTagCreation ? (
                      currentStepPrototype ? (
                        <span>Please save before adding a visual tag.</span>
                      ) : (
                        <span>
                          Please create and save a step before adding a visual
                          tag
                        </span>
                      )
                    ) : !extension.installed ? (
                      <ExtensionRequiredTooltipLabel />
                    ) : null
                  }
                >
                  {/* Button needs to be wrapped, otherwise the InteractiveTooltip will not show when disabled */}
                  <span>
                    <Button
                      variant="link"
                      fontSize="xs"
                      onClick={handleEditorWindowOpened}
                      isDisabled={unAllowedTagCreation || !extension.installed}
                    >
                      {setLabel}
                    </Button>
                  </span>
                </InteractiveTooltip>
              )}
            </Flex>
          )}
        </Flex>
      </Box>
      {tag && isEditing && (
        <TagEditorModal
          taggedElement={tag}
          stepPrototype={stepPrototype}
          formKey={formKey}
          isOpen={isEditing}
          onClose={handleModalEditorClosed}
        />
      )}
    </>
  );
};

export default withTemplateDisabled<Props>(StepPrototypeTag);
