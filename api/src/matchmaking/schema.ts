import Joi from '@hapi/joi';

export const findPublicLobby = Joi.object({
  username: Joi.string().regex(/^[a-zA-Z0-9_]{1,29}$/).required(),
});
