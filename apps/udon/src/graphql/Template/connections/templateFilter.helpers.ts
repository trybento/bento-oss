import { AuditEvent, TemplateState } from 'bento-common/types';

/** Audit events that do not factor into edit filters/sorts */
export const excludedEvents = [
  AuditEvent.launched,
  AuditEvent.manualLaunch,
  AuditEvent.paused,
];

/**
 * Creates a SQL snippet to check if a template is live based on:
 *
 * - State is live
 * - State is draft/stopped, but the template has been manually launched
 */
export const isTemplateLiveSql = (
  stateColumn = 'state',
  manuallyLaunchedColumn = 'manually_launched'
) =>
  `${stateColumn} = '${TemplateState.live}'OR (state IN ('${TemplateState.draft}', '${TemplateState.stopped}') AND ${manuallyLaunchedColumn} = TRUE)`;
