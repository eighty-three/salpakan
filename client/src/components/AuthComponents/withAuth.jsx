import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Router, { useRouter } from 'next/router';

const RedirectComponentPropTypes = {
  loggedIn: PropTypes.bool,
  protectRoute: PropTypes.bool
};

const RedirectComponent = ({ loggedIn, protectRoute }) => {
  useEffect(() => {
    Router.replace(newPath);
  }, []);

  const prevPath = useRouter().pathname;
  let newPath, loadingText;

  if (loggedIn) {
    newPath = '/';
    loadingText = 'Already logged in';
  } else if (protectRoute) {
    newPath = `/login?redirect=${prevPath}`;
    loadingText = 'Not authenticated';
  }

  return (
    <h1 className="text-center">{loadingText}</h1>
  );
};

RedirectComponent.propTypes = RedirectComponentPropTypes;

const withAuthComponent = (Component, redirectAction) => {
  const Authenticated = ({ username, data }) => {
    if (redirectAction === 'loggedIn' && username) {
      return <RedirectComponent loggedIn/>;
    } else if (!username) {
      if (redirectAction === 'protectRoute') {
        return <RedirectComponent protectRoute/>;
      }
    }

    return <Component {...data.props}/>;
  };

  Authenticated.propTypes = {
    username: PropTypes.string,
    data: PropTypes.shape({
      props: PropTypes.any
    })
  };

  return Authenticated;
};

export default withAuthComponent;
