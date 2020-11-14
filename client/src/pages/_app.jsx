import '@/styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

//NProgress
import NProgress from 'nprogress';
import '@/styles/nprogress.css';
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object
};

const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

App.propTypes = propTypes;

export default App;
