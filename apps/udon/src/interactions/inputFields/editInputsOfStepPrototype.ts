import bluebird from 'bluebird';
import { StepInputFieldInput } from 'bento-common/types';
import { keyBy, partition, sum, omitBy, isNil, omit } from 'lodash';
import { Op } from 'sequelize';

import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { withTransaction } from 'src/data';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { getInputMutableFields } from 'src/interactions/inputFields/helpers';
import { JobType, SyncStepPrototypeInputsJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

type Args = {
  stepPrototype: StepPrototype;
  inputs: StepInputFieldInput[] | undefined;
};

const editInputsOfStepPrototype = async ({ stepPrototype, inputs }: Args) => {
  return withTransaction(async () => {
    // If there is no input, do nothing
    if (!inputs?.length) return [];

    const [inputsToUpdate, inputsToCreate] = partition(
      inputs.map((input, orderIndex) => ({
        ...{
          ...input,
          settings: omitBy(input.settings, isNil),
        },
        orderIndex,
        // preemptively adds association info (skipped by updates)
        organizationId: stepPrototype.organizationId,
        stepPrototypeId: stepPrototype.id,
      })),
      (input) => input.entityId
    );

    // object keyed by input's entityId
    const inputsToUpdateByKey = keyBy(inputsToUpdate, 'entityId');

    let prototypesToUpdate: InputStepPrototype[] = [];
    let prototypesToDelete: InputStepPrototype[] = [];
    let createdPrototypes: InputStepPrototype[] = [];

    // perform the updates
    if (inputsToUpdate.length) {
      prototypesToUpdate = await InputStepPrototype.findAll({
        where: {
          entityId: inputsToUpdate.map((input) => input.entityId!),
          stepPrototypeId: stepPrototype.id,
        },
      });

      await bluebird.all(
        prototypesToUpdate.map(async (prototype) => {
          return prototype.update(
            getInputMutableFields(inputsToUpdateByKey[prototype.entityId])
          );
        })
      );
    }

    // perform the deletions
    prototypesToDelete = await InputStepPrototype.findAll({
      where: {
        stepPrototypeId: stepPrototype.id,
        entityId: {
          [Op.not]: Object.keys(inputsToUpdateByKey),
        },
      },
    });

    if (prototypesToDelete.length) {
      await InputStepPrototype.destroy({
        where: {
          id: prototypesToDelete.map((prototype) => prototype.id),
        },
      });
    }

    // perform the creations
    createdPrototypes = await InputStepPrototype.bulkCreate(
      inputsToCreate.map((input) => omit(input, ['entityId'])),
      {
        returning: true,
      }
    );

    if (
      sum([
        prototypesToUpdate.length,
        prototypesToDelete.length,
        createdPrototypes.length,
      ]) > 0
    ) {
      const syncPayload: SyncStepPrototypeInputsJob = {
        jobType: JobType.SyncStepPrototypeInputs,
        organizationId: stepPrototype.organizationId,
        stepPrototypeId: stepPrototype.id,
        updated: prototypesToUpdate.map((prototype) => prototype.id),
        created: createdPrototypes.map((prototype) => prototype.id),
      };

      await queueJob(syncPayload);
    }

    return [...prototypesToUpdate, ...prototypesToDelete, ...createdPrototypes];
  });
};

export default editInputsOfStepPrototype;
