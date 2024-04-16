import { SessionRedirect } from 'helpers';
import { AttributesProviderQuery } from 'relay-types/AttributesProviderQuery.graphql';
import { LoggedInUserProviderQuery } from 'relay-types/LoggedInUserProviderQuery.graphql';
import { UsersProviderQuery } from 'relay-types/UsersProviderQuery.graphql';
import { checkStorage } from '../hooks/useClientStorage';

/**
 * App Wrapper mounts and unmounts and loses refs and states so we store it outside
 *   Likewise relay network-or-store still creates moments where there is no data, so
 *   having it managed here prevents rendering being blocked
 */
class UserCache {
  loggedInUserResponse: LoggedInUserProviderQuery['response'];
  attributesResponse: AttributesProviderQuery['response'];
  usersResponse: UsersProviderQuery['response'];

  /** Handler for when a user first gets their login information */
  setLoggedInUserResponse = (res: LoggedInUserProviderQuery['response']) => {
    this.loggedInUserResponse = res;
    // We may want to invalidate this in time for safety

    const { organization, entityId } = res.loggedInUser;

    if (checkStorage('sessionStorage')) {
      sessionStorage.setItem('userEntityId', entityId);
      sessionStorage.setItem('organizationEntityId', organization.entityId);
    }

    SessionRedirect.call();
  };

  getLoggedInUserResponse = () => {
    return this.loggedInUserResponse;
  };

  getUserAndOrgEntityIds = () => {
    const canAccessSessionStorage = checkStorage('sessionStorage');

    return {
      userEntityId:
        this.loggedInUserResponse?.loggedInUser?.entityId ||
        (canAccessSessionStorage && sessionStorage.getItem('userEntityId')),
      organizationEntityId:
        this.loggedInUserResponse?.loggedInUser?.organization?.entityId ||
        (canAccessSessionStorage &&
          sessionStorage.getItem('organizationEntityId')),
    };
  };

  setAttributesResponse = (res: AttributesProviderQuery['response']) => {
    this.attributesResponse = res;
  };

  getAttributesResponse = () => {
    return this.attributesResponse;
  };

  setUsersResponse = (res: UsersProviderQuery['response']) => {
    this.usersResponse = res;
  };

  getUsersResponse = () => {
    return this.usersResponse;
  };

  invalidateUser = () => {
    this.loggedInUserResponse = undefined;
  };
}

export default new UserCache();
