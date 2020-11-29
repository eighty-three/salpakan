import Joi from '@hapi/joi';

export const getGame = Joi.object({
  name: Joi.string().regex(/^[a-zA-Z0-9]{10}$/).required()
});
