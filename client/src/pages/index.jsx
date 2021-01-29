import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from './index.module.css';

import Layout, { siteTitle } from '@/components/Layout';

import FindMatch from '@/components/FindMatch';
import CreatePrivateLobby from '@/components/CreatePrivateLobby';

import { lightAuthCheck } from '@/lib/authCheck';
import { getCookie } from '@/lib/account';

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

  useEffect(() => {
    if (!cookieValue) {
      const setCookie = async () => {
        await getCookie();
      };

      setCookie();
    }
  }, []);

  useEffect(() => {
    let socketRecord;
    socketRecord = new WS(`${WS_HOST}/ws/count`);
    socketRecord.onmessage = (message) => {
      const count = JSON.parse(message.data);
      setUsers(count);
    };

    return () => {
      socketRecord.close();
    };
  }, []);

  return (
    <Layout username={username}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>

        <div className={styles.count}> CURRENT USERS: <span>{users}</span> </div>

        <FindMatch />
        <CreatePrivateLobby cookieValue={cookieValue} />

        <div className={styles.contact}>
          Email:{' '}
          <a className={styles.link} href="mailto:contact@eighty-three.dev">
            contact@eighty-three.dev
          </a>
        </div>

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
