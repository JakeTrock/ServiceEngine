import express from 'express';
import utilController from '../funcs/utils';
import { isAuthenticated } from '../config/helpers';

const router = express.Router();
const utils = new utilController();

router.post('/create', isAuthenticated, async (req, res) => utils.createutil(req, res));

router.post('/remix/:id', isAuthenticated, async (req, res) => utils.remixutil(req, res));

router.get('/load/:id', async (req, res) => utils.getutil(req, res));

router.get('/save/:id', async (req, res) => utils.saveutil(req, res));

router.delete('/delete/:id', isAuthenticated, async (req, res) => utils.deleteutil(req, res));

router.post('/like/:id', isAuthenticated, async (req, res) => utils.likeutil(req, res));

router.post('/dislike/:id', isAuthenticated, async (req, res) => utils.dislikeutil(req, res));

router.post('/search/:query', isAuthenticated, async (req, res) => utils.search(req, res));

router.post('/report', isAuthenticated, async (req, res) => utils.report(req, res));

export default router;
