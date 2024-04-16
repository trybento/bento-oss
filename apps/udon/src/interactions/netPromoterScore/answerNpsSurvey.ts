import { DataSource } from 'bento-common/types';
import { NpsFollowUpQuestionType } from 'bento-common/types/netPromoterScore';

import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { getSurveyParticipant } from 'src/graphql/embed/EmbedNpsSurvey/mutations/embedNpsSurveyMutations.helpers';
import detachPromise from 'src/utils/detachPromise';
import recordAndSetCustomAttributes from '../recordEvents/recordAndSetCustomAttributes';
import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import { withTransaction } from 'src/data';

type Args = {
  /** Which acconut user */
  accountUser: AccountUser;
  /** Which NPS survey instance */
  entityId: string;
  /** The actual answer to the NPS survey (score) */
  answer: number;
  /** The answer to the follow-up question, if any */
  fupAnswer?: string | null;
};

/**
 * Answers a NPS survey.
 *
 * @returns Promise an array containing the NpsSurvey and the NpsParticipant instances
 */
export default async function answerNpsSurvey({
  accountUser,
  entityId,
  answer,
  fupAnswer,
}: Args): Promise<
  [survey: NpsSurvey, participant: NpsParticipant] | undefined
> {
  const participant = await getSurveyParticipant({
    accountUserId: accountUser.id,
    surveyEntityId: entityId,
  });

  /**
   * If we don't have a participant, it likely means that
   * the survey has been deleted, so just ignore the answer.
   */
  if (!participant?.instance?.survey) {
    return;
  }

  if (participant.dismissedAt || participant.answeredAt)
    throw new Error('Participant already interacted');

  const { survey: npsSurvey } = participant.instance;

  /** Enforce "none" fup setting" */
  if (npsSurvey.fupType === NpsFollowUpQuestionType.none && !!fupAnswer) {
    throw new Error('Survey settings expect no follow-up answer');
  }

  await withTransaction(async () => {
    // increment the answers count
    await participant.instance!.increment('totalAnswers');

    // persist the answer
    await participant.update({
      answeredAt: new Date(),
      answer,
      fupAnswer,
    });
  });

  /* We can record async since we aren't checking for launches */
  detachPromise(
    () =>
      recordAndSetCustomAttributes({
        obj: accountUser,
        attributes: { 'NPS Score': answer },
        source: DataSource.bento,
      }),
    'Record NPS score'
  );

  return [npsSurvey, participant];
}
