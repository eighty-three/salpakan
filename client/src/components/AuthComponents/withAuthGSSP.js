import { authCheck } from '@/lib/authCheck';

const withAuthServerSideProps = (getServerSidePropsFunc) => {
  return async (ctx) => {
    const userId = await authCheck(ctx);
    const username = (userId && userId[1] !== '=') ? userId : null;

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
