import Dataloader from 'dataloader';
import { Op } from 'sequelize';

import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { Loaders } from '..';
import { groupLoad } from '../helpers';

export default function stepPrototypeTaggedElementOfStepTaggedElementLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepPrototypeTaggedElement | null>(
    //
    async (stepTagIds) => {
      const rows = await StepTaggedElement.scope('active').findAll({
        attributes: ['id', 'createdFromPrototypeId'],
        where: {
          id: {
            [Op.in]: stepTagIds,
          },
        },
      });

      return groupLoad(
        stepTagIds,
        rows,
        'id',
        'createdFromPrototypeId',
        loaders.stepPrototypeTaggedElementLoader
      );
    }
  );
}
