import authCheck from '@/lib/token';

const withAuthServerSideProps = (getServerSidePropsFunc, protect) => {
  return async (ctx) => {
    const { username: cookieValue, role } = await authCheck(ctx);
    const username = (cookieValue && cookieValue[1] !== '=') ? cookieValue : null;

    if (protect ? (getServerSidePropsFunc && username) : getServerSidePropsFunc) {
      return {
        props:
          {
            username,
            role,
            cookieValue,
            data: await getServerSidePropsFunc({ ctx, username, role, cookieValue })
          }
      };
    }

    return {
      props:
        {
          username,
          role,
          cookieValue,
          data:
            {
              props:
                {
                  username,
                  role,
                  cookieValue
                }
            }
        }
    };
  };
};

export default withAuthServerSideProps;
