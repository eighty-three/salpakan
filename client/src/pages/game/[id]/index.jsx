import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Layout, { siteTitle } from '@/components/Layout';
import Game from '@/components/Game';

import { lightAuthCheck } from '@/lib/authCheck';
import { getGame } from '@/lib/game';

const propTypes = {
  username: PropTypes.string,
  id: PropTypes.string,
  state: PropTypes.object
};

const GamePage = (props) => {
  const {
    username,
    id,
    state
  } = props;

  return (
    <Layout username={username} >
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        { !state.error
          ? (<Game id={id} state={state} />)
          : (<h1>Game not found</h1>)
        }
      </section>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const username = await lightAuthCheck(ctx);
  const id = ctx.params.id;
  const state = await getGame(id);

  return {
    props:
      {
        username,
        id,
        state
      }
  };
};

GamePage.propTypes = propTypes;

export default GamePage;
