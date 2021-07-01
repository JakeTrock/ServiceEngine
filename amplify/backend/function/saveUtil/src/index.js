/* Amplify Params - DO NOT EDIT
    API_SENGINE_GRAPHQLAPIIDOUTPUT
    API_SENGINE_UTILTABLE_ARN
    API_SENGINE_UTILTABLE_NAME
    ENV
    REGION
    STORAGE_SENGINESTORE_BUCKETNAME
Amplify Params - DO NOT EDIT */

const authenticator = require("aws-cognito-jwt-authenticate");
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

const authUsr = async (userPoolId, region, jwt) => {
  //https://www.npmjs.com/package/aws-cognito-jwt-authenticate
  try {
    const cognitoDetails = { userPoolId, region };
    const payload = await authenticator.validateJwt(jwt, cognitoDetails); // the decoded JWT payload
    return payload;
  } catch (err) {
    // invalid JWT
    throw err;
  }
};

const chkProp = (prop) => {
  return prop == null || prop === "" || prop === undefined;
};

exports.handler = async (event) => {
  const { parentID, newBins, title, description, tags, permissions, langType } =
    JSON.parse(event.body);

  try {
    if (chkProp(parentID) || !(typeof parentID == "string"))
      throw new Error("parentID needs to be set!");
    if (chkProp(newBins) || !(typeof newBins == "boolean"))
      throw new Error("You need to specify if your binaries have been updated");
    //verify authentic user
    const result = await authUsr(
      event.userPoolId,
      event.region,
      event.headers.authorization
    ); //TODO: I don't know where the jwt is sent...
    //get old util to harvest props
    const postExists = await axios({
      url: event.API_URL,
      method: "get",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": event.API_SENGINE_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: /* GraphQL */ `mutation {
                getUtil(condition: {owner:${result.owner},id:${parentID}}) {
                    binLoc,
                    srcLoc,
                    jsonLoc
                }
              }`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    if (!postExists.data)
      throw new Error("The post you are trying to like does not exist!");

    //build new util
    const dt = Date.now();
    let upls = [];
    let newUtil = {
      updatedAt: dt,
    };
    if (langType) newUtil.langType = langType;
    if (permissions) {
      newUtil.permissions = permissions;
      newUtil.approved = "pending";
    }
    if (tags) newUtil.tags = tags;
    if (title) newUtil.title = title;
    if (description) newUtil.description = description;

    if (newBins) {
      newUtil.approved = "pending";
      //new objects
      upls = [
        //TODO:this may not be a legal operation
        await s3bucket.getSignedUrl("putObject", {
          Bucket: BUCKET_NAME,
          Key: postExists.binLoc,
          Expires: 60,
          ContentType: "text/wasm",
          ACL: "public-read",
        }),
        await s3bucket.getSignedUrl("putObject", {
          Bucket: BUCKET_NAME,
          Key: postExists.srcLoc,
          Expires: 60,
          ContentType: "application/zip",
          ACL: "public-read",
        }),
        await s3bucket.getSignedUrl("putObject", {
          Bucket: BUCKET_NAME,
          Key: postExists.jsonLoc,
          Expires: 60,
          ContentType: "text/json",
          ACL: "public-read",
        }),
      ];
    }

    //publish util to graphql
    await axios({
      url: event.API_URL,
      method: "post",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": event.API_SENGINE_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: /* GraphQL */ `mutation {
                updateUtil(input: ${JSON.stringify(
                  newUtil
                )},condition:{id:${JSON.stringify(parentID)}}) {
                }
              }`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    //return new util
    const body = newBins ? upls : "updated post!";
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(body),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(e.message),
    };
  }
};
