import React from 'react';
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
        <a href="/" className={styles.title}>
          {siteTitle}
        </a>

        <div className={styles.loginContainer}>
          { loggedIn
            ? (
              <a href='#' onClick={logout}>Logout</a>
            ) : (
              <>
                <a href={redirectLink} >Login</a>
                <a href="/signup">Signup</a>
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
