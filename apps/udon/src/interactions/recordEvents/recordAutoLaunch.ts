import {
  AutoLaunchLog,
  MatchedRule,
} from 'src/data/models/AutoLaunchLog.model';

type Args = {
  templateId: number;
  accountId: number;
  organizationId: number;
  guideBaseId?: number;
  matchedRules: MatchedRule[];
};

export default async function recordAutoLaunch({
  accountId,
  organizationId,
  templateId,
  matchedRules,
  guideBaseId: createdGuideBaseId,
}: Args) {
  await AutoLaunchLog.create({
    templateId,
    accountId,
    organizationId,
    createdGuideBaseId,
    matchedRules,
  });
}
