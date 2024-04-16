import { FindAttributeOptions } from 'sequelize';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';
import { UserOrganization } from 'src/data/models/UserOrganization.model';

/** See what orgs a muli-org user is eligible to log in to */
export const getEligibleOrganizations = async (
  user: User,
  attributes: FindAttributeOptions = ['name', 'entityId']
) => {
  let orgs: Organization[];
  if (user.isSuperadmin) {
    orgs = await Organization.findAll({ attributes });
  } else {
    orgs = (
      await UserOrganization.findAll({
        where: { userId: user.id },
        include: [{ model: Organization, attributes }],
      })
    ).map((uo) => uo.organization);
  }

  return orgs;
};

/** Confirm the user is allowed on a certain org entityId */
export const confirmUserPartOfOrg = async (
  userEntityId: string,
  organizationEntityId: string
): Promise<
  [
    /** Whether the user is part of the Org */
    isPartOfOrg: boolean,
    /** The user found, if exists */
    user: User | undefined
  ]
> => {
  const user = await User.scope(['active']).findOne({
    where: { entityId: userEntityId },
  });

  if (!user) return [false, undefined];
  if (user.isSuperadmin) return [true, user];

  const userOrg = await UserOrganization.findOne({
    attributes: ['id'],
    where: { userId: user.id },
    include: [
      {
        model: Organization,
        attributes: ['entityId'],
        where: {
          entityId: organizationEntityId,
        },
        required: true,
      },
    ],
  });

  return [!!userOrg, user];
};
