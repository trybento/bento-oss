import React from 'react';
import { Text as SlateText, BaseElement } from 'slate';
import {
  AlignmentEnum,
  AttributeValueType,
  FillEnum,
  MediaOrientation,
  StepCtaSettings,
  StepCtaStyle,
  Theme,
  VerticalAlignmentEnum,
} from 'bento-common/types';

interface SlateElementBase extends BaseElement {
  children: SlateBodyElement[];
  alignment?: AlignmentEnum;
  fill?: FillEnum;
  id?: string;
}

/** Slate Elements expanded to include the custom attributes */
export interface EditorNode extends BaseElement {
  id?: string;
  type?: ElementType;
  text?: string;
  children: EditorNode[] | TextNode[];

  /** Indicates node can be overwritten. */
  template?: boolean;

  /** Send by server on new CYOA guides */
  placeholder?: string;
}

export type SlateBodyElement =
  | CodeBlockElement
  | BlockQuoteElement
  | BulletedListElement
  | ButtonElement
  | HTMLElement
  | ImageElement
  | LinkElement
  | ListItemElement
  | NumberedListElement
  | ParagraphElement
  | OptionElement
  | SelectElement
  | InputElement
  | LoomVideoElement
  | CalloutElement
  | YoutubeVideoElement
  | WistiaVideoElement
  | VidyardVideoElement
  | DynamicAttributeBlockElement
  | VimeoVideoElement
  | DynamicAttributeElement
  | EmbedLinkElement
  | DividerElement
  | TextNode;

export type FormattingType = ElementType | Mark | 'videos';
export type ElementTypesMap = {
  [key in Exclude<FormattingType, undefined>]?: boolean;
};

export interface ParagraphElement extends SlateElementBase {
  type: 'paragraph';
}

export interface BulletedListElement extends SlateElementBase {
  type: 'bulleted-list';
  children: ListItemElement[];
}

export interface NumberedListElement extends SlateElementBase {
  type: 'numbered-list';
  children: ListItemElement[];
}

export interface ListItemElement extends SlateElementBase {
  type: 'list-item';
}

export interface BlockQuoteElement extends SlateElementBase {
  type: 'block-quote';
}

export interface CalloutElement extends SlateElementBase {
  type: 'callout';
  calloutType: CalloutTypes;
}

export interface DividerElement extends SlateElementBase {
  type: 'divider';
}

export interface CodeBlockElement extends SlateElementBase {
  type: 'code-block';
}

interface LinkBaseElement extends SlateElementBase {
  url: string;
}

export interface LinkElement extends LinkBaseElement {
  type: 'link';
}

interface EmbedLinkBaseElement extends LinkBaseElement {
  type: 'embed-link';
  style: EmbedLinkStyle;
  buttonOptions?: {
    text: string;
    style: StepCtaStyle;
    settings: StepCtaSettings;
  };
}

export enum EmbedLinkStyle {
  link = 'link',
  inline = 'inline',
  button = 'button',
}

export interface CalendlyEmbedElement extends EmbedLinkBaseElement {
  source: 'calendly';
}

export type EmbedLinkElement = CalendlyEmbedElement;
export type EmbedLinkElementSources = EmbedLinkElement['source'];
export type EmbedLinkElementOptions<S extends EmbedLinkElementSources> = Omit<
  Extract<EmbedLinkElement, { source: S }>,
  'type' | 'url' | 'children' | 'embed' | 'source' | 'alignment' | 'fill'
>;

export interface ButtonElement extends SlateElementBase {
  type: 'button';
  url?: string;
  buttonText: string;
  clickMessage?: string;
  shouldCollapseSidebar?: boolean;
  style?: StepCtaStyle;
  settings?: StepCtaSettings;
}

export type PerformantImageProps = {
  /** The natural image width */
  naturalWidth: number;
  /** The natural image height */
  naturalHeight: number;
  /**
   * Note: Not in use.
   *
   * URL for the low quality image placeholder (LQIP), if available
   */
  lqipUrl?: string;
};

export interface ImageElement
  extends SlateElementBase,
    Partial<PerformantImageProps> {
  type: 'image';
  url: string;
  fill?: FillEnum;
  lightboxDisabled?: boolean;
  hyperlink?: string;
}

export interface HTMLElement extends SlateElementBase {
  type: 'html';
}

export interface OptionElement extends SlateElementBase {
  type: 'option';
  value: string;
}

