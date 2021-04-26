import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from './guide.module.scss';

import Layout, { siteTitle } from '@/components/Layout';
import withAuthServerSideProps from '@/components/AuthComponents/withAuthGSSP';

const propTypes = {
  username: PropTypes.string
};

const Guide = (props) => {
  const {
    username
  } = props;

  const pieces = ['flag', 'private', 'sergeant', 'lt2', 'major', 'gen1', 'spy'];

  return (
    <Layout username={username}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <div className={styles.container}>
          <h1 className={`${styles.category} ${styles.noMargin}`}>Ways to win:</h1>
          <ul className={`${styles.noMargin} ${styles.list}`}>
            <li>Capture the enemy flag</li>
            <li>Get your own flag to the last row (and stay there for one turn)</li>
          </ul>

          <h1 className={`${styles.category} ${styles.noMargin}`}>About the pieces:</h1>
          <ul className={`${styles.noMargin} ${styles.list}`}>
            <li>The spy is stronger than any other piece except the private</li>
            <li>The private is weaker than any other piece except the spy and the flag</li>
            <li>The flag is weaker than any other piece except when attacking the enemy flag</li>
            <li>Stars &gt; Spokes* &gt; Triangles &gt; Sergeant</li>
            <li>The piece can only move one vertical or horizontal step at a time</li>
            <li>If the pieces are equal, they both get destroyed (except with flags)</li>
          </ul>
          <span>*Not a virus</span>

          <div className={styles.piecesContainer}>
            {pieces.map((key) => {
              const pieceStyle = styles[key];

              return (
                <div key={key} className={styles.pieceInfoContainer}>
                  <div className={`${pieceStyle} ${styles.pieceInfo}`}></div>
                  <div className={styles.pieceInfo}>{key}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const getServerSideProps = withAuthServerSideProps();

Guide.propTypes = propTypes;
export default Guide;
