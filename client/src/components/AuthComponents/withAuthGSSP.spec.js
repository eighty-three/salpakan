/* eslint no-import-assign: 0 */  // --> OFF

import withAuthServerSideProps from './withAuthGSSP';
import * as auth from '@/lib/authCheck';

describe('returns correct value', () => {
  const returnedValue = 'value';
  const testFn = (ctx, username) => `${username} test`;

  test('with username, GSSP', async () => {
    auth.authCheck = jest.fn().mockReturnValueOnce(returnedValue);
    const response = await withAuthServerSideProps(testFn)();

    expect(response).toStrictEqual({ props: { username: returnedValue, data: testFn(null, returnedValue) } });
  });

  test('with username, no GSSP', async () => {
    auth.authCheck = jest.fn().mockReturnValueOnce(returnedValue);
    const response = await withAuthServerSideProps()();

    expect(response).toStrictEqual({ props: { data: {props: { username: returnedValue }}, username: returnedValue } });
  });

  test('with no username, GSSP', async () => {
    auth.authCheck = jest.fn().mockReturnValueOnce(null);
    const response = await withAuthServerSideProps(testFn)();

    expect(response).toStrictEqual({ props: { username: null, data: testFn(null, null) } });
  });

  test('with no username, no GSSP', async () => {
    auth.authCheck = jest.fn().mockReturnValueOnce(null);
    const response = await withAuthServerSideProps()();

    expect(response).toStrictEqual({ props: { data: {props: { username: null }}, username: null } });
  });
});
