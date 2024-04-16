import {
  AnswerNpsSurveyInput,
  AnswerNpsSurveyPayload,
} from './../../../graphql/schema.types';
import { AnswerNpsSurveyMutationDocument } from '../../../graphql/mutations/generated/AnswerNpsSurvey';
import mutatorFactory from './factory';

const answerNpsSurvey = mutatorFactory<
  AnswerNpsSurveyInput,
  AnswerNpsSurveyPayload
>('answerNpsSurvey', AnswerNpsSurveyMutationDocument);

export default answerNpsSurvey;
