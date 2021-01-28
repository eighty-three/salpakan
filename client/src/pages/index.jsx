import React, { useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from './index.module.css';

import Layout, { siteTitle } from '@/components/Layout';

import FindMatch from '@/components/FindMatch';
import CreatePrivateLobby from '@/components/CreatePrivateLobby';

import { lightAuthCheck } from '@/lib/authCheck';
import { getCookie } from '@/lib/account';

const propTypes = {
  username: PropTypes.string,
  cookieValue: PropTypes.string
};

const Home = (props) => {
  const {
    username,
    cookieValue
  } = props;

  useEffect(() => {
    if (!cookieValue) {
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
      <section className={styles.container}>
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
