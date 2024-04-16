import { DiagnosticStates } from 'bento-common/types';
import { OrgSettingsQuery } from 'relay-types/OrgSettingsQuery.graphql';

export const hasDiagnosticsWarnings = (
  diagnostics: OrgSettingsQuery['response']['organization']['diagnostics']
) =>
  Object.keys(diagnostics).some(
    (k) =>
      diagnostics[k] !== DiagnosticStates.healthy &&
      diagnostics[k] !== DiagnosticStates.noData
  );
