import { format } from 'date-fns';

import { Organization } from 'src/data/models/Organization.model';

export const getAverage = (arr: number[]) =>
  arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

export const getActiveOrgs = async (attributes?: Array<keyof Organization>) =>
  await Organization.scope('active').findAll({ attributes });

export const toFixedNumerical = (n: number, p: number) => +n.toFixed(p);

export const combineObjectLists = <T>(arr: Partial<T>[]) =>
  arr.reduce((a, v) => ({ ...a, ...v }), {} as Partial<T>);

export const formatRawDate = (date?: string) => {
  if (!date) return '';

  try {
    const d = new Date(date);
    return format(d, 'MM/dd/yyyy');
  } catch {
    return date;
  }
};

/**
 * Common columns, to keep labeling consistent
 */
export const COLUMN_LABELS = {
  accountName: 'Customer name',
  accountExternalId: 'Customer ID',
  accountUserName: 'Participant name',
  accountUserEmail: 'Participant email',
  accountUserExternalId: 'Participant ID',
  guideName: 'Guide name',
  moduleName: 'Step group name',
  stepName: 'Step name',
};
