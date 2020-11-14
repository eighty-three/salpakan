import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';

export const checkUsername = async (
  username: string
): Promise<{ username: string } | null> => {
  const query = new PS({ name: 'check-username', text: '\
    SELECT username FROM accounts WHERE username=$1'
  });

  query.values = [username];
  return await db.oneOrNone(query);
};

export const checkPassword = async (
  username: string
): Promise<{ password: string } | null> => {
  const query = new PS({ name: 'check-password', text: '\
    SELECT password FROM accounts WHERE username=$1'
  });

  query.values = [username];
  return await db.oneOrNone(query);
};
