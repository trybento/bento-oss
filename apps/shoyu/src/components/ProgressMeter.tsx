import composeComponent from 'bento-common/hocs/composeComponent';
import ProgressMeter from 'bento-common/components/ProgressMeter';

import withCustomUIContext from '../hocs/withCustomUIContext';

type OuterProps = {
  completedSteps: number | undefined;
  totalSteps: number | undefined;
};

export default composeComponent<OuterProps>([withCustomUIContext])(
  ProgressMeter
);
