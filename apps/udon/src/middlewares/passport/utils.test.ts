import { $enum } from 'ts-enum-util';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { UserStatus } from 'src/data/models/types';
import { checkExistingUser } from './utils';
import InactiveUserError from 'src/errors/InactiveUserError';
import { without } from 'lodash';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('checkExistingUser', () => {
  test.each(without($enum(UserStatus).getValues(), UserStatus.active))(
    '%s users fail',
    async (status) => {
      const { user } = getContext();
      await user.update({ status });
      await expect(checkExistingUser(user.id)).rejects.toThrow(
        InactiveUserError
      );
    }
  );

  test('active users succeed', async () => {
    const { user } = getContext();
    await expect(checkExistingUser(user.id)).resolves.toEqual(
      expect.objectContaining({ id: user.id })
    );
  });
});
