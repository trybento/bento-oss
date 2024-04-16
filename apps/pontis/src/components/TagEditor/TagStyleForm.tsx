import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  InputProps,
  RadioGroup,
  Switch,
} from '@chakra-ui/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SimpleCharCount from 'bento-common/components/CharCount/SimpleCharCount';
import ColorField from 'bento-common/components/ColorField';
import Select from 'bento-common/components/Select';
import Text from 'bento-common/components/Text';
import Tooltip from 'bento-common/components/Tooltip';
import usePrevious from 'bento-common/hooks/usePrevious';
import {
  TagEditorData,
  VisualTagHighlightSettings,
  VisualTagHighlightType,
  VisualTagPulseLevel,
  VisualTagStyleSettings,
} from 'bento-common/types';
import {
  ContextTagAlignment,
  ContextTagTooltipAlignment,
  ContextTagType,
} from 'bento-common/types/globalShoyuState';
import { DEFAULT_TAG_TEXT } from 'bento-common/utils/constants';
import { patchObject } from 'bento-common/utils/objects';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useSession } from '~src/providers/VisualBuilderSessionProvider';

import PreviewTag from '../Previews/PreviewTag';
import TextField from '../system/InputFields/TextField';
import NumberInput from '../system/NumberInput';
import Radio from '../system/Radio';
import { pickTagDataFromEditorState } from './constants';

export const tagTypeOptions = [
  ContextTagType.dot,
  ContextTagType.icon,
  ContextTagType.badge,
  ContextTagType.badgeDot,
  ContextTagType.badgeIcon,
].map((type) => ({
  label: type.split('_').map(capitalizeFirstLetter).join(' '),
  value: type,
}));
const alignmentOptions = Object.values(ContextTagAlignment).map(
  (alignment) => ({
    label: alignment.split('_').map(capitalizeFirstLetter).join(' '),
    value: alignment,
  }),
);
const tooltipAlignmentOptions = Object.values(ContextTagTooltipAlignment).map(
  (alignment) => ({
    label: capitalizeFirstLetter(alignment),
    value: alignment,
  }),
);
const highlightTypeOptions = [
  {
    value: VisualTagHighlightType.solid,
    label: 'Solid',
    type: ContextTagType.highlight,
    style: { type: VisualTagHighlightType.solid, radius: 5 },
  },
  {
    value: VisualTagHighlightType.halo,
    label: 'Halo',
    type: ContextTagType.highlight,
    style: { type: VisualTagHighlightType.halo, radius: 3 },
  },
  {
    value: VisualTagHighlightType.overlay,
    label: 'Overlay',
    type: ContextTagType.highlight,
    style: { type: VisualTagHighlightType.overlay, radius: 5 },
  },
];

const defaultHighlighStyle: VisualTagHighlightSettings = {
  type: VisualTagHighlightType.overlay,
  color: '#000000',
  pulse: false,
  radius: 4,
  padding: 2,
  thickness: 4,
  opacity: 0.2,
};

const colorInputProps: InputProps = {
  backgroundColor: 'white',
};

const opacityTransformers: React.ComponentProps<
  typeof NumberInput
>['transformValue'] = {
  parse: (v) => Number(v) / 100.0,
  format: (v) => `${Math.round(Number(v) * 100)}`,
};

const invertTransformers: React.ComponentProps<
  typeof NumberInput
>['transformValue'] = {
  parse: (v) => Number(v) * -1,
  format: (v) => `${Number(v) * -1}`,
};

const formatTagTypeLabelFactory =
  (props: Omit<React.ComponentProps<typeof PreviewTag>, 'type'>) =>
  ({ value, label, ...opts }) => (
    <Flex gap={2} alignItems="center" pl={2}>
      <PreviewTag
        type={value}
        borderRadius={8}
        {...props}
        {...opts}
        style={{
          ...defaultHighlighStyle,
          ...(props.style || {}),
          ...(opts.style || {}),
          text: DEFAULT_TAG_TEXT,
        }}
        animate={false}
      />
      {label}
    </Flex>
  );

