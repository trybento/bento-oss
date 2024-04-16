import bluebird from 'bluebird';
import { keyBy } from 'lodash';
import { Op } from 'sequelize';

import { StepInputAnswer } from 'bento-common/types/globalShoyuState';

import { withTransaction } from 'src/data';
import { Step } from 'src/data/models/Step.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { InputStepAnswer } from 'src/data/models/inputStepAnswer.model';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { InputWithAnswer } from 'src/graphql/InputStep/types';
import { formatInputAnswer } from './helpers';

type Args = {
  /** The Step this answers belongs to */
  step: Step;
  /** The Account User who answered it */
  accountUser: AccountUser;
  /** The list of all answers, if any */
  answers: StepInputAnswer[] | undefined;
};

/**
 * Record all answers and return collection of inputs and answers.
 */
const recordInputAnswers = async ({
  step,
  accountUser,
  answers,
}: Args): Promise<InputWithAnswer[]> => {
  return withTransaction(async () => {
    // if there are not answers, simply do nothing
    if (!answers?.length) return [];

    const answerKeys = answers.map((answer) => answer.entityId);

    const inputStepBases = await InputStepBase.findAll({
      where: {
        entityId: answerKeys,
      },
    });

    const inputStepBasesByEntityId = keyBy(inputStepBases, 'entityId');

    // perform answer updates or creations

    await bluebird.all(
      answers.map(async (answerInput) => {
        return InputStepAnswer.upsert({
          organizationId: accountUser.organizationId,
          inputStepBaseId: inputStepBasesByEntityId[answerInput.entityId]!.id,
          stepId: step.id,
          answeredByAccountUserId: accountUser.id,
          answer: answerInput.answer || null,
        });
      })
    );

    // perform deletions

    await InputStepAnswer.destroy({
      where: {
        organizationId: accountUser.organizationId,
        stepId: step.id,
        inputStepBaseId: {
          [Op.not]: inputStepBases.map((inputStepBase) => inputStepBase.id),
          [Op.ne]: null,
        },
      },
    });

    // find and return all persisted answers

    const inputStepBasesById = keyBy(inputStepBases, 'id');

    const inputsWithAnswers = await InputStepAnswer.findAll({
      where: {
        organizationId: accountUser.organizationId,
        stepId: step.id,
        inputStepBaseId: Object.keys(inputStepBasesById),
      },
    }).then((inputStepAnswers) =>
      inputStepAnswers.map((inputStepAnswer, index) => {
        return formatInputAnswer(
          inputStepBasesById[inputStepAnswer.inputStepBaseId!].label,
          inputStepAnswer.answer,
          index
        );
      })
    );

    return inputsWithAnswers;
  });
};

export default recordInputAnswers;
