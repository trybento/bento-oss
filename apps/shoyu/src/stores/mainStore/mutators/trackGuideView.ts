import {
  TrackGuideViewInput,
  TrackGuideViewPayload,
} from './../../../graphql/schema.types';
import { TrackGuideViewMutationDocument } from '../../../graphql/mutations/generated/TrackGuideView';
import mutatorFactory from './factory';

const trackGuideView = mutatorFactory<
  TrackGuideViewInput,
  TrackGuideViewPayload
>('trackGuideView', TrackGuideViewMutationDocument);
export default trackGuideView;
