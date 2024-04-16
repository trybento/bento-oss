import React from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';

import { AttributeType } from 'bento-common/types';
import { AdminRequests } from 'bento-common/types';
import { saveCSV } from 'helpers';
import sendAdminWSRequest from 'utils/sendAdminRequest';
import {
  defaultAccountAttributes,
  defaultAccountUserAttributes,
} from 'bento-common/validation/bentoSettings.schema';

export const downloadCsvImportTemplate = (
  action: ImportActions,
  target: AttributeType
) => {
  let baseString =
    target === AttributeType.account ? 'account_id' : 'user_id,user_email';

  if (action === ImportActions.createAttribute)
    baseString += ',my_new_attribute';

  const filename = `Bento_template_${
    target === AttributeType.account ? 'account' : 'user'
  }_${action === ImportActions.createTag ? 'one_off' : 'permanent'}`;

  saveCSV(filename, baseString);
};

export const requestCsvImport = async ({
  organizationEntityId,
  accessToken,
  csvString,
  attributeName,
  defaultAttributeValue,
  onError,
  onSuccess,
  attributeType,
}: {
  organizationEntityId: string;
  accessToken?: string;
  csvString: string;
  attributeName?: string;
  defaultAttributeValue?: string;
  attributeType: AttributeType;
  onSuccess?: (data: any) => void;
  onError?: (e: any) => void;
}) => {
  return sendAdminWSRequest({
    type: AdminRequests.uploadUserAttributes,
    accessToken,
    onSuccess,
    onError,
    organizationEntityId,
    payload: {
      attributeName,
      data: csvString,
      defaultAttributeValue,
      attributeType,
    },
  });
};

export enum UsageLabels {
  autocomplete = 'Step completion',
  autolaunch = 'Targeting',
}

export const ICON_STYLE: React.CSSProperties = {
  width: '1rem',
  height: '1rem',
};

export enum ImportActions {
  createTag = 'One-off',
  createAttribute = 'Permanent',
}

export const actionOptions = Object.values(ImportActions).map((v) => ({
  label: v,
  value: v,
}));

export const targetOptions = [
  {
    Icon: <PersonIcon />,
    alt: 'User',
    label: 'User',
    value: AttributeType.accountUser,
  },
  {
    Icon: <BusinessIcon />,
    alt: 'Account',
    label: 'Account',
    value: AttributeType.account,
  },
];

/**
 * Determine of the attribute is a standard default
 */
export const isDefaultAttribute = (
  type: AttributeType,
  attributeName: string
) => {
  const arr =
    type === AttributeType.account
      ? defaultAccountAttributes
      : defaultAccountUserAttributes;

  return arr.includes(attributeName);
};
