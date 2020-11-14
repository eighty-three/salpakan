import Router from 'next/router';
import ky from 'ky-universal';
import HOST from '@/lib/host';
const api = `${HOST}/api/match`;

export const find = async (username) => {
  try {
    const req = await ky.post(`${api}/find`, { json: { username }, throwHttpErrors: false });
    const response = await req.json();
          
    if (response.error) {
      return response;
    } else {
      Router.replace(`/game/${response}`);
    }
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};
