import isISODate from 'is-iso-date';
import {
  AttributeType,
  DiagnosticModules,
  DiagnosticStates,
  TargetValueType,
} from 'bento-common/types';
import { omit } from 'lodash';
import { Op } from 'sequelize';

import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { getAttributeValueType } from 'src/utils/helpers';
import { persistDiagnosticResult } from './diagnostics.helpers';

export type AccountAttrs = {
  id: string;
  name?: string;
  createdAt?: string;
  [key: string]: string | number | boolean | string[] | undefined;
};
export type AccountUserAttrs = {
  id: string;
  email?: string;
  fullName?: string;
  createdAt?: string;
  [key: string]: string | number | boolean | string[] | undefined;
};

function checkAttrs(
  attrs: AccountAttrs | AccountUserAttrs,
  existingAttrs: Record<string, TargetValueType>
): Partial<Record<DiagnosticModules, DiagnosticStates>> {
  const diagnostics = {};
  for (const [name, value] of Object.entries(attrs)) {
    const dataType = existingAttrs[name];
    if (dataType && dataType !== getAttributeValueType(value)) {
      diagnostics[DiagnosticModules.inconsistentTypes] =
        DiagnosticStates.warning;
    }
    if (
      (dataType === TargetValueType.date || name === 'createdAt') &&
      typeof value === 'string' &&
      !isISODate(value)
    ) {
      diagnostics[DiagnosticModules.nonIsoDates] = DiagnosticStates.warning;
    }
  }
  return diagnostics;
}

export default async function runAttributeDiagnostics(
  organizationId: number,
  accountAttrs: AccountAttrs,
  // @ts-ignore - complains about the empty object
  accountUserAttrs: AccountUserAttrs = {}
) {
  const customAccountAttrs = omit(accountAttrs, ['id', 'name', 'createdAt']);
  const customAccountUserAttrs = omit(accountUserAttrs, [
    'id',
    'email',
    'fullName',
    'createdAt',
  ]);

  const customAttributes = await CustomAttribute.findAll({
    where: {
      organizationId,
      [Op.or]: [
        {
          type: AttributeType.account,
          name: { [Op.in]: Object.keys(customAccountAttrs) },
        },
        {
          type: AttributeType.accountUser,
          name: { [Op.in]: Object.keys(customAccountUserAttrs) },
        },
      ],
    },
  });

  const {
    [AttributeType.account]: existingCustomAccountAttrDataTypes,
    [AttributeType.accountUser]: existingCustomAccountUserAttrDataTypes,
  } = customAttributes.reduce(
    (attrs, attr) => {
      attrs[attr.type!][attr.name] = attr.valueType;
      return attrs;
    },
    { [AttributeType.account]: {}, [AttributeType.accountUser]: {} }
  );

  await persistDiagnosticResult({
    organizationId,
    updatedDiagnostics: {
      [DiagnosticModules.inconsistentTypes]: DiagnosticStates.healthy,
      [DiagnosticModules.nonIsoDates]: DiagnosticStates.healthy,
      ...checkAttrs(accountAttrs, existingCustomAccountAttrDataTypes),
      ...checkAttrs(accountUserAttrs, existingCustomAccountUserAttrDataTypes),
    },
  });
}
