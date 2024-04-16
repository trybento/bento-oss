import {
  DismissNpsSurveyInput,
  DismissNpsSurveyPayload,
} from './../../../graphql/schema.types';
import { DismissNpsSurveyMutationDocument } from '../../../graphql/mutations/generated/DismissNpsSurvey';
import mutatorFactory from './factory';

const dismissNpsSurvey = mutatorFactory<
  DismissNpsSurveyInput,
  DismissNpsSurveyPayload
>('dismissNpsSurvey', DismissNpsSurveyMutationDocument);

export default dismissNpsSurvey;
