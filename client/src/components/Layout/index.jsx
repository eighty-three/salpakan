import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from './index.module.css';

import NavbarComponent from '@/components/Navbar';

export const siteTitle = 'Salpakan';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]),
  username: PropTypes.string,
  redirect: PropTypes.string
};

const Layout = (props) => {
  const {
    children,
    username,
    redirect
  } = props;

  const loggedIn = (username) ? true : false;

  return (
    <div className={styles.container}>
      {/* Meta Tags */}
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content={siteTitle}
        />
      </Head>

      {/* Contents */}
      <main>
        <NavbarComponent loggedIn={loggedIn} redirect={redirect} />
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = propTypes;

export default Layout;
