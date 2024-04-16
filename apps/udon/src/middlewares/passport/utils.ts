import { UserStatus } from 'src/data/models/types';
import { User } from 'src/data/models/User.model';
import { UserDenyList } from 'src/data/models/UserDenyList.model';
import InactiveUserError from 'src/errors/InactiveUserError';

export async function checkExistingUser(user: number | User) {
  const existingUser =
    user instanceof User
      ? user
      : await User.findOne({
          where: { id: user },
        });

  if (existingUser?.status !== UserStatus.active) {
    throw new InactiveUserError();
  }
  return existingUser;
}

/**
 * Checks if a given email address is on the user deny list.
 * Both the exact email address (person@company.com) and the
 * domain name (company.com) will be checked.
 */
export const isEmailOnDenyList = async (email: string) => {
  /**
   * It's possible to have email addresses with multiple '@' symbols,
   * so this just splits at the first '@' and returns the rest as the domain.
   */
  const domain = email.slice(email.indexOf('@') + 1);

  const deny = await UserDenyList.findOne({
    where: { text: [email, domain] },
  });

  return !!deny;
};
