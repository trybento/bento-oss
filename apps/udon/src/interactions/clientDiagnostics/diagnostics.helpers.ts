import { DiagnosticModules, DiagnosticStates } from 'bento-common/types';
import { withTransaction } from 'src/data';
import {
  DiagnosticState,
  OrganizationData,
} from 'src/data/models/Analytics/OrganizationData.model';
import { DIAGNOSTICS_CACHE_TTL } from 'src/utils/constants';

export function isDiagnosticCached(
  diagnosticValue?: DiagnosticState | DiagnosticStates,
  force = false
) {
  return (
    typeof diagnosticValue === 'object' &&
    (Date.now() - new Date(diagnosticValue.updatedAt).getTime() <
      DIAGNOSTICS_CACHE_TTL ||
      force)
  );
}

/**
 * Persist results to org data
 */
export const persistDiagnosticResult = ({
  organizationId,
  updatedDiagnostics,
}: {
  organizationId: number;
  updatedDiagnostics: Partial<Record<DiagnosticModules, DiagnosticStates>>;
}) =>
  // there's a chance that this will be called multiple times at once because
  // it's called within the resolvers so this transaction ensures the updates
  // from one resolver don't overwrite the results from another
  withTransaction(async () => {
    const [orgData] = await OrganizationData.findOrCreate({
      where: { organizationId },
    });

    const updatedAt = new Date();

    const diagnostics = {
      ...orgData.diagnostics,
      ...Object.fromEntries(
        Object.entries(updatedDiagnostics).map(([name, state]) => [
          name,
          { state, updatedAt },
        ])
      ),
    };

    await orgData.update({
      diagnostics,
    });
  });

/**
 * Check all stored diagnostic states for warnings and errors
 */
export const hasDiagnosticWarnings = async (orgData: OrganizationData) =>
  Object.values(orgData.diagnostics || ({} as OrganizationData)).some((val) => {
    const state = typeof val === 'object' ? val.state : val;

    return (
      state === DiagnosticStates.critical || state === DiagnosticStates.warning
    );
  });
