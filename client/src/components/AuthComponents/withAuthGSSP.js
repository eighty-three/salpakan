import { authCheck } from '@/lib/authCheck';

const withAuthServerSideProps = (getServerSidePropsFunc, protect) => {
  return async (ctx) => {
    const cookieValue = await authCheck(ctx);
    const username = (cookieValue && cookieValue[1] !== '=') ? cookieValue : null;

    if (protect ? (getServerSidePropsFunc && username) : getServerSidePropsFunc) {
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
