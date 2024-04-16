import bluebird from 'bluebird';
import { groupBy, keyBy } from 'lodash';
import { withTransaction } from 'src/data';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { getInputMutableFields } from 'src/interactions/inputFields/helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { SyncStepPrototypeInputsJob } from 'src/jobsBull/job';
import { Logger } from 'src/jobsBull/logger';

const handleJob = async (
  {
    organizationId,
    stepPrototypeId,
    updated,
    created,
  }: SyncStepPrototypeInputsJob,
  logger: Logger
) =>
  withTransaction(async () => {
    logger.debug(`[syncStepPrototypeInputs] syncing sp.id ${stepPrototypeId}`);

    if (!created.length && !updated.length) {
      logger.debug(`[syncStepPrototypeInputs] No inputs created/updated`);
      return;
    }

    const guideStepBases = await GuideStepBase.findAll({
      where: {
        organizationId,
        createdFromStepPrototypeId: stepPrototypeId,
      },
    });

    const guideStepBaseIds = guideStepBases.map(
      (guideStepBase) => guideStepBase.id
    );

    // Perform creations

    // If there are created inputs to sync to existing guide bases...
    if (created.length && guideStepBases.length) {
      const createdPrototypes = await InputStepPrototype.findAll({
        where: {
          id: created,
          organizationId,
        },
      });

      const existingBasesByGsbId = await InputStepBase.findAll({
        where: {
          organizationId,
          guideStepBaseId: guideStepBaseIds,
          createdFromInputStepPrototypeId: createdPrototypes.map((p) => p.id),
        },
      }).then((bases) => groupBy(bases, 'guideStepBaseId'));

      // create the inputs for *each* guide step base...
      await bluebird.all(
        guideStepBases.map(async (guideStepBase) => {
          const existingPrototypeIds = existingBasesByGsbId[
            guideStepBase.id
          ]?.map((input) => input.createdFromInputStepPrototypeId);

          return InputStepBase.bulkCreate(
            // dedupes any already previously created input bases
            createdPrototypes.reduce((acc, prototype) => {
              if (!existingPrototypeIds?.includes(prototype.id)) {
                acc.push({
                  organizationId,
                  guideStepBaseId: guideStepBase.id,
                  createdFromInputStepPrototypeId: prototype.id,
                  ...(getInputMutableFields(
                    prototype
                  ) as Partial<InputStepBase>),
                });
              }
              return acc;
            }, [] as Partial<InputStepBase>[])
          );
        })
      );
    }

    // Perform updates

    const inputStepBases = await InputStepBase.findAll({
      where: {
        createdFromInputStepPrototypeId: updated,
        organizationId,
      },
    });

    // Does a quick consistency check and errors out if needed...
    if (updated.length && !inputStepBases.length && guideStepBases.length) {
      // This means some previously created inputs didn't create the input bases
      logger.debug(
        'Step prototype should have had existing input bases to update',
        { updated }
      );
    }

    // If there are updated inputs to sync to existing input bases...
    if (updated.length && inputStepBases.length) {
      const updatedPrototypes = await InputStepPrototype.findAll({
        where: {
          id: updated,
          organizationId,
        },
      });

      const keyedUpdatedPrototypes = keyBy(updatedPrototypes, 'id');

      // update the input for *each* input step base (1to1)...
      await bluebird.all(
        inputStepBases.map(async (inputStepBase) => {
          return inputStepBase.update(
            getInputMutableFields(
              keyedUpdatedPrototypes[
                inputStepBase.createdFromInputStepPrototypeId!
              ]
            )
          );
        })
      );
    }

    // Perform deletions

    // delete all orphaned input step bases...
    await InputStepBase.destroy({
      where: {
        organizationId,
        guideStepBaseId: guideStepBaseIds,
        /** they cascaded to null when the prototypes were deleted */
        createdFromInputStepPrototypeId: null,
      },
    });
  });

const handler: JobHandler<SyncStepPrototypeInputsJob> = async (job, logger) => {
  await handleJob(job.data, logger);
};

export default handler;
