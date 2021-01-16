import React, { useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import Layout, { siteTitle } from '@/components/Layout';

import MatchmakingComponent from '@/components/MatchmakingComponent';

import { lightAuthCheck } from '@/lib/authCheck';
import { getCookie } from '@/lib/account';

const propTypes = {
  username: PropTypes.string,
  userId: PropTypes.string
};

const Home = (props) => {
  const {
    username,
    userId
  } = props;

  useEffect(() => {
    if (!userId) {
      const setCookie = async () => {
        await getCookie();
      };

      setCookie();
    }
  }, []);


  return (
    <Layout username={username}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <MatchmakingComponent username={username} />
      </section>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const userId = await lightAuthCheck(ctx);
  const username = (userId && userId[1] !== '=') ? userId : null;

  return {
    props:
      {
        username,
        userId
      }
  };
};

Home.propTypes = propTypes;

export default Home;
