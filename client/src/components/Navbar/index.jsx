import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

import styles from './index.module.css';

import { siteTitle } from '@/components/Layout';

import { logout } from '@/lib/account';

const propTypes = {
  loggedIn: PropTypes.bool,
  redirect: PropTypes.string
};

const NavbarComponent = (props) => {
  const {
    loggedIn,
    redirect
  } = props;

  const redirectLink = (redirect)
    ? `/login?redirect=${redirect}`
    : '/login';

  return (
    <>
      <div className={styles.container}>
        <Link href='/' passHref>
          <a className={styles.title}>
            {siteTitle}
          </a>
        </Link>

        <div className={styles.loginContainer}>
          { loggedIn
            ? (
              <a href='#' onClick={logout}>Logout</a>
            ) : (
              <>
                <Link href={redirectLink} passHref>
                  <a>Login</a>
                </Link>
                <Link href={'/signup'} passHref>
                  <a>Signup</a>
                </Link>
              </>
            )
          }
        </div>
      </div>

      <div className={`${styles.bar}`}></div>
    </>
  );
};

NavbarComponent.propTypes = propTypes;

export default NavbarComponent;
