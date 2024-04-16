import { GuideTypeEnum } from 'bento-common/types';
import GuideAnalytics from 'components/Analytics/GuideAnalytics';
import SplitTestAnalytics from 'components/Analytics/SplitTestAnalytics';
import MaintenanceWall from 'components/MaintenanceWall';
import { useAnalyticsMaintenancePage } from 'hooks/useFeatureFlag';
import React from 'react';

type Props = {
  templateEntityId: string;
  type?: GuideTypeEnum;
};

const AnalyticsTab: React.FC<Props> = ({ type, ...restProps }) => {
  const analyticsMaintenancePageEnabled = useAnalyticsMaintenancePage();

  if (analyticsMaintenancePageEnabled)
    return <MaintenanceWall pageName="analytics" h="500px" />;

  switch (type) {
    case GuideTypeEnum.splitTest:
      return <SplitTestAnalytics {...restProps} />;

    default:
      return <GuideAnalytics {...restProps} />;
  }
};

export default AnalyticsTab;
