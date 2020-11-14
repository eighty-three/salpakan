import transForm from './transForm';

test('test function', () => {
  expect(transForm('username')).toStrictEqual({ id: 'username', label: 'Username', username: true });
  expect(transForm('newUsername')).toStrictEqual({ id: 'newUsername', label: 'New Username', username: true });
  expect(transForm('password')).toStrictEqual({ id: 'password', label: 'Password', username: false });
  expect(transForm('newPassword')).toStrictEqual({ id: 'newPassword', label: 'New Password', username: false });
});
