import { authCheck } from '@/lib/authCheck';

const withAuthServerSideProps = (getServerSidePropsFunc) => {
  return async (ctx) => {
    const username = await authCheck(ctx);
    if (getServerSidePropsFunc) {
      return {
        props: 
          {
            username,
            data: await getServerSidePropsFunc(ctx, username)
          }
      };
    }

    return {
      props: 
        {
          username,
          data: 
            {
              props: 
                {
                  username
                }
            }
        }
    };
  };
};

export default withAuthServerSideProps;
