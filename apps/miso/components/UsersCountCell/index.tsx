import { accountUserNameIdentityShort } from 'utils/helpers';
import Tooltip from 'system/Tooltip';

interface User {
  fullName?: string;
  email?: string;
}

interface UsersCountCellProps {
  users: readonly User[] | undefined;
  count?: number;
  maxShown?: number;
}

export default function UsersCountCell({
  users,
  count,
  maxShown = 3,
}: UsersCountCellProps) {
  if (!users) return <span>0</span>;

  let tooltipLabel = '';

  for (const [userIdx, user] of users.entries()) {
    if (userIdx === maxShown) {
      const remaining = users.length - maxShown;
      tooltipLabel += ` + ${remaining} other${remaining > 1 ? 's' : ''}`;
      break;
    }

    tooltipLabel +=
      (userIdx === 0 ? '' : ', ') + accountUserNameIdentityShort(user);
  }

  let usersCount: number;
  if (count != null) {
    usersCount = count;
  } else {
    usersCount = users.length;
  }

  if (!tooltipLabel) {
    return <span>{usersCount}</span>;
  }

  return (
    <Tooltip label={tooltipLabel} placement="top">
      <span>{usersCount}</span>
    </Tooltip>
  );
}
