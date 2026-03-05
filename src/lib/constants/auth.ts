export const AUTH_COOKIE = "wikiguessr-auth";
export const STATE_COOKIE = "wikiguessr-oauth-state";
export const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
export const JWT_SECRET = process.env.JWT_SECRET ?? "";
export const JWT_EXPIRATION_DAYS = 30;