import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from './index.module.css';

import Layout, { siteTitle } from '@/components/Layout';

import FindMatch from '@/components/FindMatch';
import CreatePrivateLobby from '@/components/CreatePrivateLobby';

import { lightAuthCheck } from '@/lib/authCheck';
import useCookie from '@/lib/useCookie';

import { WS_HOST } from '@/lib/host';
import ws from 'ws';
const WS = global.WebSocket || ws;

const propTypes = {
  username: PropTypes.string,
  cookieValue: PropTypes.string
};

const Home = (props) => {
  const {
    username,
    cookieValue
  } = props;

  const [users, setUsers] = useState(0);
  const timeOut = useRef(null);

  useCookie(cookieValue);

  useEffect(() => {
    let socketRecord;
    socketRecord = new WS(`${WS_HOST}/ws/count`);

    socketRecord.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      setUsers(data.message);

      // Reset the previous delay
      clearTimeout(timeOut.current);

      // Send back a 'ping' after 20 seconds
      const delay = () => new Promise(resolve => {
        timeOut.current = setTimeout(resolve, 20000);
      });

      await delay();
      socketRecord.send(JSON.stringify({ message: 'ping' }));
    };

    return () => {
      socketRecord.close();
      clearTimeout(timeOut.current);
    };

  }, []);

  return (
    <Layout username={username}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>
        <div className={styles.countContainer}>
          {(users !== 0) &&
            <div className={styles.count}> CURRENT USERS: <span>{users}</span> </div>
          }
        </div>

        <FindMatch />
        <CreatePrivateLobby cookieValue={cookieValue} />
      </section>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const cookieValue = await lightAuthCheck(ctx);
  const username = (cookieValue && cookieValue[1] !== '=') ? cookieValue : null;

  return {
    props:
      {
        username,
        cookieValue
      }
  };
};

Home.propTypes = propTypes;

export default Home;