const TagStyleForm: React.FC = () => {
  const { uiSettings, progressData, setProgressData, attributes } =
    useSession<TagEditorData>();

  const tag = useMemo(
    () => progressData.data.taggedElement,
    [progressData.data],
  );

  const [tagType, setTagType] = useState<ContextTagType>(
    tag.type || ContextTagType.dot,
  );

  const [tagAlignment, setTagAlignment] = useState<ContextTagAlignment>(
    tag.alignment || ContextTagAlignment.topRight,
  );

  const [tagTooltipAlignment, setTagTooltipAlignment] =
    useState<ContextTagTooltipAlignment>(
      tag.tooltipAlignment || ContextTagTooltipAlignment.right,
    );

  const [renderedAlignment, setRenderedAlignment] = useState<
    ContextTagTooltipAlignment | undefined
  >();

  const supportsText = useMemo(
    () =>
      [
        ContextTagType.badge,
        ContextTagType.badgeDot,
        ContextTagType.badgeIcon,
      ].includes(tagType),
    [tagType],
  );

  const [xOffset, setTagXOffset] = useState<number>(tag.xOffset);
  const [yOffset, setTagYOffset] = useState<number>(tag.yOffset);

  const [style, setStyle] = useState<VisualTagStyleSettings>(tag.style);

  const prevStyle = usePrevious(style);

  const currentTag = useMemo(
    () => ({
      ...tag,
      type: tagType,
      alignment: tagAlignment,
      tooltipAlignment: tagTooltipAlignment,
      xOffset,
      yOffset,
      style,
    }),
    [tagType, tagAlignment, tagTooltipAlignment, xOffset, yOffset, style],
  );

  useEffect(() => {
    setProgressData((prev) => {
      const data = progressData.data;

      data.taggedElement = currentTag;
      data.allTaggedElements.some((tag) => {
        const match = tag.step === data.taggedElement.step;

        if (match) {
          patchObject(tag, pickTagDataFromEditorState(progressData));
        }

        return match;
      });

      return {
        ...prev,
        data,
      };
    });
  }, [currentTag]);

  useEffect(() => {
    if (supportsText && !style?.text) {
      styleChangeHandlers['text'](DEFAULT_TAG_TEXT);
    }
  }, [supportsText]);

  const handleSetTagType = useCallback((opt) => {
    setTagType(opt.value);
  }, []);

  const handleSetTagAlignment = useCallback((opt) => {
    setTagAlignment(opt.value);
  }, []);

  const handleSetXOffset = useCallback((offset: number) => {
    setTagXOffset(offset);
  }, []);

  const handleSetYOffset = useCallback((offset: number) => {
    setTagYOffset(offset);
  }, []);

  const handleSetTooltipAlignment = useCallback((opt) => {
    setTagTooltipAlignment(opt.value);
    setRenderedAlignment(undefined);
  }, []);

  const handleSetStyleSetting = useCallback(
    (field, value) =>
      setStyle((currentStyle) => ({ ...currentStyle, [field]: value })),
    [],
  );

  const styleChangeHandlers = useMemo(
    () =>
      Object.fromEntries(
        (
          [
            'type',
            'pulse',
            'color',
            'thickness',
            'overlay',
            'padding',
            'radius',
            'opacity',
            'text',
          ] as (keyof VisualTagStyleSettings)[]
        ).map((key) => [
          key,
          (value: VisualTagStyleSettings[typeof key]) =>
            handleSetStyleSetting(key, value),
        ]),
      ) as {
        [k in keyof VisualTagStyleSettings]: (
          v: VisualTagStyleSettings[k],
        ) => void;
      },
    [handleSetStyleSetting],
  );

  useEffect(() => {
    if (style && prevStyle && style.type !== prevStyle.type) {
      styleChangeHandlers['color'](
        style.type === VisualTagHighlightType.overlay
          ? uiSettings.modalsStyle.backgroundOverlayColor
          : uiSettings.tagPrimaryColor,
      );
    }
  }, [style?.type, styleChangeHandlers]);

  const formatTagTypeOptionLabel = useCallback(
    formatTagTypeLabelFactory({
      primaryColor: uiSettings.tagPrimaryColor,
      customIconUrl: uiSettings.tagCustomIconUrl,
      textColor: uiSettings.tagTextColor,
      tagPulseLevel: uiSettings.tagPulseLevel as unknown as VisualTagPulseLevel,
      style: {
        color: style?.color || uiSettings.tagPrimaryColor,
        radius: 5,
        padding: 0,
        thickness: 4,
        opacity: 0.2,
        text: style?.text,
      } as VisualTagHighlightSettings,
    }),
    [uiSettings, style],
  );

  const handleTagOrHighlighChange = useCallback(() => {
    if (tagType === ContextTagType.highlight) {
      handleSetTagType({ value: ContextTagType.dot });
      setStyle(null);
    } else {
      setStyle({
        ...defaultHighlighStyle,
        opacity: uiSettings.modalsStyle.backgroundOverlayOpacity / 100.0,
      });
      handleSetTagType({ value: ContextTagType.highlight });
    }
  }, [tagType]);

  const handlePulseChange = useCallback(
    () => styleChangeHandlers['pulse'](!style?.pulse),
    [style?.pulse],
  );

  const onTooltipMessage = useCallback(
    ({ data: { action, payload } }: MessageEvent) => {
      if (action === 'tooltipPositionUpdated') {
        setRenderedAlignment(payload.alignment);
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener('message', onTooltipMessage);

    return () => {
      window.removeEventListener('message', onTooltipMessage);
    };
  }, []);

  return (
    <Formik initialValues={{}} onSubmit={null}>
      <Flex flexDirection="column" gap="4">
        <FormControl>
          <FormLabel>Anchor type</FormLabel>
          <RadioGroup
            name="tagOrHighlight"
            value={tagType === ContextTagType.highlight ? '0' : '1'}
            onChange={handleTagOrHighlighChange}>
            <Radio label="Visual Tag" value="1" />
            <Radio label="Highlight element" value="0" />
          </RadioGroup>
        </FormControl>
        <Flex
          bg="gray.50"
          p="2"
          borderRadius="base"
          flexDirection="column"
          gap="2">
          {tagType === ContextTagType.highlight && style ? (
            <>
              <Flex gap={2}>
                <FormControl flex={1}>
                  <FormLabel variant="secondary">Style</FormLabel>
                  <Select
                    options={highlightTypeOptions}
                    value={highlightTypeOptions.find(
                      (opt) => opt.value === style.type,
                    )}
                    onChange={({ value }) => styleChangeHandlers['type'](value)}
                    formatOptionLabel={formatTagTypeOptionLabel}
                    isSearchable={false}
                  />
                </FormControl>
                <Box flex={1}>
                  <ColorField
                    name="highlightColor"
                    defaultValue={style.color}
                    onChange={styleChangeHandlers['color']}
                    label="Color"
                    labelVariant="secondary"
                    inputProps={colorInputProps}
                    allowTransparent
                  />
                </Box>
              </Flex>
              <Flex gap={2}>
                <FormControl flex={1}>
                  {style.type === VisualTagHighlightType.overlay ? (
                    <>
                      <FormLabel variant="secondary">Opacity (%)</FormLabel>
                      <NumberInput
                        inputMode="numeric"
                        onChange={styleChangeHandlers['opacity']}
                        value={style.opacity}
                        transformValue={opacityTransformers}
                        neverEmpty
                        minimalist
                      />
                    </>
                  ) : (
                    <>
                      <FormLabel variant="secondary">Thickness</FormLabel>
                      <NumberInput
                        inputMode="numeric"
                        onChange={styleChangeHandlers['thickness']}
                        value={style.thickness}
                        neverEmpty
                        minimalist
                      />
                    </>
                  )}
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel variant="secondary">
                    Distance from element
                  </FormLabel>
                  <NumberInput
                    inputMode="numeric"
                    onChange={styleChangeHandlers['padding']}
                    value={style.padding}
                    neverEmpty
                    minimalist
                  />
                </FormControl>
              </Flex>
              <Flex gap={2}>
                <FormControl flex={1}>
                  <FormLabel variant="secondary">Corner radius</FormLabel>
                  <NumberInput
                    inputMode="numeric"
                    onChange={styleChangeHandlers['radius']}
                    value={style.radius}
                    neverEmpty
                    minimalist
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel variant="secondary">Animate</FormLabel>
                  <Box pt={2}>
                    <Switch
                      isChecked={style.pulse}
                      onChange={handlePulseChange}
                      mr={2}
                    />
                    {style.pulse ? 'Pulse' : 'Static'}
                  </Box>
                </FormControl>
              </Flex>
            </>
          ) : (
            <>
              <Flex gap={2}>
                <FormControl flex={1}>
                  <FormLabel variant="secondary">Style</FormLabel>
                  <Select
                    options={tagTypeOptions}
                    value={tagTypeOptions.find((opt) => opt.value === tagType)}
                    onChange={handleSetTagType}
                    formatOptionLabel={formatTagTypeOptionLabel}
                    isSearchable={false}
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel variant="secondary">Position</FormLabel>
                  <Select
                    options={alignmentOptions}
                    value={alignmentOptions.find(
                      (opt) => opt.value === tagAlignment,
                    )}
                    onChange={handleSetTagAlignment}
                    menuPlacement="top"
                  />
                </FormControl>
              </Flex>
              <Flex gap={2}>
                <FormControl flex={1}>
                  <FormLabel variant="secondary">
                    Left/right offset (px)
                  </FormLabel>
                  <NumberInput
                    inputMode="numeric"
                    onChange={handleSetXOffset}
                    value={xOffset}
                    neverEmpty
                    minimalist
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel variant="secondary">Up/down offset (px)</FormLabel>
                  <NumberInput
                    inputMode="numeric"
                    onChange={handleSetYOffset}
                    value={yOffset}
                    transformValue={invertTransformers}
                    neverEmpty
                    minimalist
                  />
                </FormControl>
              </Flex>
              {supportsText && (
                <Flex flex="1" flexDir="column">
                  <FormLabel variant="secondary">Badge text</FormLabel>
                  <TextField
                    attributes={attributes}
                    variant="secondary"
                    fontSize="sm"
                    onChange={styleChangeHandlers['text']}
                    helperText={
                      <SimpleCharCount limit={15} text={style?.text} />
                    }
                    defaultValue={style?.text}
                  />
                </Flex>
              )}
            </>
          )}
        </Flex>
        <Flex gap={2} flexDirection="column">
          <FormControl>
            <FormLabel>
              <Flex gap="1" alignItems="center">
                <Box>Tooltip position</Box>
                <Tooltip
                  label="Bento will automatically adjust the tooltip to fit inside the window if needed."
                  placement="top">
                  <Icon as={InfoOutlinedIcon} boxSize="4" />
                </Tooltip>
              </Flex>
            </FormLabel>
            <Select
              options={tooltipAlignmentOptions}
              value={tooltipAlignmentOptions.find(
                (opt) => opt.value === tagTooltipAlignment,
              )}
              onChange={handleSetTooltipAlignment}
              menuPlacement="top"
              warning={
                renderedAlignment && renderedAlignment !== tagTooltipAlignment
              }
            />
          </FormControl>
          {renderedAlignment && renderedAlignment !== tagTooltipAlignment && (
            <Text color="warning.bright">
              This position can cause the tooltip to show outside of the window.
              We will automatically adjust the position to avoid this.
            </Text>
          )}
        </Flex>
      </Flex>
    </Formik>
  );
};

export default TagStyleForm;
