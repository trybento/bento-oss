import { AuditEvent, RestrictedAuditEvents } from 'bento-common/types';
import { GroupTargeting } from 'bento-common/types/targeting';
import { formatTargetingSegment } from 'bento-common/utils/targeting';
import { ProcessedResults } from '../templateTabs.helpers';

export const EVENT_DESCRIPTIONS: {
  [key in Exclude<AuditEvent, RestrictedAuditEvents>]: string;
} = {
  [AuditEvent.manualLaunch]: 'Guide manually launched',
  [AuditEvent.launched]: 'Guide launched',
  [AuditEvent.contentChanged]: 'Guide content modified',
  [AuditEvent.created]: 'Guide created',
  [AuditEvent.settingsChanged]: 'Guide settings modified',
  [AuditEvent.paused]: 'Guide stopped launching',
  [AuditEvent.subContentChanged]: `%s's content changed`,
  [AuditEvent.autolaunchChanged]: 'Launch rules modified',
  [AuditEvent.autocompleteChanged]: 'Step autocomplete changed',
  [AuditEvent.archived]: 'Guide removed',
  [AuditEvent.locationChanged]: 'Location changed',
  [AuditEvent.expirationCriteriaChanged]: 'Expiration criteria changed',
  [AuditEvent.reset]: 'Guide was reset',
  [AuditEvent.removed]: 'Guide was removed from all users',
  [AuditEvent.priorityChanged]: 'Guide priority changed',
};

/** Older audit logs don't use GroupTargeting and will need transformation */
export const getAuditTargetingInfo = (auditEvent: ProcessedResults) => {
  const isGroupTargeting = !!(
    auditEvent.data[0].account && auditEvent.data[0].accountUser
  );

  const groupTargeting: GroupTargeting = isGroupTargeting
    ? (auditEvent.data[0] as GroupTargeting)
    : {
        account: formatTargetingSegment(
          auditEvent.data[0].autoLaunchRules ?? [],
          true
        ),
        accountUser: formatTargetingSegment(
          auditEvent.data[0].targets ?? [],
          true
        ),
      };

  return groupTargeting;
};

export const auditEventHasTargetingInfo = (auditEvent: ProcessedResults) =>
  auditEvent.data.some(
    (d) => d.autoLaunchRules || d.targets || d.account || d.accountUser
  );

export const getEventAccountNames = (auditEvent: ProcessedResults) =>
  auditEvent.data.map((d) => d.accountName || '');
