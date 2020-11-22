import config from '@utils/config';
import express from 'express';
import cors from 'cors';
const app = express();


//Middleware
import middleware from '@utils/middleware';

//utils
import {getLoggerInstance} from '@utils/logger';

const logger = getLoggerInstance();
logger.info('connecting to', config.DB_CONNECTION);

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

//Routes
import router from './router';
app.use('/api', router);

//Error handler
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
