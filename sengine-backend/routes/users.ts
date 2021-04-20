import express from 'express';
import UserController from '../funcs/user';
import { isAuthenticated } from '../config/helpers';
import { NewRequest as Request } from '../config/types';

const router = express.Router();
const userController = new UserController();

router.post('/getUserutils/:username', async (req: Request, res) => userController.getUserutils(req, res));

router.post('/getLikedutils', isAuthenticated, async (req: Request, res) => userController.getLikedutils(req, res));

router.post('/signup',(req: Request, res) => userController.utilSignup(req, res));

router.post('/login',
    (req: Request, res) => userController.utilLogin(req, res));

router.get('/', isAuthenticated, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Cannot get user, please login' });
    }
    return res.status(200).json({ success: true, message: req.user });
});

router.post('/update/:prop', (req: Request, res) => userController.updateProp(req, res));

router.get('/check/:token', (req: Request, res) => userController.checkToken(req, res));

router.get('/reset', (req: Request, res) => userController.utilResetPassword(req, res));

router.post('/reset/:token', (req: Request, res) => userController.utilPasswordReset(req, res));

router.get('/delete', (req: Request, res) => userController.utilAcctDelete(req, res));

router.post('/delete/:token', (req: Request, res) => userController.utilDeleteAcct(req, res));

export default router;
