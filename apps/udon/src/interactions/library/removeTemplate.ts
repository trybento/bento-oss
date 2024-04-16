import { TemplateState } from 'src/../../common/types';
import { withTransaction } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import detachPromise from 'src/utils/detachPromise';
import { removeBranchingChoices } from '../branching/removeBranchingChoices';
import { invalidateLaunchingCacheForOrg } from '../caching/identifyChecksCache';
import { removeLaunchTypeCtasOfDestination } from '../removeLaunchTypeCtasOfDestination';
import batchSyncTemplateChanges from './batchSyncTemplateChanges';

export default async function removeTemplate({
  template,
  organization,
  userId,
}: {
  template: Template;
  organization: Organization;
  userId: number;
}) {
  return withTransaction(async () => {
    new AuditContext({
      type: AuditType.Template,
      modelId: template.id,
      organizationId: organization.id,
      userId,
    }).logEvent({
      eventName: AuditEvent.archived,
    });

    const affectedLaunchTemplates = await removeLaunchTypeCtasOfDestination({
      launchableTemplateId: template.id,
      organizationId: organization.id,
    });

    const affectedBranchingTemplates = await removeBranchingChoices({
      templateId: template.id,
      organization,
    });

    await template.update({
      state: TemplateState.removed,
      archivedAt: new Date(),
      isAutoLaunchEnabled: false,
    });

    await batchSyncTemplateChanges({
      // we don't need to manually dedupe the affected templates since the job placement
      // strategy will already handle that for us
      templateIds: [
        // theoretically we wouldn't need to sync "launch" templates since ctas are synced separately
        ...affectedLaunchTemplates,
        ...affectedBranchingTemplates,
      ],
      queueName: `sync-launchable-template-${template.entityId}`,
      organizationId: organization.id,
    });

    // Invalidates the Org cache after archiving the template so the guide is not kept
    // "alive" due to CSP on the client-side.
    detachPromise(async () => {
      void invalidateLaunchingCacheForOrg(organization.id, 'removeTemplate');
    }, '[removeTemplate] invalidate launching cache for org');
  });
}
