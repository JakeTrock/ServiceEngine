import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as AWS from "aws-sdk";
import { Authenticate, err400, err500, return200 } from "./config/helpers";
import utilReport from "./models/utilReport";
import utilSchema from "./models/util";
import User from "./models/user";
import { v4 as uuidv4 } from "uuid";
import { utcreate } from "./config/interfaces";

const s3Bucket = process.env.BUCKET_NAME || "";
const credentials = {
  accessKeyId: process.env.AWS_ACCESS || "",
  secretAccessKey: process.env.AWS_SECRET || "",
};
AWS.config.update({ credentials, region: "us-east-1" });
const s3 = new AWS.S3();

export const createUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (event.body) {
    const { binHash, description, tags, title } = JSON.parse(event.body);
    return Authenticate(event)
      .then(async (usr) => {
        const authorId = usr._id;
        const _id = uuidv4();
        try {
          const util = {
            _id,
            title,
            tags: tags.split(","),
            description,
            authorId,
            binHash,
            binLoc: `${authorId}/${_id.toString()}/bin.wasm`,
            srcLoc: `${authorId}/${_id.toString()}/src.zip`,
            jsonLoc: `${authorId}/${_id.toString()}/iface.json`,
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
            .then(() =>
              return200(
                JSON.stringify({
                  uuid: _id,
                  upls,
                })
              )
            )
            .catch((err: Error) => err500(err, "Error when saving a util"));
        } catch (e) {
          return err500(e, "System upload error");
        }
      })
      .catch((e) => err400(e));
  } else return err400("no information provided");
};

//TODO:allow user to apply for permissions upgrades

//TODO:create a route to calculate possible cost for external compute

//TODO:allow user to run an external compute

export const saveUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (event.body && event.queryStringParameters) {
    const { binHash, newJson, newSrc, title, tags, description } = JSON.parse(
      event.body
    );
    const { id } = event.queryStringParameters;
    return utilSchema
      .findOne({ where: { _id: id } })
      .then(async (p) => {
        if (p) {
          const upls: string[] = [];
          if (newSrc) {
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
                Key: `${p.authorId.toString()}/${p._id.toString()}/src.zip`,
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
          const newSch: utcreate = {};

          if (binHash) newSch.binHash = binHash;
          if (title) newSch.title = title;
          if (tags) newSch.tags = tags.split(",");
          if (description) newSch.description = description;
          return p
            .update(newSch)
            .then(() => return200(JSON.stringify(upls)))
            .catch((err: Error) => err500(err, "Error when updating util"));
        } else
          return err400("The Util you are trying to save could not be found");
      })
      .catch((err: Error) => err500(err, "Error when updating util"));
  } else return err400("no information provided");
};

export const remixUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (event.queryStringParameters) {
    const { id } = event.queryStringParameters;
    return utilSchema
      .findOne({ where: { _id: id } })
      .then(async (util) => {
        if (util) {
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
          return return200(
            JSON.stringify({
              metadata: util,
              files: tmp,
            })
          );
        } else return err400("error finding utility. maybe it was deleted?");
      })
      .catch((err: Error) => err500(err, "Error when getting dev download"));
  } else return err400("Missing query string");
};

export const getUtil: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (event.queryStringParameters) {
    const { id } = event.queryStringParameters;
    return utilSchema
      .findOne({ where: { _id: id } })
      .then(async (util) => {
        if (util) {
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
            binhash: util.binHash,
            permissions: util.permissions,
          };
          return return200(JSON.stringify(tmp));
        } else return err400("could not find the util you requested.");
      })
      .catch((err: Error) =>
        err500(err, `Error when getting pkg download ${id}`)
      );
  } else return err400("Missing query string");
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
  // to order queries put this after the where:
  // order: [
  //   ['id', 'DESC'],
  //   ['name', 'ASC'],
  // ],
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
  if (event.queryStringParameters) {
    const { id } = event.queryStringParameters;
    if (!id) return err400("missing target utility id");
    return Authenticate(event)
      .then((u) => {
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
                Key: `${u._id}/${id}/bin.wasm`,
              })
              .promise()
          )
          .then(() =>
            s3
              .deleteObject({
                Bucket: s3Bucket,
                Key: `${u._id}/${id}/src.zip`,
              })
              .promise()
          )
          .then(() =>
            s3
              .deleteObject({
                Bucket: s3Bucket,
                Key: `${u._id}/${id}/iface.json`,
              })
              .promise()
          )
          .then(() => return200("Successfully deleted util."))
          .catch((err: Error) =>
            err500(err, `Error when deleting a util with utilId ${id}`)
          );
      })
      .catch((e) => err400(e));
  } else return err400("Missing query string");
};

export const report: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (event.body) {
    const { reason, util } = JSON.parse(event.body);
    return Authenticate(event)
      .then((usr) => {
        if (usr) {
          if (usr.utils && usr.utils.indexOf(util) > -1)
            return err400("you cannot report one of your own utils");
          const reportedBy = usr._id;
          return utilReport
            .findOne({
              where: { reportedBy, util },
            })
            .then((p) => {
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
        } else return err400("current user was not found");
      })
      .catch((e) => err400(e));
  } else return err400("no submission data provided");
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
  if (event.queryStringParameters) {
    const { id } = event.queryStringParameters;
    if (!id) return err400("no post id provided");
    return Authenticate(event)
      .then((u: User) => {
        if (!u) return err400("your user data could not be loaded");
        const adl = u.likes ? u.likes.indexOf(id) > -1 : false;
        const pct = ld
          ? adl
            ? { likes: -1 }
            : { likes: 1 }
          : adl
          ? { dislikes: -1 }
          : { dislikes: 1 };

        const uct = ld
          ? adl //TODO: unsure if this works
            ? {
                likes: u.likes?.splice(u.likes.indexOf(id), 1),
              }
            : {
                likes: u.likes?.push(id),
              }
          : adl
          ? {
              dislikes: u.dislikes?.splice(u.dislikes.indexOf(id), 1),
            }
          : {
              dislikes: u.dislikes?.push(id),
            };
        return utilSchema
          .findOne({ where: { _id: id } })
          .then((util) => {
            if (!util) return err400("the util you liked could not be found");
            if (util.authorId === u._id)
              return err400(
                "you cannot perform this action on your own utility"
              );
            return util
              .increment(pct)
              .then(() => u.update(uct))
              .then(() => return200(""))
              .catch((err: Error) =>
                err500(err, `Error while dis/liking a util ${id}`)
              );
          })
          .catch((e: Error) => err400(e));
      })
      .catch((e) => err400(e));
  } else return err400("no data provided");
};
