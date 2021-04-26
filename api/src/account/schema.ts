import Joi from '@hapi/joi';

export const changePassword = Joi.object({
  username: Joi.string().regex(/^[a-zA-Z0-9_]{1,29}$/).required(),
  password: Joi.string().min(1).max(200).required(),
  newPassword: Joi.string().min(1).max(200).required()
});
