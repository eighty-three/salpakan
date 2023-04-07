import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';
import { render } from '@testing-library/react';

import Layout, { siteTitle } from './index';

describe('Navbar exists', () => {
  test('correct text', () => {
    const component = render(<Layout />);

    expect(component.container).toHaveTextContent(siteTitle);
  });

  test('correct link', () => {
    const { getByText } = render(<Layout />);

    expect(getByText(siteTitle).closest('a')).toHaveAttribute(
      'href', '/'
    );
  });
});


// if with Auth

//import Layout from './index';

//describe('Navbar', () => {
//test('username', () => {
//const data = { username: 'test_username' };
//const component = render(<Layout {...data} />);

//expect(component.container).toHaveTextContent(`Logged in as ${data.username}`);
//expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
//});

//test('no username', () => {
//const data = {};
//const component = render(<Layout {...data} />);

//expect(component.container).not.toHaveTextContent('Logged in as');
//expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
//});

//test('no username, login', () => {
//const data = { login: true };
//const component = render(<Layout {...data} />);

//expect(component.container).not.toHaveTextContent('Logged in as');
//expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
//});

//test('no username, home', () => {
//const data = { home: true };
//const component = render(<Layout {...data} />);

//expect(component.container).not.toHaveTextContent('Logged in as');
//expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
//});
//});

describe('children props work', () => {
  const ChildOne = () => <p>Example Child Component</p>;
  const ChildTwo = () => <p>Example ChildTwo Component</p>;

  test('one child', () => {
    const component = render(
      <Layout>
        <ChildOne />
      </Layout>
    );

    expect(component.container).toHaveTextContent(
      'Example Child Component'
    );
  });

  test('two children', () => {
    const component = render(
      <Layout>
        <ChildOne />
        <ChildTwo />
      </Layout>
    );

    expect(component.container).toHaveTextContent(
      'Example Child Component'
    );

    expect(component.container).toHaveTextContent(
      'Example ChildTwo Component'
    );
  });
});
