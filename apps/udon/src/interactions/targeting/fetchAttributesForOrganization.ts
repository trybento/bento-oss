import { uniqWith } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import {
  AttributeType,
  DataSource,
  SelectedModelAttrs,
  StepType,
  TargetValueType,
} from 'bento-common/types';

import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { Loaders } from 'src/data/loaders';
import { sortArrayByObjectKey } from 'src/utils/helpers';
import { enableBranchingSelectionTargeting } from 'src/utils/features';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Organization } from 'src/data/models/Organization.model';

type Attr = {
  entityId: string;
  name: string;
  type?: AttributeType;
  valueType: TargetValueType;
  source?: DataSource;
};

/**
 * Default attrs, populated by Bento or the customer, that everyone starts with
 */
const DEFAULT_ATTRIBUTES: Attr[] = [
  {
    name: 'id',
    type: AttributeType.account,
    valueType: TargetValueType.text,
  },
  {
    name: 'id',
    type: AttributeType.accountUser,
    valueType: TargetValueType.text,
  },
  {
    name: 'createdAt',
    type: AttributeType.account,
    valueType: TargetValueType.date,
  },
  {
    name: 'name',
    type: AttributeType.account,
    valueType: TargetValueType.text,
  },
  {
    name: 'fullName',
    type: AttributeType.accountUser,
    valueType: TargetValueType.text,
  },
].map((attr) => ({
  ...attr,
  entityId: uuidv4(),
  source: DataSource.snippet,
}));

type Args = {
  loaders?: Loaders;
  organization: SelectedModelAttrs<Organization, 'id'>;
  /** Include bento-provided attributes that aren computed, not stored */
  fullList?: boolean;
};

type QueryOpts = {
  limit?: number;
  offset?: number;
};

export default async function fetchAttributesForOrganization(
  { loaders, organization, fullList }: Args,
  { limit, offset }: QueryOpts = {}
) {
  const customAttrs = loaders
    ? await loaders.attributesOfOrganizationLoader.load(organization.id)
    : await CustomAttribute.findAll({
        where: { organizationId: organization.id },
        ...(limit ? { limit, offset, order: [['id', 'ASC']] } : {}),
      });

  const useBranchingSelectionTargeting =
    await enableBranchingSelectionTargeting.enabled(organization.id);

  const bentoAttributes: Attr[] = [];

  if (fullList) {
    bentoAttributes.push({
      name: 'Guide received',
      type: AttributeType.accountUser,
      valueType: TargetValueType.template,
      source: DataSource.bento,
      entityId: uuidv4(),
    });
    if (useBranchingSelectionTargeting) {
      const stepPrototypesWithBranching = await StepPrototype.findAll({
        where: {
          organizationId: organization.id,
          stepType: {
            [Op.in]: [StepType.branching, StepType.branchingOptional],
          },
        },
        attributes: ['branchingQuestion'],
        group: ['branchingQuestion'],
      });

      stepPrototypesWithBranching.forEach((sp) => {
        bentoAttributes.push({
          name: `Branching: ${sp.branchingQuestion}`,
          type: AttributeType.account,
          valueType: TargetValueType.text,
          entityId: uuidv4(),
          source: DataSource.bento,
        });
      });
    }
  }

  return sortArrayByObjectKey(
    /* CustomAttribute may have been generated for the defaults before */
    uniqWith(
      DEFAULT_ATTRIBUTES.concat(customAttrs, bentoAttributes),
      (attr1, attr2) => attr1.name === attr2.name && attr1.type === attr2.type
    ),
    'type'
  );
}
