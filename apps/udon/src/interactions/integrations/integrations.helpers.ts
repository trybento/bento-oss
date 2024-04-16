import { IntegrationType } from 'src/data/models/IntegrationApiKey.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';

/**
 * Perform certain actions when a specific integration is disabled.
 */
export const onIntegrationDisabled = async (
  organizationId: number,
  integrationType: IntegrationType
) => {
  switch (integrationType) {
    case IntegrationType.zendesk:
      /* Disable the help center options */
      const orgSettings = await OrganizationSettings.findOne({
        where: { organizationId },
      });

      if (orgSettings)
        await orgSettings.update({
          helpCenter: {
            ...orgSettings.helpCenter,
            kbSearch: false,
            issueSubmission: false,
            liveChat: false,
          },
        });
      break;
    default:
  }
};
