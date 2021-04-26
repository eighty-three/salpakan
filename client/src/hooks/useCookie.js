import { useEffect } from 'react';
import ky from 'ky-universal';
import { HOST } from '@/lib/host';
const api = `${HOST}/api/auth`;

const getCookie = async () => {
  await ky.get(`${api}/cookie`);
};

const useCookie = (cookieValue) => {
  useEffect(() => {
    if (!cookieValue) {
      const setCookie = async () => {
        await getCookie();
      };

      setCookie();
    }
  }, []);
};

export default useCookie;
