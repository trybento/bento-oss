import { AlignmentEnum, FillEnum } from '.';
import { VideoSourceType } from './slate';

export enum MediaType {
  image = 'image',
  video = 'video',
  numberAttribute = 'number_attribute',
}

export type ImageMediaMeta = {
  naturalWidth?: number;
  naturalHeight?: number;
};

export type VideoMediaMeta = {
  videoId: string;
  videoType: VideoSourceType;
};

export type NumberAttributeMediaMeta = {
  type?: string;
};

export type MediaMeta =
  | ImageMediaMeta
  | VideoMediaMeta
  | NumberAttributeMediaMeta;

export enum MediaReferenceType {
  stepPrototype = 'step_prototype',
}

export type BaseMediaReferenceSettings = {
  alignment?: AlignmentEnum;
};

export type ImageMediaReferenceSettings = {
  fill?: FillEnum;
  hyperlink?: string | null;
  lightboxDisabled?: boolean;
} & BaseMediaReferenceSettings;

export type VideoMediaReferenceSettings = {
  playsInline?: boolean;
} & BaseMediaReferenceSettings;

export type NumberAttributeMediaReferenceSettings = {
  color?: string;
  size?: number;
} & BaseMediaReferenceSettings;

export type MediaReferenceSettings =
  | ImageMediaReferenceSettings
  | VideoMediaReferenceSettings
  | NumberAttributeMediaReferenceSettings;

export type Media = {
  type: MediaType;
  url: string;
  meta: MediaMeta;
};

/**
 * Meant to be used in mutations.
 * For previews, make sure that needed fields
 * align with MediaReference in
 * apps\common\types\globalShoyuState.ts
 */
export type MediaReferenceInput = {
  entityId?: string;
  media: Media;
  settings: MediaReferenceSettings;
};
