import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Router, { useRouter } from 'next/router';

const RedirectComponentPropTypes = {
  redirectAction: PropTypes.string
};

const RedirectComponent = ({ redirectAction }) => {
  const [redirectState, setRedirectState] = useState({ newPath: null, text: null });
  const prevPath = useRouter().pathname;

  useEffect(() => {
    switch (redirectAction) {
      case 'loggedIn': {
        setRedirectState({ newPath: '/', text: 'Already logged in' });
        break;
      }

      case 'notAuthorized': {
        setRedirectState({ newPath: '/', text: 'Not authorized' });
        break;
      }

      case 'notAuthenticated': {
        setRedirectState({ newPath: `/login?redirect=${prevPath}`, text: 'Not authenticated' });
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (redirectState.newPath) Router.replace(redirectState.newPath);
  }, [redirectState.newPath]);

  return (
    <h1>{redirectState.text}</h1>
  );
};

RedirectComponent.propTypes = RedirectComponentPropTypes;

const withAuthComponent = (Component, redirectAction, allowedRoles) => {
  const Authenticated = ({ username, role, data }) => {
    if (redirectAction === 'loggedIn') {
      // if user is already logged in
      if (username) return <RedirectComponent redirectAction={'loggedIn'} />;

    } else if (redirectAction === 'protectRoute') {
      // if payload has no username or role
      if (!username || !role) return <RedirectComponent redirectAction={'notAuthenticated'} />;

      // if payload has username and role but user doesn't have the required role
      if (!allowedRoles.includes(role)) return <RedirectComponent redirectAction={'notAuthorized'} />;
    }

    return <Component {...data.props}/>;
  };

  Authenticated.propTypes = {
    username: PropTypes.string,
    role: PropTypes.string,
    data: PropTypes.shape({
      props: PropTypes.any
    })
  };

  return Authenticated;
};

export default withAuthComponent;
