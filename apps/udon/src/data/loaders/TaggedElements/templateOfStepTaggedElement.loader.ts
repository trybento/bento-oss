import Dataloader from 'dataloader';
import { Op, Sequelize } from 'sequelize';
import { AtLeast } from 'bento-common/types';

import { Template } from 'src/data/models/Template.model';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { groupLoad } from '../helpers';
import { Loaders } from '..';

export default function templateOfTaggedElementLoader(loaders: Loaders) {
  return new Dataloader<number, Template | null>(
    //
    async (stepTagIds) => {
      const rows = (await StepTaggedElement.scope('active').findAll({
        attributes: [
          'id',
          [
            Sequelize.col('stepPrototypeTaggedElement->template.id'),
            'templateId',
          ],
        ],
        where: {
          id: {
            [Op.in]: stepTagIds,
          },
        },
        include: [
          {
            model: StepPrototypeTaggedElement,
            attributes: [],
            required: true,
            include: [
              {
                model: Template,
                attributes: ['id'],
                required: true,
              },
            ],
          },
        ],
      })) as Array<AtLeast<StepTaggedElement, 'id'> & { templateId: number }>;

      return groupLoad(
        stepTagIds,
        rows,
        'id',
        (row) => row.getDataValue!('templateId'),
        loaders.templateLoader
      );
    }
  );
}
