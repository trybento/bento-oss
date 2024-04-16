import { Alert, AlertDescription } from '@chakra-ui/react';
import { TemplateState } from 'bento-common/types';
import { useTemplate } from 'providers/TemplateProvider';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { parseISO, format } from 'date-fns';

const GuideAnalyticsCallout: React.FC = () => {
  const {
    template: { archivedAt, state, stoppedAt },
  } = useTemplate();

  if (archivedAt) {
    return (
      <Alert status="error" variant="subtle" gap={2}>
        <LockOutlinedIcon fontSize="small" />
        <AlertDescription>
          These stats are locked as of{' '}
          {format(parseISO(archivedAt), 'MMM d, yyyy')} when this was removed
          for all users.
        </AlertDescription>
      </Alert>
    );
  }

  if (state === TemplateState.stopped) {
    return (
      <Alert status="warning" variant="subtle" gap={2}>
        <PersonOutlineOutlinedIcon fontSize="small" />
        <AlertDescription>
          {stoppedAt &&
            `Launching was stopped on ${format(
              parseISO(stoppedAt),
              'MMM d, yyyy'
            )}. `}
          Users with this experience may continue to interact and make progress.{' '}
          <strong>No new users</strong> will get this experience.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default GuideAnalyticsCallout;
