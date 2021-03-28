import './config/passport';
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import utilRoutes from './routes/utils';
import reportRoutes from './routes/reports';
import initLogger from './config/logger';
import db from './config/database';
import userRoutes from './routes/users';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());

const logger = initLogger('index');

app.use(morgan('dev'));

app.use(express.urlencoded({extended: true}));

app.use('/user', userRoutes);
app.use('/utils', utilRoutes);
app.use('/report', reportRoutes);

db.then(async () => {
    logger.info('Successfully Connected to MongoDB');
}).catch((err) => logger.error(`Cannot connect to MongoDB: ${err}`));

app.listen(port, () => {
    logger.info(`Ready on port ${port}`);
});
