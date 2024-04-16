import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import DragAndDropProvider from 'providers/DragAndDropProvider';
import Box from 'system/Box';
import { FieldArray, useFormikContext } from 'formik';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicator from '@mui/icons-material/DragIndicator';
import SimpleCharCount from 'bento-common/components/CharCount/SimpleCharCount';
import { Flex } from '@chakra-ui/react';
import { TemplateFormValues } from 'components/Templates/Template';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import TextField from 'components/common/InputFields/TextField';
import { VideoElement } from 'bento-common/types/slate';
import { getTemplateForVideoGallery } from 'bento-common/utils/templates';
import { GuideDesignType, GuideFormFactor } from 'bento-common/types';
import { getEmptyStep } from 'utils/getEmptyStep';
import PreviewContainer from 'components/Previews/PreviewContainer';
import { BentoComponentsEnum, StepValue } from 'types';
import {
  guideBaseToGuideTransformer,
  templateToGuideTransformer,
} from 'components/Library/LibraryTemplates/LibraryTemplatePreview/preview.helpers';
import { useTemplate } from 'providers/TemplateProvider';
import {
  EDITOR_LEFT_WIDTH,
  getRootFormKey,
  isGuideBase,
} from 'helpers/constants';
import AddButton from 'components/AddButton';
import { extractVideoId } from 'bento-common/components/SlateContentRenderer/videoHelpers';
import { FormEntityType } from './types';
import PopoverTip from 'system/PopoverTip';
import colors from 'helpers/colors';
import { usePersistedGuideBase } from 'providers/PersistedGuideBaseProvider';
import get from 'lodash/get';
import { InfoCallout } from 'bento-common/components/CalloutText';
import {
  getVideoUrls,
  removeWhiteSpaces,
  videoTypeToSource,
} from 'bento-common/data/helpers';
import { videoUrlExists } from 'bento-common/frontend/videoHelpers';
import { v4 as uuidv4 } from 'uuid';
import { videoSourceToNodeType } from 'bento-common/utils/bodySlate';
import { StepPrototypeValue } from 'bento-common/types/templateData';
import ViewInAppButton from 'components/ViewInAppButton';

export interface VideoValue {
  title: string;
  url: string;
  isInvalid?: boolean;
}

export const stepToVideo = (s: StepValue | StepPrototypeValue): VideoValue => {
  const videoNode = s.bodySlate[0] as VideoElement;
  const url = videoNode.originalSrc;
  return {
    title: s.name,
    url,
    isInvalid: !!url && !videoNode.videoId,
  };
};

const videoTipMessage = {
  error: 'Please open the url in an incognito window to make sure it is valid.',
  supported: 'We support Loom, Vidyard, Vimeo, Wistia, YouTube.',
};

interface VideoGalleryFormProps {
  disabled?: boolean;
  formEntityType: FormEntityType;
}

type Video = {
  title: string;
  url: string;
};

const getRowKey = (video: Video, idx: number) =>
  `video-${video.title}-${video.url}-${idx}`;

