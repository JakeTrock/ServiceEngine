import express from 'express';
import utilController from '../funcs/utils';
import { NewRequest as Request } from '../types/types';
import { isAuthenticated } from '../config/helpers';

const router = express.Router();
const utils = new utilController();

router.post('/create', isAuthenticated, async (req: Request, res) => utils.createutil(req, res));

router.post('/remix/:id', isAuthenticated, async (req: Request, res) => utils.remixutil(req, res));

router.get('/load/:id', async (req: Request, res) => utils.getutil(req, res));

router.get('/save/:id', async (req: Request, res) => utils.saveutil(req, res));

router.delete('/delete/:id', isAuthenticated, async (req: Request, res) => utils.deleteutil(req, res));

router.post('/like/:id', isAuthenticated, async (req: Request, res) => utils.likeutil(req, res));

router.post('/dislike/:id', isAuthenticated, async (req: Request, res) => utils.dislikeutil(req, res));

router.post('/search/:query', isAuthenticated, async (req: Request, res) => utils.search(req, res));

router.post('/report', isAuthenticated, async (req: Request, res) => utils.report(req, res));

export default router;
