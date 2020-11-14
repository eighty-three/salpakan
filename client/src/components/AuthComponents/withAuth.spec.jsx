/* eslint no-import-assign: 0 */  // --> OFF
/* eslint react/prop-types: 0 */  // --> OFF

import * as React from 'react';
import * as Router from 'next/router';

import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import 'mutationobserver-shim';
global.MutationObserver = window.MutationObserver;

import { render, screen } from '@testing-library/react';

import withAuthComponent from './withAuth';
const TestComponent = ({ someProp }) => <p>Testing, data is {someProp}</p>;

describe('renders', () => {
  React.useEffect = jest.fn().mockReturnValue(() => console.log(null));
  Router.useRouter = jest.fn().mockReturnValue({ pathname: null });

  const username = 'test_username';
  const someProp = 'testing_prop';

  test('with username, protectRoute', async () => {
    // The data is supposed to be passed to the Auth Component via getServerSideProps
    // To simulate the process, currying is used
    const data = { username, data: { props: { someProp } } };
    const response = await withAuthComponent(TestComponent, 'protectRoute')(data);
    render(response);

    expect(screen.getByText(`Testing, data is ${someProp}`)).toBeInTheDocument();
    expect(screen.queryByText('Not authenticated')).not.toBeInTheDocument();
    expect(screen.queryByText('Already logged in')).not.toBeInTheDocument();
  });

  test('with username, loggedIn', async () => {
    const data = { username, data: { props: { someProp } } };
    const response = await withAuthComponent(TestComponent, 'loggedIn')(data);
    render(response);

    expect(screen.queryByText(`Testing, data is ${someProp}`)).not.toBeInTheDocument();
    expect(screen.queryByText('Not authenticated')).not.toBeInTheDocument();
    expect(screen.getByText('Already logged in')).toBeInTheDocument();
  });

  test('no username, protectRoute', async () => {
    const data = { data: { props: { someProp } } };
    const response = await withAuthComponent(TestComponent, 'protectRoute')(data);
    render(response);

    expect(screen.queryByText(`Testing, data is ${someProp}`)).not.toBeInTheDocument();
    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    expect(screen.queryByText('Already logged in')).not.toBeInTheDocument();
  });

  test('no username, loggedIn', async () => {
    const data = { data: { props: { someProp } } };
    const response = await withAuthComponent(TestComponent, 'loggedIn')(data);
    render(response);

    expect(screen.getByText(`Testing, data is ${someProp}`)).toBeInTheDocument();
    expect(screen.queryByText('Not authenticated')).not.toBeInTheDocument();
    expect(screen.queryByText('Already logged in')).not.toBeInTheDocument();
  });
});