const VideoGalleryForm: React.FC<VideoGalleryFormProps> = ({
  disabled,
  formEntityType,
}) => {
  const rootFormKey = getRootFormKey(formEntityType);
  const [brokenVideos, setBrokenVideos] = useState<boolean[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const formKey = `${rootFormKey}.modules[0].${
    isGuideBase(formEntityType) ? 'steps' : 'stepPrototypes'
  }`;
  const [previewKey, setPreviewKey] = useState<string>(uuidv4());
  const { values, setFieldValue, isSubmitting } =
    useFormikContext<TemplateFormValues>();
  // Not to be used in the guideBase form.
  const { template } = useTemplate();
  const { guideBase } = usePersistedGuideBase();

  /**
   * Regen preview to prevent new videos
   * moved to the first position from unselecting
   * the guide due to stepEntityId reconciliation.
   */
  useEffect(() => {
    if (!isSubmitting) setPreviewKey(uuidv4());
  }, [isSubmitting]);

  /**
   * TODO: Consolidate all template/guideBase
   * typing to make life easier.
   */
  const steps = get(values, formKey);
  const theme = isGuideBase(formEntityType)
    ? guideBase.theme
    : values.templateData.theme;

  const handleBeforeDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const transformedGuide = useMemo(() => {
    const guideValues = values[rootFormKey];
    return isGuideBase(formEntityType)
      ? guideBaseToGuideTransformer({
          ...(guideBase as any),
          guideModuleBases: guideValues.modules.map((m) => ({
            ...m,
            guideStepBases: m.steps,
          })),
        })
      : {
          ...templateToGuideTransformer({
            ...template,
            ...guideValues,
          } as any),
          designType: template.designType as GuideDesignType,
        };
  }, [template, guideBase, values, rootFormKey]);

  const videos: VideoValue[] = useMemo(() => {
    const parsedVideos: VideoValue[] = steps.map(stepToVideo);
    return parsedVideos.map((v, idx) => ({
      ...v,
      isInvalid: v.isInvalid || !!brokenVideos?.[idx],
    }));
  }, [steps, brokenVideos]);

  // Check for broken videos
  useEffect(() => {
    (async () => {
      setBrokenVideos(
        await Promise.all(
          steps.map(async (s) => {
            const videoNode = s.bodySlate[0] as VideoElement;
            if (!videoNode.videoId) return false;
            const urls = await getVideoUrls(
              videoNode.videoId,
              videoTypeToSource(videoNode.type)
            );
            return !(await videoUrlExists(urls.video, videoNode.videoId));
          })
        )
      );
    })();
  }, [steps]);

  const rowKeys = useMemo(() => {
    const rowKeys: string[] = [];
    videos.forEach((video, idx) => {
      rowKeys.push(getRowKey(video, idx));
    });
    return rowKeys;
  }, [videos.length, isDragging]);

  const urlChangeHandlers = useMemo(
    () =>
      Object.fromEntries(
        steps.map((_, idx) => [
          idx,
          (newUrl: string) => {
            const sanitizedUrl = removeWhiteSpaces(newUrl);
            const nodeKey = `${formKey}[${idx}].bodySlate[0]`;
            setFieldValue(`${nodeKey}.originalSrc`, sanitizedUrl);
            const [videoId, source] = extractVideoId(sanitizedUrl);
            setFieldValue(`${nodeKey}.videoId`, source ? videoId : '');
            setFieldValue(
              `${nodeKey}.type`,
              source ? videoSourceToNodeType(source) : ''
            );
          },
        ])
      ),
    [formKey, steps, setFieldValue]
  );

  return (
    <Flex flexDir="row" gridGap="10" mt="4">
      <Box minW={EDITOR_LEFT_WIDTH} flex="1">
        <FieldArray
          name={formKey}
          render={({ push, remove }) => (
            <>
              <DragAndDropProvider
                formItemsKey={formKey}
                dragEndCallback={handleDragEnd}
                onBeforeDragStart={handleBeforeDragStart}
              >
                {/* @ts-ignore */}
                <Droppable droppableId={formKey} isDropDisabled={disabled}>
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      <>
                        {videos.map((video, idx) => {
                          const showControls = videos.length > 1 && !disabled;
                          const stepKey = `${formKey}[${idx}]`;

                          return (
                            // @ts-ignore
                            <Draggable
                              // Note: keeping 'key' and 'draggableId' separate to avoid
                              // a conflict between input focus and drag logic.
                              key={rowKeys[idx]}
                              draggableId={getRowKey(video, idx)}
                              index={idx}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  className="branching-path-row"
                                  mb="1"
                                  display="flex"
                                  flexWrap="wrap"
                                  gridGap="0 24px"
                                  {...provided.draggableProps}
                                >
                                  <Box
                                    flex="1"
                                    minWidth="200px"
                                    position="relative"
                                  >
                                    {showControls && (
                                      <Box
                                        className="branching-path-drag-handle"
                                        position="absolute"
                                        left="-22px"
                                        top="32px"
                                        color="gray.600"
                                        w="24px"
                                        {...provided.dragHandleProps}
                                      >
                                        <DragIndicator />
                                      </Box>
                                    )}
                                    <TextField
                                      name={`${stepKey}.name`}
                                      label="Video title"
                                      defaultValue={video.title}
                                      disabled={disabled}
                                      placeholder="Enter video title..."
                                      fontSize="sm"
                                    />
                                    <SimpleCharCount
                                      limit={55}
                                      text={video.title}
                                      textAlign="right"
                                    />
                                  </Box>

                                  <Box flex="1" minWidth="200px">
                                    <Box
                                      display="flex"
                                      flexDir="row"
                                      flex="1"
                                      position="relative"
                                    >
                                      <TextField
                                        label={
                                          <>
                                            URL
                                            <PopoverTip
                                              iconBoxProps={{
                                                color: video.isInvalid
                                                  ? colors.error.bright
                                                  : undefined,
                                              }}
                                              withPortal
                                            >
                                              {(video.isInvalid
                                                ? videoTipMessage.error + ' '
                                                : '') +
                                                videoTipMessage.supported}
                                            </PopoverTip>
                                          </>
                                        }
                                        onChange={urlChangeHandlers[idx]}
                                        defaultValue={video.url}
                                        disabled={disabled}
                                        placeholder="https://"
                                        fontSize="sm"
                                        isInvalid={video.isInvalid}
                                      />

                                      {showControls && (
                                        <Box
                                          className="row-hoverable-btn-80"
                                          position="absolute"
                                          right="-20px"
                                          top="32px"
                                          color="gray.600"
                                          cursor="pointer"
                                          w="20px"
                                          my="auto"
                                          ml="2"
                                          onClick={() => {
                                            remove(idx);
                                          }}
                                        >
                                          <DeleteIcon />
                                        </Box>
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </>
                    </Box>
                  )}
                </Droppable>
              </DragAndDropProvider>
              {!disabled && !isGuideBase(formEntityType) && (
                <AddButton
                  onClick={() => {
                    push({
                      ...getEmptyStep(GuideFormFactor.inline, theme, {
                        bodySlate: getTemplateForVideoGallery(),
                      }),
                    });
                  }}
                  fontSize="md"
                  iconSize="lg"
                >
                  Add video
                </AddButton>
              )}
            </>
          )}
        />
        <InfoCallout mt="8">
          Ensure your URLs are video links and are public/accessible. You can
          test and play your videos right in the preview!
        </InfoCallout>
      </Box>
      <Box width="100%" maxW="1000px" display="flex" flexDir="column" gap="2">
        <Flex gap="1" flexDir="column" w="100%">
          <Flex>
            <Box fontSize="sm" fontWeight="bold" color="gray.800">
              Preview
            </Box>
            <Box ml="auto">
              <ViewInAppButton />
            </Box>
          </Flex>

          <PreviewContainer
            key={previewKey}
            component={BentoComponentsEnum.inlineContext}
            inputGuide={transformedGuide}
            formFactorStyle={values[rootFormKey].formFactorStyle}
            contextual
            previewBoxProps={{ py: 0 }}
          />
        </Flex>
      </Box>
    </Flex>
  );
};

export default withTemplateDisabled<VideoGalleryFormProps>(VideoGalleryForm);
