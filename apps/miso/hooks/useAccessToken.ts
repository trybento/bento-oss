import { useState, useEffect, useCallback } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

import useClientStorage from './useClientStorage';
import { SessionRedirect } from 'helpers';

type AccessTokenData = {
  userEntityId: string;
  organizationEntityId: string | null;
  exp: number;
};

export default function useAccessToken(redirect = true) {
  const [wasAccessTokenFetched, setWasAccessTokenFetched] = useState(false);
  const [accessToken, setAccessToken, removeAccessToken] = useClientStorage(
    'accessToken',
    null
  );
  const router = useRouter();

  const redirectToLogin = useCallback(() => {
    if (
      redirect &&
      !window.location.href.includes('/login') &&
      !window.location.href.includes('/embed')
    ) {
      router.push('/login');
    }
  }, [redirect]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const accessTokenFromQuery = searchParams.get('accessToken');
    searchParams.delete('accessToken');

    setWasAccessTokenFetched(true);

    if (accessTokenFromQuery) {
      setAccessToken(accessTokenFromQuery);
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    if (!wasAccessTokenFetched) return;
    const decodedAccessToken = accessToken && jwt.decode(accessToken);

    if (!decodedAccessToken) {
      removeAccessToken();
      SessionRedirect.set(window.location.href);
      redirectToLogin();
      return;
    }

    const { userEntityId, exp: expiresSeconds } =
      decodedAccessToken as AccessTokenData;

    const isExpired =
      expiresSeconds != null && new Date(expiresSeconds * 1000) < new Date();
    if (isExpired || !userEntityId) {
      removeAccessToken();
      redirectToLogin();
      return;
    }
  }, [accessToken, wasAccessTokenFetched, setAccessToken, redirectToLogin]);

  return {
    accessToken,
    setAccessToken,
    removeAccessToken,
  };
}
