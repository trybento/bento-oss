import DataLoader from 'dataloader';
import { GoogleDriveUploaderAuth } from 'src/data/models/GoogleDriveUploaderAuth.model';
import { refreshGoogleDriveUploaderAccessToken } from 'src/interactions/refreshGoogleDriveUploaderAccessToken';

export default function googleDriveUploaderAuth() {
  return new DataLoader<number, GoogleDriveUploaderAuth>(async (dummyIds) => {
    let auth = await GoogleDriveUploaderAuth.findOne({});
    if (auth) {
      auth = (await refreshGoogleDriveUploaderAccessToken({
        googleDriveUploaderAuth: auth!,
      })) as GoogleDriveUploaderAuth;
    }
    return Array(dummyIds.length).fill(auth);
  });
}
