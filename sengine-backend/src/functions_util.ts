import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as AWS from "aws-sdk";
import {
  Authenticate,
  err400,
  err500,
  removeNullUndef,
  return200,
} from "./config/helpers";
import utilReport from "./models/utilReport";
import utilSchema from "./models/util";
import User from "./models/user";
import { UUIDV4 } from "sequelize/types";

const s3Bucket = process.env.BUCKET_NAME;
const credentials = {
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
};
AWS.config.update({ credentials, region: "us-east-1" });
const s3 = new AWS.S3();

export const createUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { binHash, srcLoc, description, tags, title } = JSON.parse(event.body);
  const authorId = Authenticate(event)._id;
  const _id = UUIDV4;
  if (srcLoc) {
    try {
      const util = removeNullUndef({
        _id,
        title,
        tags: tags.split(","),
        description,
        authorId,
        binHash,
        binLoc: `${authorId}/${_id.toString()}/bin.wasm`,
        srcLoc: `${authorId}/${_id.toString()}/src.zip`,
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
        .then(() =>
          return200({
            uuid: _id,
            upls,
          })
        )
        .catch((err: Error) => err500(err, "Error when saving a util"));
    } catch (e) {
      err500(e, "System upload error");
    }
  }
};

//TODO:allow user to apply for permissions upgrades

//TODO:create a route to calculate possible cost for external compute

//TODO:allow user to run an external compute

export const saveUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { binHash, newJson, newSrc, title, tags, description } = JSON.parse(
    event.body
  );
  const { id } = event.queryStringParameters;
  return utilSchema
    .findOne({ _id: id })
    .then(async (p: utilSchema) => {
      let upls: string[] = [];
      if (newSrc || binHash) {
        upls.push(
          await s3.getSignedUrl("putObject", {
            Bucket: s3Bucket,
            Key: `${p.authorId.toString()}/${p._id.toString()}/bin.wasm`,
            Expires: 60,
            ContentType: "text",
            ACL: "public-read",
          })
        );
        upls.push(
          await s3.getSignedUrl("putObject", {
            Bucket: s3Bucket,
            Key: `${p.authorId.toString()}/${p._id.toString()}/bin.wasm`,
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
            Key: `${p.authorId.toString()}/${p._id.toString()}/iface.json`,
            Expires: 60,
            ContentType: "text",
            ACL: "public-read",
          })
        );
      }
      return p
        .update(
          removeNullUndef({
            binHash,
            title,
            tags: tags.split(","),
            description,
          }),
          {
            returning: true,
          }
        )
        .then(() => return200(upls))
        .catch((err: Error) => err500(err, "Error when updating util"));
    })
    .catch((err: Error) => err500(err, "Error when updating util"));
};

export const remixUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { id } = event.queryStringParameters;
  return utilSchema
    .findOne({ _id: id })
    .then(async (util: utilSchema) => {
      const tmp = {
        jsonLoc: await s3.getSignedUrl("getObject", {
          Bucket: s3Bucket,
          Key: util.jsonLoc,
        }),
        binLoc: await s3.getSignedUrl("getObject", {
          Bucket: s3Bucket,
          Key: util.binLoc,
        }),
        srcLoc: await s3.getSignedUrl("getObject", {
          Bucket: s3Bucket,
          Key: util.srcLoc,
        }),
      };
      return {
        metadata: util,
        files: tmp,
      };
    })
    .then((result) => return200(result))
    .catch((err: Error) => err500(err, "Error when getting dev download"));
};

export const getUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { id } = event.queryStringParameters;
  return utilSchema
    .findOne({ _id: id })
    .then(async (util: utilSchema) => {
      const tmp = {
        jsonLoc: await s3.getSignedUrl("getObject", {
          Bucket: s3Bucket,
          Key: util.jsonLoc,
        }),
        binLoc: await s3.getSignedUrl("getObject", {
          Bucket: s3Bucket,
          Key: util.binLoc,
        }),
        uuid: util._id,
        likes: util.likes,
        dislikes: util.dislikes,
        uses: util.uses,
        binhash: util.binhash,
        permissions: util.permissions,
      };
      return tmp;
    })
    .then((result) => return200(result))
    .catch((err: Error) =>
      err500(err, `Error when getting pkg download ${id}`)
    );
};

export const search: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  return {
    statusCode: 404,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: false,
      message: "util not yet implemented",
    }),
  };
  // const { searchQuery } = req.params;
  // /*@ts-ignore */
  // return util
  //   .fuzzy({
  //     //TODO still no good way to do this other than:https://dev.to/kaleman15/fuzzy-searching-with-postgresql-97o
  //     title_tg: {
  //       searchQuery,
  //       weight: 20,
  //     },
  //     description_tg: {
  //       searchQuery,
  //       weight: 10,
  //     },
  //     tags_tg: {
  //       searchQuery,
  //       weight: 5,
  //     },
  //   })
  //   .select("likes uses dislikes title description _id")
  //   .sort({ likes: 1, dislikes: -1 }) //TODO:may not sort correctly
  //   .exec()
  //   .then((utils) => {
  //     if (utils) {
  //       return utils;
  //     } else {
  //       return "no utils found for this query";
  //     }
  //   })
  //   .then((result) =>
  //     res.status(200).json({
  //       success: true,
  //       message: result,
  //     })
  //   )
  //   .catch((err) => {
  //     logger.error(`Error when searching for term ${searchQuery}: ${err}`);
  //     return res.status(500).json({ success: false, message: err.message });
  //   });
};

export const deleteUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { id } = event.queryStringParameters;

  return utilSchema
    .destroy({
      where: {
        _id: id,
      },
    })
    .then(() => return200("Successfully deleted util."))
    .catch((err: Error) =>
      err500(err, `Error when deleting a util with utilId ${id}`)
    );
};

export const report: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { reason, util } = JSON.parse(event.body);
  const reportedBy = Authenticate(event)._id;
  return utilReport
    .findOne({
      reportedBy,
      util,
    })
    .then((p: utilReport) => {
      if (p) {
        return err400("you have already reported this util");
      } else {
        return utilReport
          .create({
            reportedBy,
            reason,
            util,
          })
          .then(() => return200("Successfully submitted report"))
          .catch((err: Error) =>
            err500(
              err,
              `Error saving util report for util ${util} by user ${reportedBy}`
            )
          );
      }
    });
};

export const likeUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  return ldHelper(event, true);
};

export const dislikeUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  return ldHelper(event, false);
};

const ldHelper = (event: APIGatewayProxyEventV2, ld: boolean) => {
  const { id } = event.queryStringParameters;

  return Authenticate(event).then((u: User) => {
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
        ? { $pull: { likes: id } }
        : { $push: { likes: id } }
      : adl
      ? { $pull: { dislikes: id } }
      : { $push: { dislikes: id } };
    return utilSchema
      .update(pct, {
        where: { _id: id },
      })
      .then(() => u.update(uct))
      .then(() => return200(""))
      .catch((err: Error) =>
        err500(err, `Error while dis/liking a util ${id}`)
      );
  });
};
