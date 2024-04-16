import FormData from 'form-data';
import fetch from 'node-fetch';

import { GoogleDriveUploaderAuth } from 'src/data/models/GoogleDriveUploaderAuth.model';
import { IS_STAGING } from 'src/utils/constants';
import { logger } from 'src/utils/logger';

const GOOGLE_DRIVE_UPLOADER_CLIENT_ID =
  process.env.GOOGLE_DRIVE_UPLOADER_CLIENT_ID;
const GOOGLE_DRIVE_UPLOADER_CLIENT_SECRET =
  process.env.GOOGLE_DRIVE_UPLOADER_CLIENT_SECRET;

export async function refreshGoogleDriveUploaderAccessToken({
  googleDriveUploaderAuth,
}: {
  googleDriveUploaderAuth: GoogleDriveUploaderAuth;
}) {
  if (googleDriveUploaderAuth.expiresAt > new Date()) {
    return googleDriveUploaderAuth;
  }

  const { refreshToken } = googleDriveUploaderAuth;

  const form = new FormData();
  form.append('refresh_token', refreshToken);
  form.append('client_id', GOOGLE_DRIVE_UPLOADER_CLIENT_ID || '');
  form.append('client_secret', GOOGLE_DRIVE_UPLOADER_CLIENT_SECRET || '');
  form.append('grant_type', 'refresh_token');

  const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    body: form,
  });
  const jsonResponse = await response.json();

  if (!response.ok && !IS_STAGING) {
    logger.error(
      `Fetch error on refreshing google uploader access token: (${response.status}) ${response.statusText}`
    );
    throw new Error('Could not refresh Google Drive Uploader access token');
  } else if (!response.ok && IS_STAGING) {
    return;
  }

  const { access_token, expires_in } = jsonResponse;

  if (!access_token) {
    throw new Error('No access_token returned');
  }

  if (!expires_in) {
    throw new Error('No expires_in returned');
  }

  const expiresInMilliseconds = Number(expires_in) * 1000;
  const expiresAt = new Date(new Date().getTime() + expiresInMilliseconds);

  await googleDriveUploaderAuth.update({
    expiresAt,
    accessToken: access_token,
  });

  return googleDriveUploaderAuth;
}
