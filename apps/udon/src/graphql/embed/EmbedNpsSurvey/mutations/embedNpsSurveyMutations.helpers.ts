import { Model } from 'sequelize';

import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';

type Args = {
  accountUserId: number;
  surveyEntityId: string;
  participantAttributes?: Array<keyof Omit<NpsParticipant, keyof Model>>;
};

export const getSurveyParticipant = async ({
  accountUserId,
  surveyEntityId,
  participantAttributes,
}: Args) => {
  const participant = await NpsParticipant.findOne({
    where: {
      accountUserId,
      entityId: surveyEntityId,
    },
    ...(participantAttributes ? { attributes: participantAttributes } : {}),
    include: [
      {
        model: NpsSurveyInstance,
        required: true,
        attributes: ['id'],
        include: [
          {
            model: NpsSurvey,
            required: true,
          },
        ],
      },
    ],
  });

  return participant;
};
