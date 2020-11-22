import * as account from './accountModel';
import { createAccount } from '../account/model';

describe('check username', () => {
  test('should fail because user doesnt exist', async () => {
    const user = await account.checkUsername('dummy');
    expect(user).toStrictEqual(null);
  });

  test('should work', async () => {
    await createAccount('dummy', '123');

    const user = await account.checkUsername('dummy');
    expect(user).toStrictEqual({ username: 'dummy' });
  });
});


describe('check password', () => {
  test('should fail because user doesnt exist', async () => {
    const user = await account.checkPassword('dummy4');
    expect(user).toStrictEqual(null);
  });

  test('should work', async () => {
    const user = await account.checkPassword('dummy');
    expect(user).toStrictEqual({ password: '123' });
  });
});
