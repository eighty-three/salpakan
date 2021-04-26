import Joi from '@hapi/joi';

export const login = Joi.object({
  username: Joi.string().regex(/^[a-zA-Z0-9_]{1,29}$/).required(),
  password: Joi.string().min(1).max(200).required()
});

export const signup = Joi.object({
  username: Joi.string().regex(/^[a-zA-Z0-9_]{1,29}$/).required(),
  password: Joi.string().min(1).max(200).required()
});

export const logout = Joi.object({
  message: Joi.string().valid('Log out').required()
});
