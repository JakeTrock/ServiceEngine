import { Request, Response } from "express";
import * as AWS from "aws-sdk";
import User from "../models/user";
import utilReport from "../models/utilReport";
import utilSchema from "../models/util";
import { v4 as uuidv4 } from "uuid";
import { err400, err500, prpcheck } from "../config/helpers";
import RequestUsr from "../config/types";
import { Op, literal } from "sequelize";
const s3Bucket = process.env.BUCKET_NAME;
const credentials = {
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
};
AWS.config.update({ credentials, region: "us-east-1" });
const s3 = new AWS.S3();

export default class utilController {
  async createutil(req: RequestUsr, res: Response) {
    const { description, langType, tags, title, proposedPerms } = req.body;
    const { _id } = req.user;

    if (
      prpcheck(_id) ||
      prpcheck(description) ||
      prpcheck(langType) ||
      prpcheck(tags) ||
      prpcheck(title) ||
      prpcheck(proposedPerms)
    )
      return err400(res, "Missing some information");//TODO:make all props messages more specific, perhaps make a varargs propcheck
    if (tags.split(",").length > 5)
      return err400(res, "please only have 5 or fewer tags.");
    const perms = [
      "getCam",
      "getAud",
      "getVidAud",
      "getNet",
      "sendNet",
      "getCurrentPos",
      "getClipboard",
      "setClipboard",
      "getScreen",
      "GetScreenAudio",
    ];
    if (proposedPerms.split(",").every((e: string) => perms.includes(e)))
      return err400(
        res,
        "one of your permissions may be mistyped or does not exist"
      );
    const id = uuidv4();
    try {
      const util = {
        _id: id,
        title,
        tags: tags.split(","),
        description,
        langType,
        authorId: _id,
        permissions: proposedPerms,
        approved: proposedPerms == [],
        binLoc: `${_id}/${id.toString()}/bin.wasm`,
        srcLoc: `${_id}/${id.toString()}/src.zip`,
        jsonLoc: `${_id}/${id.toString()}/iface.json`,
      };
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
          Key: util.srcLoc,
          Expires: 60,
          ContentType: "application/zip",
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

      return utilSchema
        .create(util)
        .then(() => res.status(200).json({ success: true, message: upls }))
        .catch((e: Error) =>
          err500(res, e, "Internal server error saving a util")
        );
    } catch (e) {
      return err500(res, e, "Internal server error uploading file");
    }
  }

  //TODO:create a route to calculate possible cost for external compute

  //TODO:allow user to run an external compute

  async saveutil(req: RequestUsr, res: Response) {
    const {
      newJson,
      newSrc,
      title,
      tags,
      description,
      permissions
    } = req.body;
    const { id } = req.params;
    const tagsFormatted = tags.split(",");
    const permsFormatted = permissions.split(",");
    return utilSchema
      .findOne({
        where: { _id: id },
        attributes: [
          "_id",
          "authorId",
          "title",
          "tags",
          "description",
          "permissions"
        ],
      })
      .then(async (p) => {
        try {
          if (!p)
            return err400(
              res,
              "The Util you are trying to save could not be found"
            );
          const { authorId, _id } = p;
          const upls: string[] = [];
          if (newSrc) {
            upls.push(
              await s3.getSignedUrl("putObject", {
                Bucket: s3Bucket,
                Key: `${authorId}/${_id}/bin.wasm`,
                Expires: 60,
                ContentType: "text",
                ACL: "public-read",
              })
            );
            upls.push(
              await s3.getSignedUrl("putObject", {
                Bucket: s3Bucket,
                Key: `${p.authorId}/${p._id}/src.zip`,
                Expires: 60,
                ContentType: "text",
                ACL: "public-read",
              })
            );
          }
          if (newJson) {
            upls.push(
              await s3.getSignedUrl("putObject", {
                Bucket: s3Bucket,
                Key: `${p.authorId}/${p._id}/iface.json`,
                Expires: 60,
                ContentType: "text",
                ACL: "public-read",
              })
            );
          }
          interface utcreate {
            title?: string;
            tags?: string[];
            description?: string;
            permissions?: string[];
            approved?: boolean;
          }
          const newSch: utcreate = {};

          if (title && title != p.title) newSch.title = title;
          if (tags && tagsFormatted != p.tags) newSch.tags = tagsFormatted;
          if (description && description != p.description)
            newSch.description = description;
          if (permissions && permsFormatted != p.permissions) {
            newSch.permissions = permsFormatted;
            newSch.approved = false;
          } else {
            newSch.approved = true;
          }
          return p
            .update(newSch)
            .then(() => res.status(200).json({ success: true, message: upls }))
            .catch((e: Error) =>
              err500(res, e, "Internal server error when updating util")
            );
        } catch (e) {
          return err500(res, e, "Internal server error when updating util");
        }
      })
      .catch((e: Error) =>
        err500(res, e, "Internal server error when updating util")
      );
  }

