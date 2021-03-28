import express from 'express';
import { isAuthenticated } from '../config/helpers';
import ReporterController from '../funcs/reports';
import { NewRequest as Request } from '../types/types';

const router = express.Router();

const reporter = new ReporterController();

router.post('/user', isAuthenticated, (req: Request, res) => reporter.createUserReport(req, res));

router.post('/util', isAuthenticated, (req: Request, res) => reporter.createutilReport(req, res));

export default router;
