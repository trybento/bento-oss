import { GraphQLObjectType } from 'graphql';
import { Organization } from 'src/data/models/Organization.model';
import { guidesAnalytics } from './GuidesAnalytics.graphql';
import launchAnalytics from './LaunchAnalytics.graphql';
import { stepAnalytics } from './StepAnalytics.graphql';

import { GraphQLContext } from 'src/graphql/types';
import { AnalyticsBase } from './types';

const AnalyticsType = new GraphQLObjectType<AnalyticsBase, GraphQLContext>({
  fields: {
    guides: guidesAnalytics,
    steps: stepAnalytics,
    launches: launchAnalytics,
  },
  name: 'Analytics',
  description: 'Analytics requests',
});

export class AnalyticsObject {
  organization: Organization;
  startDate: string;
  endDate: string;
  constructor(organization, startDate, endDate) {
    this.organization = organization;
    this.startDate = startDate;
    this.endDate = endDate;
  }
  where() {
    return {
      organizationId: this.organization.id,
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }
}

export default AnalyticsType;