  async remixutil(req: RequestUsr, res: Response) {
    const { id } = req.params;
    if (prpcheck(id)) return err400(res, "Missing query string");
    return utilSchema
      .findOne({
        where: { _id: id },
        attributes: [
          "jsonLoc",
          "binLoc",
          "srcLoc",
          "_id",
          "title",
          "tags",
          "description",
          "permissions",
        ],
      })
      .then(async (util) => {
        if (!util)
          return err400(res, "error finding utility. maybe it was deleted?");
        const {
          jsonLoc,
          binLoc,
          srcLoc,
          _id,
          title,
          tags,
          langType,
          description,
          permissions,
          approved
        } = util;
        try {
          const nid = uuidv4();

          const corBin: AWS.S3.CopyObjectRequest = {
            Bucket: s3Bucket,
            CopySource: binLoc,
            Key: `${_id}/${nid}/bin.wasm`
          };
          const corSrc: AWS.S3.CopyObjectRequest = {
            Bucket: s3Bucket,
            CopySource: srcLoc,
            Key: `${_id}/${nid}/src.zip`
          };
          const corGUI: AWS.S3.CopyObjectRequest = {
            Bucket: s3Bucket,
            CopySource: jsonLoc,
            Key: `${_id}/${nid}/iface.json`
          };

          const tmp = {
            _id: nid,
            fork: _id,
            description,
            title,
            langType,
            tags,
            permissions,
            approved
          };
          s3.copyObject(corBin);
          s3.copyObject(corSrc);
          s3.copyObject(corGUI);
          await utilSchema.create(tmp);
          return res.status(200).json({
            success: true,
          });
        } catch (e) {
          return err500(
            res,
            e,
            "Internal server error when getting dev download"
          );
        }
      })
      .catch((e: Error) =>
        err500(res, e, "Internal server error when getting dev download")
      );
  }

  getutil(req: Request, res: Response) {
    const { id } = req.params;
    if (prpcheck(id)) return err400(res, "Missing query string");
    return utilSchema
      .findOne({
        where: { _id: id },
        attributes: [
          "jsonLoc",
          "binLoc",
          "_id",
          "likes",
          "dislikes",
          "likes",
          "uses",
          "permissions",
        ],
      })
      .then(async (util) => {
        if (!util)
          return err400(res, "could not find the util you RequestUsred.");
        const {
          jsonLoc,
          binLoc,
          _id,
          likes,
          dislikes,
          uses,
          permissions,
        } = util;
        try {
          const tmp = {
            jsonLoc: await s3.getSignedUrl("getObject", {
              Bucket: s3Bucket,
              Key: jsonLoc,
            }),
            binLoc: await s3.getSignedUrl("getObject", {
              Bucket: s3Bucket,
              Key: binLoc,
            }),
            uuid: _id,
            likes,
            dislikes,
            uses,
            permissions,
          };
          return res.status(200).json({
            success: true,
            message: tmp,
          });
        } catch (e) {
          return err500(res, e, "Internal server error when getting download");
        }
      })
      .catch((e: Error) =>
        err500(res, e, "Internal server error when getting download")
      );
  }

  search(req: Request, res: Response) {
    const { search } = req.params;
    if (prpcheck(search))
      return err400(res, "you must specify a search paramater");
    if(!search.match(/^[a-zA-Z0-9]*$/))return err400(res, "you can only use alphanumeric characters");
    const param = search.split(" ");
    const pl = param.length;
    const finalquery =
      "SELECT * FROM Util WHERE" +
      param.map((p: string, i: number) =>
        `title LIKE '${p}%' OR tags LIKE '${p}%' OR description LIKE '${p}%'` +
          (i === pl)
          ? ";"
          : " OR "
      );
    return utilSchema
      .findAll({
        where: {
          approved: 2,
          [Op.and]: [
            literal(`(
              ${finalquery}
          )`),
          ],
        },
        order: [[literal("likes"), "DESC"]],
        attributes: [
          "_id",
          "title",
          "description",
          "likes",
          "dislikes",
          "uses",
        ],
      })
      .then((result) =>
        res.status(200).json({
          success: true,
          message: result[0],
        })
      )
      .catch((e: Error) =>
        err500(
          res,
          e,
          `Internal server error when searching for term ${req.params.search}`
        )
      );
  }

