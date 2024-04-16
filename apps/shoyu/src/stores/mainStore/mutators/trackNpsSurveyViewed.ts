import {
  TrackNpsSurveyViewedInput,
  TrackNpsSurveyViewedPayload,
} from './../../../graphql/schema.types';
import { TrackNpsSurveyViewedDocument } from '../../../graphql/mutations/generated/TrackNpsSurveyViewed';
import mutatorFactory from './factory';

const trackNpsSurveyViewed = mutatorFactory<
  TrackNpsSurveyViewedInput,
  TrackNpsSurveyViewedPayload
>('trackNpsSurveyViewed', TrackNpsSurveyViewedDocument);

export default trackNpsSurveyViewed;
