import { graphql } from 'react-relay';

const organizationChangedSubscription = graphql`
  subscription OrganizationChangedSubscription {
    organization: organizationChanged {
      ...OrgSettings_organization @relay(mask: false)
    }
  }
`;

export default organizationChangedSubscription;
