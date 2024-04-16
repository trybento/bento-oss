import { AtLeast, AttributeType, SelectedModelAttrs } from 'bento-common/types';
import { Op } from 'sequelize';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { Organization } from 'src/data/models/Organization.model';

type Args = {
  attribute:
    | AtLeast<
        CustomAttribute | { name: string; type: AttributeType },
        'name' | 'type'
      >
    | { name: string; type: AttributeType };
  organization: SelectedModelAttrs<Organization, 'id'>;
};

export default async function countEntriesWithAttribute({
  attribute,
  organization,
}: Args) {
  const conditions = {
    where: {
      organizationId: organization.id,
      ...(!(attribute instanceof CustomAttribute)
        ? {
            attributes: {
              [attribute.name]: { [Op.not]: null },
            },
          }
        : {}),
    },
  };

  const count =
    attribute.type === AttributeType.accountUser
      ? await AccountUser.count(conditions)
      : await Account.count(conditions);
  return count || 0;
}
