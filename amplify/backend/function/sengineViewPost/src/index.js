/* Amplify Params - DO NOT EDIT
  API_SENGINE_GRAPHQLAPIENDPOINTOUTPUT
  API_SENGINE_GRAPHQLAPIIDOUTPUT
  ENV
  REGION
Amplify Params - DO NOT EDIT */
const axios = require("axios");
const AWS = require("aws-sdk");

const BUCKET_NAME = "sengines3-dev";
const IAM_USER_KEY = "AKIAS2SHSIFCOGERYKHL";
const IAM_USER_SECRET = "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";

const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

const chkProp = (prop) => {
  return prop == null || prop === "" || prop === undefined;
};

const signedUrlExpireSeconds = 60 * 5; // your expiry time in seconds.

exports.handler = async (event) => {
  const utilID = event.body.JSON.util;
  //eslint-disable-line
  try {
    if (chkProp(utilID)) throw new Error("you must choose a util to like!");

    const getDls = await axios({
      url: event.API_URL,
      method: "post",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": event.API_SENGINE_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: /* GraphQL */ `mutation {
              updateUtil(input: { numUses: ${event.Records[0]
                .numUses++}}, condition:{id: ${utilID}}) {
                binLoc,
                srcLoc,
                jsonLoc
              }
            }`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    if (!getDls.data)
      throw new Error("The post you are trying to like does not exist!");
    //return PUT put urls as string array

    const bin = s3bucket.getSignedUrl("getObject", {
      Bucket: BUCKET_NAME,
      Key: getDls.binLoc,
      Expires: signedUrlExpireSeconds,
    });

    const iface = s3bucket.getSignedUrl("getObject", {
      Bucket: BUCKET_NAME,
      Key: getDls.binLoc,
      Expires: signedUrlExpireSeconds,
    });

    const dlUrls = {
      bin,
      iface,
    };
    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(dlUrls),
    };
    return response;
  } catch (e) {
    const response = {
      statusCode: 500,
      headers,
      body: JSON.stringify(e.message),
    };
    return response;
  }
};
