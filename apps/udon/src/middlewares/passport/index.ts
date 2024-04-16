import passport from 'passport';

import googleStrategy from './googleStrategy';
import embedJwtStrategy from './embedJwtStrategy';
import visualBuilderJwtStrategy from './visualBuilderJwtStrategy';
import jwtStrategy from './jwtStrategy';
import localDevGraphqlStrategy from './localDevGraphqlStrategy';
import localEmbedJwtStrategy from './localEmbedJwtStrategy';
import emailStrategy from './emailStrategy';
import { User } from 'src/data/models/User.model';
import { IS_DEVELOPMENT } from 'src/utils/constants';
import apiTokenStrategy from './apiTokenStrategy';

passport.use(googleStrategy());
passport.use(jwtStrategy());
passport.use('embedJwt', embedJwtStrategy());
passport.use('visualBuilderJwt', visualBuilderJwtStrategy());
passport.use(emailStrategy());
passport.use('apiToken', apiTokenStrategy());

passport.serializeUser((user, done) => {
  done(null, user as User);
});
passport.deserializeUser((user, done) => {
  done(null, user as User);
});

if (IS_DEVELOPMENT) {
  passport.use('localDevGraphql', localDevGraphqlStrategy());
  passport.use('localEmbedJwt', localEmbedJwtStrategy());
}

export default passport;
