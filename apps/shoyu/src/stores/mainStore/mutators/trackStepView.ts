import {
  TrackStepViewInput,
  TrackStepViewPayload,
} from './../../../graphql/schema.types';
import { TrackStepViewMutationDocument } from '../../../graphql/mutations/generated/TrackStepView';
import mutatorFactory from './factory';

const trackStepView = mutatorFactory<TrackStepViewInput, TrackStepViewPayload>(
  'trackStepView',
  TrackStepViewMutationDocument
);
export default trackStepView;
