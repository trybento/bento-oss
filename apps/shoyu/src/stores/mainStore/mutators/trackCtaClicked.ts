import {
  TrackCtaClickedInput,
  TrackCtaClickedPayload,
} from './../../../graphql/schema.types';
import { TrackCtaClickedMutationDocument } from '../../../graphql/mutations/generated/TrackCtaClicked';
import mutatorFactory from './factory';

const TrackCtaClicked = mutatorFactory<
  TrackCtaClickedInput,
  TrackCtaClickedPayload
>('TrackCtaClicked', TrackCtaClickedMutationDocument);
export default TrackCtaClicked;
