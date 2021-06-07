import express from "express";
import { Request, Response } from "express";
import UserController from "../funcs/user";
import { isAuthenticated } from "../config/helpers";
import RequestUsr from "../config/types";

const router = express.Router();
const userController = new UserController();

router.post("/signup", (req: Request, res: Response) =>
  userController.Signup(req, res)
);

router.get(
  "/confirm/:token",
  (req: Request, res: Response) => userController.Confirm(req, res)
);

router.post("/login", (req: Request, res: Response) =>
  userController.Login(req, res)
);

router.get(
  "/getLikedUtils",
  isAuthenticated,
  async (req: RequestUsr, res: Response) =>
    userController.getLikedutils(req, res)
);

router.post("/getUserUtils/:username", async (req: Request, res: Response) =>
  userController.getUserutils(req, res)
);

router.get("/", isAuthenticated, (req: RequestUsr, res: Response) =>
  userController.getCurrent(req, res)
);

router.post(
  "/update",
  isAuthenticated,
  (req: RequestUsr, res: Response) => userController.updateProp(req, res)
);

router.get("/check/:token", (req: Request, res: Response) =>
  userController.checkToken(req, res)
);

router.get("/reset", isAuthenticated, (req: RequestUsr, res: Response) =>
  userController.askResetPassword(req, res)
);

router.post(
  "/reset/:token",
  isAuthenticated,
  (req: RequestUsr, res: Response) => userController.ResetPassword(req, res)
);

router.get("/delete", isAuthenticated, (req: RequestUsr, res: Response) =>
  userController.askAcctDelete(req, res)
);

router.post(
  "/delete/:token",
  isAuthenticated,
  (req: RequestUsr, res: Response) => userController.AcctDelete(req, res)
);

export default router;
