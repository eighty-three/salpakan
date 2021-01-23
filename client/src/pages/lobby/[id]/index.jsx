import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';

import Layout, { siteTitle } from '@/components/Layout';

import { lightAuthCheck } from '@/lib/authCheck';
import { getLobby, WSLOBBY_URL}  from '@/lib/lobby';
import { getCookie } from '@/lib/account';
import ws from 'ws';
const WS = global.WebSocket || ws;

const propTypes = {
  username: PropTypes.string,
  cookieValue: PropTypes.string,
  lobbyId: PropTypes.string,
  lobbyFound: PropTypes.bool
};

const LobbyPage = (props) => {
  const {
    username,
    cookieValue,
    lobbyId,
    lobbyFound
  } = props;

  const initialText = 'The first person to enter this lobby will be your opponent';
  const [ text, setText ] = useState(initialText);

  useEffect(() => {
    if (!cookieValue) {
      const setCookie = async () => {
        await getCookie();
      };

      setCookie();
    }
  }, []);

  useEffect(() => {
    const socket = new WS(`${WSLOBBY_URL}/${lobbyId}`);

    socket.onmessage = (message) => {
      setText('Redirecting...');
      socket.close();

      const data = message.data;

      Router.push(`/game/${data}`);
    };

    return () => socket.close();
  }, []);

  return (
    <Layout username={username} >
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        { lobbyFound
          ? (<h1>{text}</h1>)
          : (<h1>Lobby not found</h1>)
        }
      </section>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const cookieValue = await lightAuthCheck(ctx);
  const username = (cookieValue && cookieValue[1] !== '=') ? cookieValue : null;

  const lobbyId = ctx.params.id;
  const lobbyFound = await getLobby(lobbyId);

  return {
    props:
      {
        username,
        cookieValue,
        lobbyId,
        lobbyFound
      }
  };
};

LobbyPage.propTypes = propTypes;

export default LobbyPage;
