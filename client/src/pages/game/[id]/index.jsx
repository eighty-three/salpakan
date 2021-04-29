import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import utilStyles from '@/styles/utilStyles.module.scss';
import Layout, { siteTitle } from '@/components/Layout';
import Game from '@/components/Game';
import withAuthComponent from '@/components/AuthComponents/withAuth';
import withAuthServerSideProps from '@/components/AuthComponents/withAuthGSSP';

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
  const [title, setTitle] = useState('');
  const onFocus = () => setTitle(siteTitle);

  useEffect(() => {
    if (!document.hidden) {
      setTitle(siteTitle);
    } else {
      setTitle('Match found!');
    }

    document.addEventListener('visibilitychange', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onFocus);
    };
  });

  return (
    <Layout username={username} >
      <Head>
        <title>{title}</title>
      </Head>
      <section>
        { !state.error
          ? (<Game id={id} state={state} />)
          : (<h1 className={utilStyles.textCenter}>Game not found</h1>)
        }
      </section>
    </Layout>
  );
};

export const getServerSideProps = withAuthServerSideProps(async ({
  ctx,
  username,
  cookieValue
}) => {
  const id = ctx.params.id;
  const state = await getGame(id);

  return {
    props:
      {
        username,
        cookieValue,
        id,
        state
      }
  };
});

GamePage.propTypes = propTypes;
export default withAuthComponent(GamePage);
