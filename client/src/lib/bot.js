import Router from 'next/router';
import ky from 'ky-universal';
import { HOST, WS_HOST } from '@/lib/host';
const api = `${HOST}/api/bot`;

export const WSBOT_URL = `${WS_HOST}/ws/bot`;

export const createBotGame = async () => {
  try {
    const req = ky.get(`${api}/create`);
    const response = await req.json();

    if (response.error) {
      return response;
    } else {
      Router.push(`/game/${response.roomName}`);
    }
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};
