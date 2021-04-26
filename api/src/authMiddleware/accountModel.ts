import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';

export const checkPassword = async (
  username: string
): Promise<{ password: string } | null> => {
  const query = new PS({ name: 'check-password', text: '\
    SELECT password FROM accounts WHERE username=$1'
  });

  query.values = [username];
  return await db.oneOrNone(query);
};
