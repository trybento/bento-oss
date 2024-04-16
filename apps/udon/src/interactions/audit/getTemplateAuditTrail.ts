import promises from 'src/utils/promises';
import { Op } from 'sequelize';

import { HIDE_AUDIT_EVENTS } from 'bento-common/types';
import { Loaders } from 'src/data/loaders';
import { AuditData } from 'src/data/models/Audit/common';
import { TemplateAudit } from 'src/data/models/Audit/TemplateAudit.model';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';
import { AuditEvent } from 'src/utils/auditContext';

type Args = {
  templateEntityId: string;
  organization: Organization;
  loaders: Loaders;
};

type MappedEvent = {
  entityId: string;
  eventName: AuditEvent;
  timestamp: Date;
  user: User | null;
  data?: string;
};

/** Prepare additional data for client */
const createCustomData = async ({
  eventName,
  data,
  loaders,
}: {
  eventName: AuditEvent;
  data?: AuditData;
  loaders: Loaders;
}) => {
  let customData;

  if (eventName === AuditEvent.manualLaunch) {
    /* We expect some */
    const accountId = data?.accountId;
    if (accountId) {
      const account = await loaders.accountLoader.load(accountId);
      customData = { accountName: account?.name || '(unnamed account)' };
    }
  } else if (eventName === AuditEvent.subContentChanged) {
    const moduleId = data?.moduleId;
    if (moduleId) {
      const module = await loaders.moduleLoader.load(moduleId);

      if (module) customData = { moduleName: module.name };
    }
  }
  return customData;
};

/**
 * Get related audit events from latest to oldest
 *   Let front-end re-organize data for display to keep query unopinionated
 */
export default async function getTemplateAuditTrail({
  templateEntityId,
  organization,
  loaders,
}: Args) {
  const template = await loaders.templateEntityLoader.load(templateEntityId);

  if (!template) return [];

  const templateCreator = await template.$get('createdByUser');

  const templateAuditEvents = await TemplateAudit.findAll({
    where: {
      templateId: template.id,
      organizationId: organization.id,
      eventName: {
        [Op.notIn]: HIDE_AUDIT_EVENTS,
      },
    },
    order: [['createdAt', 'DESC']],
    include: [User],
  });

  const events: MappedEvent[] = [];

  /** Build trail with accompanying data if needed */
  await promises.mapSeries(templateAuditEvents, async (templateAudit) => {
    const {
      entityId,
      eventName,
      createdAt: timestamp,
      user,
      data,
    } = templateAudit;

    const customData = await createCustomData({
      eventName,
      data,
      loaders,
    });

    const obj = {
      entityId,
      eventName: eventName as AuditEvent,
      timestamp,
      user,
      /** Will need to parse to get account names to client. May want to group too */
      data: JSON.stringify(customData || data),
    };

    events.push(obj);
  });

  /** There's always a creation event */
  events.push({
    entityId: template.entityId,
    eventName: AuditEvent.created,
    timestamp: template.createdAt,
    user: templateCreator,
  });

  return events;
}
