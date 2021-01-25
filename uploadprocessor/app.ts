import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import CommandRouter from './routes/command';

const app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/command', CommandRouter);

module.exports = app;
