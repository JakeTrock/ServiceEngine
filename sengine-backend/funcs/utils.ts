import mongoose from "mongoose";

/* eslint-disable class-methods-use-this */
import { Response } from "express";

import * as AWS from "aws-sdk";
import util from "../models/util";
import { util as utilType, NewRequest as Request } from "../types/types";
import initLogger from "../config/logger";
import User from "../models/user";
import { removeNullUndef } from "../config/helpers";
import utilReport from "../models/utilReport";

const logger = initLogger("Controllerutils");

const s3Bucket = process.env.BUCKET_NAME;
const credentials = {
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
};
AWS.config.update({ credentials, region: "us-east-1" });
const s3 = new AWS.S3();
export default class utilController {
  async createutil(req: Request, res: Response) {
    const { binHash, srcLoc, description } = req.body;
    const authorId = req.user._id;
    const _id = mongoose.Types.ObjectId();
    if (srcLoc || srcLoc.substring(0, 6) === "git://") {
      try {
        const util = removeNullUndef({
          _id,
          description,
          authorId,
          binHash,
          binLoc: `${authorId}/${_id.toString()}/bin.wasm`,
          srcLoc,
          jsonLoc: `${authorId}/${_id.toString()}/iface.json`,
        });
        const upls = [
          await s3.getSignedUrl("putObject", {
            Bucket: s3Bucket,
            Key: util.binLoc,
            Expires: 60,
            ContentType: "text/wasm",
            ACL: "public-read",
          }),
          await s3.getSignedUrl("putObject", {
            Bucket: s3Bucket,
            Key: util.jsonLoc,
            Expires: 60,
            ContentType: "text/json",
            ACL: "public-read",
          }),
        ];

        return util
          .create(util)
          .then((p) =>
            res.status(201).json({
              success: true,
              message: {
                uuid: _id,
                upls,
              },
            })
          )
          .catch((err: any) => {
            logger.error(`Error when saving a util ${util}: ${err}`);
            return res
              .status(500)
              .json({ success: false, message: err.message });
          });
      } catch (e) {
        logger.error(`Image upload error: ${e}`);
        return res.status(500).json({ success: false, message: e.message });
      }
    } else
      return res.status(400).json({
        success: false,
        message: "you must present a source code git url for auditing.",
      });
  }

  async saveutil(req: Request, res: Response) {
    const { binHash, newJson, newSrc, title, tags, description } = req.body;
    const { id } = req.params;
    util
      .findById({ _id: id })
      .then(async (p) => {
        let upls = [];
        if (binHash)
          upls.push(
            await s3.getSignedUrl("putObject", {
              Bucket: s3Bucket,
              Key: `${p.authorId.toString()}/${p._id.toString()}/bin.wasm`,
              Expires: 60,
              ContentType: "text",
              ACL: "public-read",
            })
          );
        if (newJson)
          upls.push(
            await s3.getSignedUrl("putObject", {
              Bucket: s3Bucket,
              Key: `${p.authorId.toString()}/${p._id.toString()}/iface.json`,
              Expires: 60,
              ContentType: "text",
              ACL: "public-read",
            })
          );
        const sptags = tags.split(",");
        return p
          .update(
            removeNullUndef({ binHash, newSrc, title, sptags, description }),
            {
              new: true,
            }
          )
          .orFail(new Error("util not found!"))
          .exec()
          .then(() => res.status(200).json({ success: true, message: upls }))
          .catch((err) => {
            logger.error(`Error when updating util ${id}: ${err}`);
            return res
              .status(500)
              .json({ success: false, message: err.message });
          });
      })
      .catch((err) => {
        logger.error(`Error when updating util ${id}: ${err}`);
        return res.status(500).json({ success: false, message: err.message });
      });
  }

  remixutil(req: Request, res: Response) {
    const { id } = req.params;
    util
      .findById(id)
      .orFail(new Error("util not found!"))
      .exec()
      .then(async (util) => {
        const tmp = {
          jsonLoc: await s3.getSignedUrl("getObject", {
            Bucket: s3Bucket,
            Key: util.jsonLoc,
          }),
          binLoc: await s3.getSignedUrl("getObject", {
            Bucket: s3Bucket,
            Key: util.binLoc,
          }),
          srcLoc: util.srcLoc,
        };
        return tmp;
      })
      .then((result) =>
        res.status(200).json({
          success: true,
          message: result,
        })
      )
      .catch((err) => {
        logger.error(`Error when getting dev download ${id}: ${err}`);
        return res.status(500).json({ success: false, message: err.message });
      });
  }

