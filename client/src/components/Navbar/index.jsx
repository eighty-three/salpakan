import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';

import { siteTitle } from '@/components/Layout';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
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
      <Navbar>
        <Navbar.Text>
          <a href="/" className={`${styles.title}`}>
            {siteTitle}
          </a>
        </Navbar.Text>

        <Nav className={`${styles.loginContainer}`}>
          { loggedIn
            ? (
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link href={redirectLink} >Login</Nav.Link>
                <Nav.Link href="/signup">Signup</Nav.Link>
              </>
            )
          }
        </Nav>
      </Navbar>

      <div className={`${styles.bar}`}></div>
    </>
  );
};

NavbarComponent.propTypes = propTypes;

export default NavbarComponent;
