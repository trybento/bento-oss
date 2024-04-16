export enum CleanupTypes {
  /** General cleanup */
  general = 'general',
  /** Internal Bento data */
  internalData = 'internalData',
  /** In case other jobs missed anything */
  fallbacks = 'fallbacks',
  /** External data that is no longer relevant because source objects are gone */
  obsolete = 'obsolete',
}

export interface WeeklyCleanupPayload {
  customChunkSize?: number;
  type?: CleanupTypes;
}
