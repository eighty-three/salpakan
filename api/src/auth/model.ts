import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';
import { ISession } from './types';

export const getSession = async (
  username: string
): Promise<ISession> => {
  const query = new PS({ name: 'get-session', text: '\
    SELECT role, session FROM accounts\
    WHERE username=$1'
  });

  query.values = [username];
  return await db.one(query);
};

export const setSession = async (
  username: string,
  session: string
): Promise<void> => {
  const query = new PS({ name: 'set-session', text: '\
    UPDATE accounts SET session=$2\
    WHERE username=$1'
  });

  query.values = [username, session];
  await db.none(query);
};
