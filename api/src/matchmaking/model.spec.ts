import { createAccount } from './model';
import * as authAccount from '@authMiddleware/accountModel';

describe('create account', () => {
  test('should always work because the checks/validations are done beforehand', async () => {
    expect(await authAccount.checkUsername('dummy')).toBe(null);

    await createAccount('dummy', 'password123');

    const check = await authAccount.checkUsername('dummy');
    expect(check).toStrictEqual({ username: 'dummy' });
  });
});
