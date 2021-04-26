import React from 'react';
import Head from 'next/head';

import Layout, { siteTitle } from '@/components/Layout';
import withAuthComponent from '@/components/AuthComponents/withAuth';
import withAuthServerSideProps from '@/components/AuthComponents/withAuthGSSP';
import CustomAuthForms from '@/components/CustomAuthForms';

import { signup } from '@/lib/auth';

const SignupPage = () => {
  return (
    <Layout login>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <CustomAuthForms
          forms={['username', 'password']}
          title={'Sign up'}
          submitFunction={signup}
          context={'signup'}
        />
      </section>
    </Layout>
  );
};

export default withAuthComponent(SignupPage, 'loggedIn');
export const getServerSideProps = withAuthServerSideProps();
