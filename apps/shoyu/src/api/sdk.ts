import {
  BentoSDK,
  GetEventMetadataOptions,
  CustomApiEventEntityType,
} from 'bento-common/types';
import { getToken } from '../stores/sessionStore/helpers';
import { getTraceHeaders } from '../lib/trace';
import { API_URL_BASE } from '../constants';

const getEventMetadata = async (
  options: GetEventMetadataOptions,
  entityType: CustomApiEventEntityType
) => {
  const response = await fetch(
    `${API_URL_BASE}/embed/events/${options.eventName}/metadata?entityType=${entityType}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
        ...getTraceHeaders(),
      },
    }
  );

  if (response && !response.ok) {
    throw new Error('Error retrieving event metadata');
  }

  return response.json();
};

const sdk: BentoSDK = {
  getEventMetadataForAccount: (options) =>
    getEventMetadata(options, CustomApiEventEntityType.account),
  getEventMetadataForAccountUser: async (options) =>
    getEventMetadata(options, CustomApiEventEntityType.user),
};

export default sdk;
