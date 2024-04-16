import { CreationAttributes, Op } from 'sequelize';
import { groupBy, isEqual } from 'lodash';

import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { getInputMutableFields, INPUT_FIELDS_MUTABLE_FIELDS } from './helpers';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type Args = {
  guideStepBases: GuideStepBase[];
};

/** Create inputs of a guide base step */
export async function createGuideBaseStepInputs({
  guideStepBases,
}: Args): Promise<void> {
  return withSentrySpan(
    async () => {
      if (guideStepBases.length === 0) return;

      const inputPrototypes = await InputStepPrototype.findAll({
        where: {
          stepPrototypeId: guideStepBases.map(
            (gsb) => gsb.createdFromStepPrototypeId!
          ),
        },
      });

      const inputPrototypesByStepPrototypeId = groupBy(
        inputPrototypes,
        'stepPrototypeId'
      );

      const existingBases = await InputStepBase.findAll({
        where: {
          guideStepBaseId: guideStepBases.map((gsb) => gsb.id),
          createdFromInputStepPrototypeId: {
            [Op.ne]: null,
          },
        },
      });

      const inputBasesByGuideStepBaseId = groupBy(
        existingBases,
        'guideStepBaseId'
      );

      const bulkUpsertData = guideStepBases.reduce<
        CreationAttributes<InputStepBase>[]
      >((acc, gsb) => {
        const prototypes =
          inputPrototypesByStepPrototypeId[gsb.createdFromStepPrototypeId!] ||
          [];

        prototypes.forEach((inputPrototype) => {
          const existingBase = inputBasesByGuideStepBaseId[gsb.id]?.find(
            (ib) => ib.createdFromInputStepPrototypeId === inputPrototype.id
          );

          // Only upsert if new instance or fields have changed
          if (
            !existingBase ||
            !isEqual(
              getInputMutableFields(inputPrototype),
              getInputMutableFields(existingBase)
            )
          ) {
            acc.push({
              id: existingBase?.id,
              guideStepBaseId: gsb.id,
              organizationId: gsb.organizationId,
              createdFromInputStepPrototypeId: inputPrototype.id,
              ...getInputMutableFields(inputPrototype),
            });
          }
        });

        return acc;
      }, []);

      await InputStepBase.bulkCreate(bulkUpsertData, {
        updateOnDuplicate: INPUT_FIELDS_MUTABLE_FIELDS,
      });
    },

    {
      name: 'createGuideBaseStepInputs',
    }
  );
}
