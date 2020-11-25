import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import Layout, { siteTitle } from '@/components/Layout';

import MatchmakingComponent from '@/components/MatchmakingComponent';

import { lightAuthCheck } from '@/lib/authCheck';

const propTypes = {
  username: PropTypes.string
};

const Home = (props) => {
  const {
    username
  } = props;

  return (
    <Layout username={username}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <MatchmakingComponent />
      </section>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const username = await lightAuthCheck(ctx);

  return {
    props:
      {
        username
      }
  };
};

Home.propTypes = propTypes;

export default Home;
