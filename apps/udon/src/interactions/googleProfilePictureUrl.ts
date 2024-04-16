import fetch from 'node-fetch';

import { Loaders } from 'src/data/loaders';
import { AuthType } from 'src/data/models/types';

export default async function googleProfilePictureUrl(
  loaders: Loaders,
  userId?: number
) {
  if (userId === undefined || userId === null) return null;

  const userGoogleAuth = await loaders.userAuthLoader.load([
    userId,
    AuthType.google,
  ]);
  const googleId = userGoogleAuth?.key;

  let googlePictureUrl;
  if (googleId) {
    const googleDriveUploaderAuth =
      await loaders.googleDriveUploaderAuthLoader.load(0);

    if (googleDriveUploaderAuth) {
      const response = await fetch(
        `https://people.googleapis.com/v1/people/${googleId}?personFields=photos`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${googleDriveUploaderAuth?.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const jsonResponse = await response.json();
      if (response.ok) {
        // NOTE: react-avatar doesn't load the URL if it has a size set.
        const pictureUrl = jsonResponse.photos?.[0]?.url || '';
        googlePictureUrl = pictureUrl.replace('=s100', '');
      }
    }
  }

  return googlePictureUrl;
}
