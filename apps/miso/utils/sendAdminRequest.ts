import { AdminRequestMessage } from './../../common/types/index';
import { AdminRequests } from 'bento-common/types';
import env from '@beam-australia/react-env';

const WS_HOST = env('WEBSOCKET_HOST');
const API_HOST = env('API_HOST');

type Args = {
  type: AdminRequests;
  organizationEntityId: string;
  payload?: any;
  accessToken?: string;
  onSuccess?: (data: string) => void;
  onError?: (e: any) => void;
};

/**
 * Submits a request through the admin ws
 * Resolves when request is submitted
 */
export default function sendAdminWSRequest({
  accessToken,
  payload = {},
  organizationEntityId,
  type,
  onSuccess,
  onError,
}: Args): Promise<void> {
  return new Promise((resolve, reject) => {
    const token = accessToken || localStorage.accessToken;
    if (!token) return reject('Unauthorized');

    const ws = new WebSocket(`${WS_HOST}/admin`);
    let closedByServer = true;

    ws.onopen = async () => {
      ws?.send(JSON.stringify({ type, organizationEntityId, ...payload }));
      resolve();
    };

    ws.addEventListener('message', ({ data }: MessageEvent<string>) => {
      if (data.startsWith('Error:')) {
        onError(new Error(data.replace('Error: ', '')));
      } else {
        onSuccess?.(data);
      }
      closedByServer = false;
      ws.close();
    });

    ws.onclose = () => {
      if (closedByServer) console.info('Socket closed!');
    };

    ws.onerror = (e) => {
      ws.close();
      onError?.(e);
    };
  });
}

type AdminRequestArgs = {
  payload: AdminRequestMessage & { filename: string };
  accessToken: string;
};

export async function sendReportGenerationRequest({
  accessToken,
  payload,
}: AdminRequestArgs) {
  const res = await fetch(`${API_HOST}/generate-report`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error((await res.json()).message);
  }
}
