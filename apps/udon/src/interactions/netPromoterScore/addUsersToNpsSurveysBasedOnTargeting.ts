import { Op } from 'sequelize';
import { AtLeast, GroupCondition, TargetingType } from 'bento-common/types';
import { NpsSurveyTarget } from 'bento-common/types/netPromoterScore';

import { Organization } from 'src/data/models/Organization.model';
import { extractId } from 'src/utils/helpers';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { LaunchReport } from '../reporting/LaunchReport';
import { Account } from 'src/data/models/Account.model';
import NpsParticipant, {
  NpsParticipantCreationAttributes,
} from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import { enableNpsSurveys } from 'src/utils/features';
import { checkAttributeRulesMatch } from '../targeting/checkAttributeRulesMatch';

type Args = {
  /** Which account user */
  accountUser: number | AtLeast<AccountUser, 'id'>;
  /** Instance of a launch report to write to */
  launchReport?: LaunchReport;
};

export const checkTargetsMatch = (
  input: Parameters<typeof checkAttributeRulesMatch>[0]['input'],
  target: NpsSurveyTarget
) => {
  const { type, rules, grouping } = target;

  switch (type) {
    case TargetingType.all:
      return true;

    case TargetingType.attributeRules:
      if (grouping === GroupCondition.any) {
        return rules.some((rule) =>
          checkAttributeRulesMatch({
            input,
            rules: [rule],
          })
        );
      }
      return checkAttributeRulesMatch({ input, rules });

    default:
      throw new Error(`Unexpected target type: ${type}`);
  }
};

/**
 * Launch or schedule a NPS survey
 *
 * @todo support the launch report
 * @returns Promise the NpsParticipant instances created
 */
export default async function addUsersToNpsSurveysBasedOnTargeting({
  accountUser: givenAccountUser,
  launchReport,
}: Args): Promise<NpsParticipant[]> {
  if (launchReport) throw new Error('Launch report is currently not supported');

  const accountUser = await AccountUser.findOne({
    attributes: [
      'id',
      'organizationId',
      'fullName',
      'email',
      'attributes',
      'createdInOrganizationAt',
    ],
    where: {
      id: extractId(givenAccountUser),
    },
    include: [
      {
        model: Account.scope('notArchived'),
        attributes: ['id', 'name', 'attributes', 'createdInOrganizationAt'],
        required: true,
      },
      {
        model: Organization.scope('active'),
        attributes: [],
        required: true,
      },
    ],
  });

  if (!accountUser) return [];

  // wont bother if the feature flag is disabled
  if (!(await enableNpsSurveys.enabled(accountUser.organizationId))) return [];

  // find all currently available survey instances for which the account user
  // is currently NOT a participant
  const eligibleInstances = await NpsSurveyInstance.scope(['active']).findAll({
    attributes: ['id'],
    where: {
      organizationId: accountUser.organizationId,
      // the below is failing a type check for some reason
      // @ts-ignore
      '$participants.id$': {
        [Op.is]: null,
      },
    },
    include: [
      {
        model: NpsParticipant,
        attributes: [],
        where: {
          accountUserId: accountUser.id,
        },
        required: false,
      },
      {
        model: NpsSurvey,
        attributes: ['id', 'targets'],
        required: true,
      },
    ],
    order: [['id', 'asc']],
  });

  // skip if no eligible surveys are found
  if (!eligibleInstances.length) return [];

  // reduce the participants to be created based on whether it matches the targeting criteria
  const participantsToCreate = eligibleInstances.reduce((acc, instance) => {
    const targets = instance.survey!.targets;

    if (
      checkTargetsMatch(accountUser.account, targets.account) &&
      checkTargetsMatch(accountUser, targets.accountUser)
    ) {
      acc.push({
        organizationId: accountUser.organizationId,
        npsSurveyInstanceId: instance.id,
        accountId: accountUser.account.id,
        accountUserId: accountUser.id,
      });
    }

    return acc;
  }, [] as NpsParticipantCreationAttributes[]);

  if (!participantsToCreate.length) return [];

  return NpsParticipant.bulkCreate(participantsToCreate, {
    ignoreDuplicates: true,
    returning: true,
  });
}
