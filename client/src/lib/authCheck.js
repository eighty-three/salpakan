import ky from 'ky-universal';
import cookie from 'cookie';
import { verify } from 'jsonwebtoken';

import Router from 'next/router';

import HOST from '@/lib/host';

const api = `${HOST}/api`;

const secret = process.env.SECRET;

export const authCheck = async (ctx) => {
  const reqCookie = ctx.req.headers.cookie;
  if (!reqCookie) return null; //No token

  const cookies = cookie.parse(reqCookie);
  const payload = verify(cookies.auth, secret);
  if (!payload) return null; //Invalid token

  const { username } = payload;
  const headers = ctx.req.headers;
  const customPost = ky.create({ headers });

  try {  
    const req = await customPost.post(`${api}/verify`, { json: { username }, throwHttpErrors: false });
    const response = await req.json();

    if (response.error) {
      ctx.res.clearCookie('auth', { path: '/' });
      if (typeof window !== 'undefined') Router.push('/login');
    }

  } catch (err) {
    ctx.res.clearCookie('auth', { path: '/' });
    if (typeof window !== 'undefined') Router.push('/login');
  }

  return username;
};

export const lightAuthCheck = async (ctx) => {
  const reqCookie = ctx.req.headers.cookie;
  if (!reqCookie) return null; // No token

  const cookies = cookie.parse(reqCookie);
  const payload = verify(cookies.auth, secret);
  if (!payload) return null; // Invalid token

  const { username } = payload;
  return username;
};
