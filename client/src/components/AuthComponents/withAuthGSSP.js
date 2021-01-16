import { authCheck } from '@/lib/authCheck';

const withAuthServerSideProps = (getServerSidePropsFunc) => {
  return async (ctx) => {
    const cookieValue = await authCheck(ctx);
    const username = (cookieValue && cookieValue[1] !== '=') ? cookieValue : null;

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
