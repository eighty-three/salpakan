import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from '@/components/Buttons.module.scss';
import Layout, { siteTitle } from '@/components/Layout';

import useCookie from '@/hooks/useCookie';
import { lightAuthCheck } from '@/lib/authCheck';

import { getLobby, WSLOBBY_URL}  from '@/lib/lobby';
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

  const waitingText = 'The first person to enter this lobby will be your opponent';
  const [text, setText] = useState('');

  /* Initial state is 'true' so that the button doesn't show.
   * It will be set to false if the socket can't connect,
   * making the button show up
   */
  const [isConnected, setConnection] = useState(true);
  const [buttonState, setButtonState] = useState({
    disabled: true,
    text: 'Join Lobby'
  });

  useCookie(cookieValue);

  // try to connect to the WS server if the user has a cookieValue
  useEffect(() => {
    let socket;
    if (cookieValue) {
      socket = new WS(`${WSLOBBY_URL}/${lobbyId}`);

      socket.onopen = () => {
        setText(waitingText);
      };

      socket.onmessage = (message) => {
        setText('Redirecting...');
        socket.close();

        const data = message.data;

        Router.push(`/game/${data}`);
      };
    } else {
      setConnection(false);
    }

    return () => {
      if (cookieValue) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    setButtonState({disabled: false, text: buttonState.text});
  }, []);

  /* Otherwise, join the lobby manually.
   *
   * It's a workaround because with the useCookie function, while it
   * rerenders the component to get the cookie, I think the cookie
   * doesn't get "loaded" to the page during useEffect's run, making
   * it essentially useless for trying to connect the socket ASAP.
   */
  const onClickFn = () => {
    setButtonState({ disabled: true, text: 'Joining...' });

    const socket = new WS(`${WSLOBBY_URL}/${lobbyId}`);

    socket.onmessage = async (message) => {
      setText('Redirecting...');
      setConnection(true);
      socket.close();

      const data = message.data;

      Router.push(`/game/${data}`);
    };

    socket.onerror = () => {
      setButtonState({ disabled: true , text: 'Please refresh and try again' });
    };
  };

  return (
    <Layout username={username} >
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>
        { lobbyFound
          ? (<h1>{text}</h1>)
          : (<h1>Lobby not found</h1>)
        }

        {/* Only show the button if there's a lobby found
          * and if the socket is not connected. It prevents
          * the button from showing when there's no actual
          * lobby and if the user is already connected (so
          * he doesn't have to join
          */}
        {(isConnected === false) && lobbyFound &&
          <button
            onClick={onClickFn}
            disabled={buttonState.disabled}
            className={`${styles.button} ${styles.l}`}
          >
            {buttonState.text}
          </button>
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
