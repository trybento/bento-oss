import { RecordTagDismissedMutationDocument } from './../../../graphql/mutations/generated/RecordTagDismissed';
import {
  RecordTagDismissedInput,
  RecordTagDismissedPayload,
} from './../../../graphql/schema.types';
import mutatorFactory from './factory';

const dismissTag = mutatorFactory<
  RecordTagDismissedInput,
  RecordTagDismissedPayload
>('dismissTag', RecordTagDismissedMutationDocument);
export default dismissTag;
