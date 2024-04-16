import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { Loaders } from '..';
import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';

export default function npsParticipantsOfNpsSurveyInstanceLoader(
  _loaders: Loaders
) {
  return new Dataloader<number, NpsParticipant[]>(
    async (npsSurveyInstanceIds) => {
      const participants = await NpsParticipant.scope([
        { method: ['fromInstance', npsSurveyInstanceIds] },
      ]).findAll({
        order: [['id', 'asc']],
      });

      const participantsByInstanceId = groupBy(
        participants,
        'npsSurveyInstanceId'
      );

      return npsSurveyInstanceIds.map(
        (instanceId) => participantsByInstanceId[instanceId] || []
      );
    }
  );
}