export interface SelectElement extends SlateElementBase {
  type: 'select';
  placeholder: string;
  attributeType: 'account' | 'account_user';
  attributeKey: string;
  valueType: 'text' | 'number' | 'boolean';
  options: { label: string; value: string }[];
  children: OptionElement[];
}

export interface InputElement extends SlateElementBase {
  type: 'input';
}

export interface VideoElementBase extends SlateElementBase {
  videoId: string;
  /** Construct URL with videoId if undefined. */
  originalSrc?: string;
  playsInline?: boolean;
}

export interface LoomVideoElement extends VideoElementBase {
  type: 'loom-video';
}

export interface YoutubeVideoElement extends VideoElementBase {
  type: 'youtube-video';
}

export interface WistiaVideoElement extends VideoElementBase {
  type: 'wistia-video';
}

export interface VidyardVideoElement extends VideoElementBase {
  type: 'vidyard-video';
}

export interface VimeoVideoElement extends VideoElementBase {
  type: 'vimeo-video';
}

export interface DynamicAttributeElement extends SlateElementBase {
  type: 'dynamic-attribute';
  originalText: string;
}

export interface DynamicAttributeBlockElement extends SlateElementBase {
  type: 'dynamic-attribute-block';
  /** Not in use but added for future cases. */
  valueType?: AttributeValueType;
  text: string;
  color?: string;
  size?: number;
}

export type VideoSourceType =
  | 'youtube'
  | 'loom'
  | 'wistia'
  | 'vidyard'
  | 'vimeo';

export type VideoElement =
  | LoomVideoElement
  | YoutubeVideoElement
  | WistiaVideoElement
  | VidyardVideoElement
  | VimeoVideoElement;

export type MediaElement = VideoElement | ImageElement;

export type ElementType = AlignmentEnum | FillEnum | SlateBodyElement['type'];

export type CustomElementType = 'videos' | 'media';

export type ListType = 'bulleted-list' | 'numbered-list';
const LIST_TYPES = new Set<ElementType>(['bulleted-list', 'numbered-list']);

export function isListType(type: ElementType): type is ListType {
  return LIST_TYPES.has(type);
}

export interface TextNode extends SlateText, BaseElement {
  type?: 'text';
  alignment?: AlignmentEnum;
  text: string;
  bold?: boolean;
  fontSize?: number;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  h1?: boolean;
  h2?: boolean;
  color?: string;
}

export const MARKS = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  'h1',
  'h2',
  'marginless',
  'color',
] as const;
export type Mark = (typeof MARKS)[number];

export enum CalloutTypes {
  Tip = 'tip',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Themeless = 'themeless',
}

export enum ExtendedCalloutTypes {
  Branching = 'branching',
  Analytics = 'analytics',
  AccountGuide = 'accountGuide',
  UserGuide = 'userGuide',
  Customized = 'customized',
  DynamicStepGroup = 'dynamicStepGroup',
  Audience = 'audience',
  Inputs = 'inputs',
}

export type SlateRendererOptions = {
  allowExpand?: { image?: boolean };
  maxDimensions?: { image?: { height?: string | number } };
  formFactor?: string;
  theme?: Theme;
  verticalMediaAlignment?: VerticalAlignmentEnum;
  horizontalMediaAlignment?: AlignmentEnum;
  carousel?: boolean;
  mainBody?: boolean;
  allowMarginlessImages?: boolean;
  alignment?: {
    h1?: AlignmentEnum;
    h2?: AlignmentEnum;
    p?: AlignmentEnum;
    code?: AlignmentEnum;
    media?: AlignmentEnum;
  };
};

export type SlateRendererSpacingOptions = {
  firstNodeMarginTop?: number;
  forceFirstNodeMarginTop?: boolean;
  lPadding?: number;
  rPadding?: number;
  xPadding?: number;
  yPadding?: number;
};

export type SlateRendererProps = {
  node: SlateBodyElement;
  children?: (React.ReactElement | null)[];
  options?: SlateRendererOptions;
  isLast?: boolean;
  isFirst?: boolean;
};

export type SlateElementRenderer = React.FC<SlateRendererProps> | null;

export type ExtractedNodes = Partial<
  Record<
    Exclude<ElementType | CustomElementType, 'button' | undefined>,
    SlateBodyElement[]
  >
>;

export const mediaOrientationToSlateAlignment: Record<
  MediaOrientation,
  AlignmentEnum
> = {
  [MediaOrientation.Left]: AlignmentEnum.left,
  [MediaOrientation.Right]: AlignmentEnum.right,
};
