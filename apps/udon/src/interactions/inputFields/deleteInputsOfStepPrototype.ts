import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { withTransaction } from 'src/data';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { InputStepBase } from 'src/data/models/inputStepBase.model';

/**
 * Destroy all inputs prototypes and bases of a Step Prototype,
 * returning the total number of destroyed items.
 */
const deleteInputsOfStepPrototype = async (
  stepPrototype: StepPrototype
): Promise<number> => {
  return withTransaction(async () => {
    let destroyed = 0;

    const prototypes = await InputStepPrototype.findAll({
      where: {
        stepPrototypeId: stepPrototype.id,
      },
    });

    if (prototypes.length) {
      const prototypeIds = prototypes.map((prototype) => prototype.id);

      // destroy all bases
      destroyed += await InputStepBase.destroy({
        where: {
          createdFromInputStepPrototypeId: prototypeIds,
        },
      });

      // destroy all prototypes
      destroyed += await InputStepPrototype.destroy({
        where: {
          id: prototypeIds,
        },
      });
    }

    return destroyed;
  });
};

export default deleteInputsOfStepPrototype;
