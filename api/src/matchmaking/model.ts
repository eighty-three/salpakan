import { redisClient, PLAYER_POOL_LIST_NAME } from 'utils/db';
import * as errors from 'utils/error';
/**
 *
 * @param username username of the player looking for a match.
 */
export const addToPlayerPool = async (
  username: string,
): Promise<boolean> => {
  return redisClient.LPUSH(PLAYER_POOL_LIST_NAME, username);
};

export const getPlayerPooList = async (): Promise<errors.Result<string[]>> => {
  let playerPoolLength  = 0;
  redisClient.llen(PLAYER_POOL_LIST_NAME, (err, result) => {
    if (err) {
      return { type: errors.ERROR, error: err };
    }
    playerPoolLength = result;
  });

  redisClient.LRANGE(PLAYER_POOL_LIST_NAME, 0, playerPoolLength, (err, result)=> {
    if (err) {
      return { type: errors.ERROR, error: err };
    }

    return  { type: 'success' , value: result };
  });

  return { type: 'success' , value: [] };
};