import { Request, Response, NextFunction } from 'express';
import { errorResponse } from './validator.types';

const validator = (schema: any, property: keyof Request) => {
  return (req: Request, res: Response, next: NextFunction): void | errorResponse => {
    const { error } = schema.validate(req[property]);
    if (error == null) {
      next();
    } else {
      res.status(400).json({ error: 'Bad Request', statusCode: 400 });
    }
  };
};

export default validator;
