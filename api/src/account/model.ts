import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';

export const createAccount = async (
  username: string,
  hash: string,
  session: string,
  role: string
): Promise<void> => {
  const query = new PS({ name: 'create-account', text: '\
    INSERT INTO accounts (username, password, session, role)\
    VALUES ($1, $2, $3, $4)'
  });

  query.values = [username, hash, session, role];
  await db.none(query);
};

export const changePassword = async (
  username: string,
  hash: string
): Promise<void> => {
  const query = new PS({ name: 'change-password', text: '\
    UPDATE accounts SET password=$1 WHERE username=$2'
  });

  query.values = [hash, username];
  await db.none(query);
};
