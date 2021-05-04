import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();
const pgURL = process.env.PG_URL;

const sequelize = new Sequelize(pgURL);

export default sequelize;