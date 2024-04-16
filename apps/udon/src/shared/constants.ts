import { Request } from 'express';

export interface IRequest extends Request {
  body: {};
}

export const JWT_SECRET = process.env.JWT_SECRET!;
export const BASE_CLIENT_URL = process.env.BASE_CLIENT_URL!;
export const BASE_SERVER_URL =
  process.env.BASE_SERVER_URL || 'http://localhost:8081';
export const LOGIN_URL = `${BASE_CLIENT_URL}/login`;
export const INVALID_LOGIN_URL = `${LOGIN_URL}?isInvalid=true`;
export const SIGNUP_URL = `${BASE_CLIENT_URL}/start-trial`;
export const GOOGLE_LOGIN_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || 'http://callback.url';
export const GOOGLE_SIGNUP_CALLBACK_URL = `${GOOGLE_LOGIN_CALLBACK_URL}/signup`;
export const BENTO_DOMAIN = 'trybento.co';

export const BODY_SIZE_LIMIT = '250kb';
