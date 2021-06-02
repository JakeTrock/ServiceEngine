import express from "express";
import { Request, Response } from "express";
import utilController from "../funcs/utils";
import { isAuthenticated } from "../config/helpers";
import RequestUsr from "../config/types";

const router = express.Router();
const utils = new utilController();

router.post(
  "/create",
  isAuthenticated,
  async (req: RequestUsr, res: Response) => utils.createutil(req, res)
);

router.post(
  "/remix/:id",
  isAuthenticated,
  async (req: RequestUsr, res: Response) => utils.remixutil(req, res)
);

router.get("/load/:id", async (req: Request, res: Response) =>
  utils.getutil(req, res)
);

router.get("/fpage", async (req: Request, res: Response) =>
  utils.getFrontpage(req, res)
);

router.get(
  "/save/:id",
  isAuthenticated,
  async (req: RequestUsr, res: Response) => utils.saveutil(req, res)
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  async (req: RequestUsr, res: Response) => utils.deleteutil(req, res)
);

router.post(
  "/like/:id",
  isAuthenticated,
  async (req: RequestUsr, res: Response) => utils.likeutil(req, res)
);

router.post(
  "/dislike/:id",
  isAuthenticated,
  async (req: RequestUsr, res: Response) => utils.dislikeutil(req, res)
);

router.post("/search/:query", async (req: Request, res: Response) =>
  utils.search(req, res)
);

router.post(
  "/report",
  isAuthenticated,
  async (req: RequestUsr, res: Response) => utils.report(req, res)
);

export default router;
