import { Organization } from 'src/data/models/Organization.model';

export interface AnalyticsBase {
  organization: Organization;
  where(): {
    organizationId: number;
    startDate: string;
    endDate: string;
  };
}
