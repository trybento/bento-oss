import { NextFunction, Request, Response, Router } from 'express';
import passport from 'src/middlewares/passport';

const router = Router();

const handleS3Upload = (req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'private, s-maxage=0');
  if (
    [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
    ].includes(req.query.contentType as string)
  ) {
    next();
  } else {
    res.status(400).end();
  }
};

// Generates an S3 signing URL at /s3/media/uploads/sign
router.use(
  '/media/uploads',
  handleS3Upload,
  passport.authenticate('jwt', { session: false }),
  require('react-s3-uploader/s3router')({
    bucket: process.env.AWS_S3_UPLOAD_BUCKET || 'uploads-trybento-dev',
    region: process.env.AWS_DEFAULT_REGION || 'us-west-1',
    ACL: 'public-read',
    getFileKeyDir: function getFileKeyDir(req) {
      return `media/${req.user.organization.entityId}`;
    },
  })
);

export default router;
