import DataLoader from 'dataloader';
import { keyBy } from 'lodash';
import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';

const npsSurveyOfParticipantLoader = () =>
  new DataLoader<number, NpsSurvey | null>(
    async (participantIds: readonly number[]) => {
      const surveys = await NpsParticipant.scope(
        'withInstanceAndSurvey'
      ).findAll({
        where: {
          id: participantIds,
        },
      });

      const surveysByParticipantId = keyBy(surveys, 'id');

      return participantIds.map(
        (pId) => surveysByParticipantId[pId]?.instance?.survey || null
      );
    }
  );

export default npsSurveyOfParticipantLoader;
