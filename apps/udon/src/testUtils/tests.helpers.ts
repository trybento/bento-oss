import {
  NpsEndingType,
  NpsFollowUpQuestionType,
  NpsPageTargetingType,
  NpsStartingType,
} from 'bento-common/types/netPromoterScore';
import {
  RuleTypeEnum,
  TargetingType,
  TargetValueType,
} from 'bento-common/types';

import { getDummyString } from 'src/testUtils/dummyDataHelpers';
import { AccountUser } from 'src/data/models/AccountUser.model';
import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import launchNpsSurvey from 'src/interactions/netPromoterScore/launchNpsSurvey';
import upsertNpsSurvey from 'src/interactions/netPromoterScore/upsertNpsSurvey';
import { propagateGuideBaseChanges } from 'src/jobsBull/jobs/syncTemplateChanges/propagateGuideBaseChanges';
import { propagateTemplateChanges } from 'src/jobsBull/jobs/syncTemplateChanges/propagateTemplateChanges';
import { makeLogger } from 'src/jobsBull/logger';
import { GuideBase, GuideBaseScope } from 'src/data/models/GuideBase.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Guide } from 'src/data/models/Guide.model';

/** Call propagate template, but also propagate guideBases since no jobs in test */
export const propagateTemplateChangesInPlace = async (template: Template) => {
  await propagateTemplateChanges({ template });

  const guideBases = (await GuideBase.scope(
    GuideBaseScope.withTemplate
  ).findAll({
    where: {
      createdFromTemplateId: template.id,
    },
  })) as Array<
    GuideBase & {
      createdFromTemplate: Template;
    }
  >;

  for (const guideBase of guideBases) {
    await propagateGuideBaseChanges({ guideBase, logger: makeLogger('test') });
  }
};

export const createDummyNps = async (
  organization: Organization,
  accountUser: AccountUser,
  count = 1
) => {
  const results: Array<{
    npsSurvey: NpsSurvey;
    npsSurveyInstance: NpsSurveyInstance;
    npsParticipant: NpsParticipant;
  }> = [];

  for (let i = 0; i < count; i++) {
    const [npsSurvey] = await upsertNpsSurvey({
      organization,
      input: {
        name: getDummyString(),
        question: getDummyString(),
        startingType: NpsStartingType.manual,
        endingType: NpsEndingType.manual,
        fupType: NpsFollowUpQuestionType.none,
        priorityRanking: i,
        pageTargeting: {
          type: NpsPageTargetingType.anyPage,
        },
      },
    });

    await launchNpsSurvey({ organization, entityId: npsSurvey.entityId });

    const [npsSurveyInstance] = await npsSurvey.$get('instances');

    const npsParticipant = await NpsParticipant.create({
      npsSurveyInstanceId: npsSurveyInstance.id,
      organizationId: organization.id,
      accountUserId: accountUser.id,
      accountId: accountUser.accountId,
    });

    results.push({
      npsSurvey,
      npsSurveyInstance,
      npsParticipant,
    });
  }

  return results;
};

export const getParticipantForUserAndTemplate = (
  accountUserId: number,
  createdFromTemplateId: number
) =>
  GuideParticipant.findOne({
    where: { accountUserId },
    include: [
      {
        model: Guide,
        required: true,
        where: {
          createdFromTemplateId,
        },
      },
    ],
  });

export const getDummyAccountUserNameRule = (
  fullName: string,
  ruleType: RuleTypeEnum,
  attribute = 'fullName'
) => ({
  type: TargetingType.attributeRules,
  groups: [
    {
      rules: [
        {
          value: fullName,
          attribute,
          valueType: TargetValueType.text,
          ruleType,
        },
      ],
    },
  ],
});
