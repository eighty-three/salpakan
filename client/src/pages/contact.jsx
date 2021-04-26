import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from './contact.module.scss';

import Layout, { siteTitle } from '@/components/Layout';
import withAuthServerSideProps from '@/components/AuthComponents/withAuthGSSP';

const propTypes = {
  username: PropTypes.string
};

const Contact = (props) => {
  const {
    username
  } = props;

  return (
    <Layout username={username}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <ul className={styles.list}>
          <li>Email:{' '}
            <a className={styles.link} href="mailto:contact@eighty-three.dev">
              contact@eighty-three.dev
            </a>
          </li>
          <li>Twitter:{' '}
            <a className={styles.link} href={'https://twitter.com/salpakanxyz'}>
              @salpakanxyz
            </a>
          </li>
          <li>Reddit:{' '}
            <a className={styles.link} href={'https://reddit.com/r/salpakanxyz'}>
              /r/salpakanxyz
            </a>
          </li>
        </ul>
      </section>
    </Layout>
  );
};

export const getServerSideProps = withAuthServerSideProps();

Contact.propTypes = propTypes;
export default Contact;