  getutil(req: Request, res: Response) {
    const { id } = req.params;
    util
      .findById(id)
      .orFail(new Error("util not found!"))
      .exec()
      .then(async (util) => {
        const tmp = {
          jsonLoc: await s3.getSignedUrl("getObject", {
            Bucket: s3Bucket,
            Key: util.jsonLoc,
          }),
          binLoc: await s3.getSignedUrl("getObject", {
            Bucket: s3Bucket,
            Key: util.binLoc,
          }),
        };
        return tmp;
      })
      .then((result) =>
        res.status(200).json({
          success: true,
          message: result,
        })
      )
      .catch((err) => {
        logger.error(`Error when getting pkg download ${id}: ${err}`);
        return res.status(500).json({ success: false, message: err.message });
      });
  }

  search(req: Request, res: Response) {
    const { searchQuery } = req.params;
    /*@ts-ignore */
    return util
      .fuzzy({
        title_tg: {
          searchQuery,
          weight: 20,
        },
        description_tg: {
          searchQuery,
          weight: 10,
        },
        tags_tg: {
          searchQuery,
          weight: 5,
        },
      })
      .select('likes uses dislikes title description _id')
      .sort({ likes: 1, dislikes: -1 }) //TODO:may not sort correctly
      .exec()
      .then((utils) => {
        if (utils) {
          return utils;
        } else {
          return "no utils found for this query";
        }
      })
      .then((result) =>
        res.status(200).json({
          success: true,
          message: result,
        })
      )
      .catch((err) => {
        logger.error(`Error when searching for term ${query}: ${err}`);
        return res.status(500).json({ success: false, message: err.message });
      });
  }

  deleteutil(req: Request, res: Response) {
    const { id } = req.params;

    util
      .findByIdAndDelete(id)
      .orFail(new Error("util not found!"))
      .exec()
      .then((result) =>
        res.status(200).json({
          success: true,
          message: `Successfully deleted util with result: ${result}`,
        })
      )
      .catch((err) => {
        logger.error(`Error when deleting a util with utilId ${id}: ${err}`);
        return res.status(500).json({ success: false, message: err.message });
      });
  }

  async report(req: Request, res: Response) {
    const { reason, util } = req.body;
    const reportedBy = req.user._id;
    utilReport
      .findOne({
        reportedBy,
        util,
      })
      .then((p) => {
        if (p) {
          return res.status(400).json({
            success: false,
            message: "you have already reported this util",
          });
        } else {
          utilReport
            .create({
              reportedBy,
              reason,
              util,
            })
            .then(() =>
              res
                .status(201)
                .json({
                  success: true,
                  message: "Successfully submitted report",
                })
            )
            .catch((err) => {
              if (err.message.toLowerCase().includes("validation"))
                return res
                  .status(400)
                  .json({ success: false, message: err.message });
              logger.error(
                `Error saving util report for util ${util} by user ${reportedBy} with error: ${err}`
              );
              return res.status(500).json({ success: false, message: err });
            });
        }
      });
  }

  async likeutil(req: Request, res: Response) {
    return this.ldHelper(req, res, true);
  }

  async dislikeutil(req: Request, res: Response) {
    return this.ldHelper(req, res, false);
  }

  async ldHelper(req: Request, res: Response, ld: boolean) {
    const { id } = req.params;
    const { _id } = req.user;

    return User.findById(_id)
      .orFail(new Error("User not found!"))
      .then((u) => {
        const adl = u.likes.map((x) => x.toString()).includes(id);
        const pct = ld
          ? adl
            ? { $inc: { likes: -1 } }
            : { $inc: { likes: 1 } }
          : adl
          ? { $inc: { dislikes: -1 } }
          : { $inc: { dislikes: 1 } };
        const uct = ld
          ? adl
            ? { $pull: { likes: mongoose.Types.ObjectId(id) } }
            : { $push: { likes: mongoose.Types.ObjectId(id) } }
          : adl
          ? { $pull: { dislikes: mongoose.Types.ObjectId(id) } }
          : { $push: { dislikes: mongoose.Types.ObjectId(id) } };
        return util
          .findByIdAndUpdate(id, pct, { new: true })
          .orFail(new Error("util not found!"))
          .exec()
          .then(() => u.update(uct, { new: true }))
          .then((result) =>
            res.status(200).json({ success: true, message: result })
          )
          .catch((err) => {
            logger.error(`Error while dis/liking a util ${id}: ${err}`);
            return res
              .status(500)
              .json({ success: false, message: err.message });
          });
      });
  }
}
