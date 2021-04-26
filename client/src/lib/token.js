import cookie from 'cookie';
import { verify } from 'jsonwebtoken';
import ky from 'ky-universal';
import { HOST } from '@/lib/host';
const secret = process.env.SECRET;
const api = `${HOST}/api/auth`;

const authCheck = async (ctx) => {
  const noAuth = { username: null, role: null };

  const reqCookie = ctx.req.headers.cookie;
  if (!reqCookie) return noAuth;

  const cookies = cookie.parse(reqCookie);
  const decode = async (cookies) => {
    return verify(cookies.access, secret, async (err, decoded) => {
      // If the error is due to the access token expiring
      if (err?.message === 'jwt expired') {
        const req = await getAccessToken(ctx, cookies);
        return { username: req.username, role: req.role };

      // If the access token is working
      } else if (decoded) {
        return decoded;

      // If the error is about anything else
      } else {
        ctx.res.clearCookie('access', { path: '/' });
        ctx.res.clearCookie('refresh', { path: '/' });
        return noAuth;
      }
    });
  };

  const { username, role } = await decode(cookies);
  return { username, role };
};

const getAccessToken = async (ctx, cookies) => {
  const noAuth = { username: null, role: null };

  // If there is an error with the refresh token, clear the cookies and return null
  const payload = verify(cookies.refresh, secret, (err, decoded) => (err) ? null : decoded);
  if (!payload) {
    ctx.res.clearCookie('access', { path: '/' });
    ctx.res.clearCookie('refresh', { path: '/' });
    return noAuth;
  }

  const { username, role } = payload;
  const headers = ctx.req.headers;
  const customGet = ky.create({ headers });

  try {
    // Refresh the access token
    const req = await customGet(`${api}/token`);
    const response = await req.json();

    /* Will return an error if something went wrong or if
     * the refreshToken is not up to date anymore, i.e. if
     * the user changed passwords which will change the
     * 'session' column of the user in the database.
     */
    if (response.error) {
      ctx.res.clearCookie('access', { path: '/' });
      ctx.res.clearCookie('refresh', { path: '/' });
      return noAuth;
    } else {
      ctx.res.cookie('access', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 999999999999,
        path: '/'
      });

      /* A redirect is necessary in order to make the new token
       * actually stick to the browser before page load
       */
      if (typeof window !== 'undefined') {
        window.location.reload();
      } else {
        const url = ctx.req.url || 'back';
        ctx.res.redirect(url);
      }

      return { username, role };
    }
  } catch (err) {
    ctx.res.clearCookie('access', { path: '/' });
    ctx.res.clearCookie('refresh', { path: '/' });
    return noAuth;
  }
};

export default authCheck;
