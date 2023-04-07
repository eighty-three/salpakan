import Joi from '@hapi/joi';

export const getGame = Joi.object({
  id: Joi.string().regex(/^[a-zA-Z0-9-_]{10}$/).required()
});
