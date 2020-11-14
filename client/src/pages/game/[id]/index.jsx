import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Layout, { siteTitle } from '@/components/Layout';
import { lightAuthCheck } from '@/lib/authCheck';

const propTypes = {
  username: PropTypes.string,
  id: PropTypes.string
};

const GamePage = (props) => {
  const {
    username,
    id
  } = props;

  return (
    <Layout username={username} >
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <h1>{username}</h1>
        <h1>{id}</h1>
      </section>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const username = await lightAuthCheck(ctx);
  const id = ctx.params.id;

  return {
    props: 
      {
        username,
        id
      }
  };
};

GamePage.propTypes = propTypes;

export default GamePage;