  getFrontpage(req: Request, res: Response) {
    const { tag } = req.params;
    let where = {
      approved: 2,
      tag
    };
    if (!tag) delete where['tag'];
    return utilSchema
      .findAll({
        limit: 12,
        where,
        order: [[literal("likes"), "DESC"], [literal("createdAt"), "DESC"]],
        attributes: [
          "_id",
          "title",
          "description",
          "likes",
          "dislikes",
          "uses",
        ],
      })
      .then((result) =>
        res.status(200).json({
          success: true,
          message: result[0],
        })
      )
      .catch((e: Error) =>
        err500(
          res,
          e,
          `Internal server error when searching for term ${req.params.search}`
        )
      );
  }

  deleteutil(req: RequestUsr, res: Response) {
    const { _id } = req.user;
    const { id } = req.params;
    if (prpcheck(id)) return err400(res, "missing target utility id");
    return utilSchema
      .destroy({
        where: {
          _id: id,
        },
      })
      .then(() =>
        s3
          .deleteObject({
            Bucket: s3Bucket,
            Key: `${_id}/${id}/bin.wasm`,
          })
          .promise()
      )
      .then(() =>
        s3
          .deleteObject({
            Bucket: s3Bucket,
            Key: `${_id}/${id}/src.zip`,
          })
          .promise()
      )
      .then(() =>
        s3
          .deleteObject({
            Bucket: s3Bucket,
            Key: `${_id}/${id}/iface.json`,
          })
          .promise()
      )
      .then(() =>
        res
          .status(200)
          .json({ success: true, message: "Successfully deleted util." })
      )
      .catch((e: Error) =>
        err500(
          res,
          e,
          `Internal server error when deleting a util with utilId ${id}`
        )
      );
  }

  report(req: RequestUsr, res: Response) {
    const { utils, _id } = req.user;
    const { util } = req.params;
    const { reason } = req.body;
    if (prpcheck(utils) || prpcheck(_id) || prpcheck(reason) || prpcheck(util))
      return err400(res, "missing report context data");
    if (utils.indexOf(util) > -1)
      return err400(res, "you cannot report one of your own utils");
    const reportedBy = _id;
    return utilReport
      .count({
        where: { reportedBy, util },
      })
      .then((p) => {
        if (p > 0) {
          return err400(res, "you have already reported this util");
        } else {
          return utilReport
            .create({
              reportedBy,
              reason,
              util,
            })
            .then(() =>
              res.status(200).json({
                success: true,
                message: "Successfully submitted report",
              })
            )
            .catch((e: Error) =>
              err500(
                res,
                e,
                `Error saving util report for util ${util} by user ${reportedBy}`
              )
            );
        }
      });
  }

  likeutil(req: RequestUsr, res: Response) {
    return this.ldHelper(req, res, true);
  }

  dislikeutil(req: RequestUsr, res: Response) {
    return this.ldHelper(req, res, false);
  }

  ldHelper(req: RequestUsr, res: Response, ld: boolean) {
    const { id } = req.params;
    const { likes, dislikes, _id } = req.user;
    if (prpcheck(id) || prpcheck(likes) || prpcheck(dislikes) || prpcheck(_id))
      return err400(res, "Missing information needed.");
    const adl = likes ? likes.indexOf(id) > -1 : false;
    const pct = ld
      ? adl
        ? { likes: -1 }
        : { likes: 1 }
      : adl
        ? { dislikes: -1 }
        : { dislikes: 1 };

    const uct = ld
      ? adl
        ? {
          likes: likes?.splice(likes.indexOf(id), 1),
        }
        : {
          likes: likes?.push(id),
        }
      : adl
        ? {
          dislikes: dislikes?.splice(dislikes.indexOf(id), 1),
        }
        : {
          dislikes: dislikes?.push(id),
        };
    return utilSchema
      .increment(pct, {
        where: {
          _id: id,
          authorId: {
            [Op.notLike]: id,
          },
        },
      })
      .then((util) => {
        if (!util) return err400(res, "the util you liked could not be found");
        User.update(uct, { where: { _id } })
          .then(() => res.status(200).json({ success: false }))
          .catch((err) =>
            err500(res, err, `Error while dis/liking a util ${id}`)
          );
      })
      .catch((e: Error) =>
        err500(res, e, "Internal server error getting users")
      );
  }
}
