import { queryRunner } from 'src/data';
import { BatchedNotification } from 'src/data/models/BatchedNotifications.model';
import { BrokenVideoPayload } from './sendBatchedAlerts';
import { EmailInfo } from './types';

const BASE_CLIENT_URL = process.env.BASE_CLIENT_URL!;

type Args = {
  notifications: BatchedNotification<BrokenVideoPayload>[];
};

const sql = `--sql
  SELECT DISTINCT COALESCE(sp.name, gsb.name) AS "stepName"
    , COALESCE(sp.entity_id, gsb.entity_id) AS "stepEntityId"
    , COALESCE(m.entity_id, gb.entity_id) AS "guideOrModuleEntityId"
    , COALESCE(m.name, t.name) AS "guideOrModuleName"
    , sp.entity_id is null as "usingGuideBaseInfo"
    , a.name AS "accountName"
  FROM core.guide_step_bases gsb
    LEFT JOIN core.guide_module_bases gmb ON gsb.guide_module_base_id = gmb.id
    LEFT JOIN core.guide_bases gb ON gmb.guide_base_id = gb.id
    LEFT JOIN core.templates t ON t.id = gb.created_from_template_id
    LEFT JOIN core.accounts a ON gb.account_id = a.id
    LEFT JOIN core.step_prototypes sp ON sp.id = gsb.created_from_step_prototype_id AND gb.is_modified_from_template = FALSE
    LEFT JOIN core.modules m ON m.id = gmb.created_from_module_id AND gb.is_modified_from_template = FALSE
  WHERE jsonb_path_exists(gsb.body_slate, ('$.videoId ? (@ == "' || :videoId || '")')::jsonpath)
    AND a.deleted_at IS NULL
		AND gsb.deleted_at IS NULL
    AND gsb.organization_id = :organizationId
`;

/** Given videoIds, this gets all the individual guides we need to notify on */
export default async function getBrokenVideoInformation({
  notifications,
}: Args) {
  const ret: EmailInfo = {};

  /* Iterate through the recipient-videoId info */
  for (const notification of notifications) {
    const { recipientEmail, recipientEntityId, bodyData, organizationId } =
      notification;
    if (!recipientEmail || !recipientEntityId || !bodyData || !organizationId)
      break;

    if (!ret[recipientEmail])
      ret[recipientEmail] = {
        alerts: [],
        recipient: { organizationId, recipientEmail, recipientEntityId },
      };

    const entry = ret[recipientEmail];

    const { videoId } = bodyData;

    const rows = (await queryRunner({
      sql,
      replacements: {
        videoId,
        organizationId,
      },
    })) as {
      stepName: string;
      accountName: string;
      stepEntityId: string;
      guideOrModuleEntityId: string;
      guideOrModuleName: string;
      usingGuideBaseInfo: boolean;
    }[];

    /* For each videoId, we have associated steps. Build the data */
    rows.forEach((row) => {
      const path = row.usingGuideBaseInfo
        ? 'guide-bases'
        : 'library/step-groups';
      const linkUrl = `${BASE_CLIENT_URL}/${path}/${row.guideOrModuleEntityId}?step=${row.stepEntityId}`;

      const alert = {
        stepName: row.stepName,
        guideName: row.guideOrModuleName,
        accountName: row.usingGuideBaseInfo ? row.accountName : undefined,
        linkUrl,
      };

      entry.alerts.push(alert);
    });
  }

  return ret;
}
