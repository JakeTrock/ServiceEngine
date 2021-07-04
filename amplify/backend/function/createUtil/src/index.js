/* Amplify Params - DO NOT EDIT
    API_SENGINE_GRAPHQLAPIIDOUTPUT
    API_SENGINE_UTILTABLE_ARN
    API_SENGINE_UTILTABLE_NAME
    ENV
    REGION
    STORAGE_SENGINESTORE_BUCKETNAME
Amplify Params - DO NOT EDIT */

const authenticator = require("aws-cognito-jwt-authenticate");
const { nanoid } = require("nanoid");
const axios = require("axios");
const AWS = require("aws-sdk");

const BUCKET_NAME = "sengines3-dev";
const IAM_USER_KEY = "AKIAS2SHSIFCOGERYKHL";
const IAM_USER_SECRET = "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";
const GQAPIKEY = process.env.API_SENGINE_GRAPHQLAPIKEYOUTPUT;
const GQLEPT=process.env.API_URL;

const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

const cognitoDetails = {
   userPoolId:process.env.AUTH_SENGINEE1307A19_USERPOOLID,
   region:process.env.REGION
 };
const authUsr = async (jwt) => {
  //https://www.npmjs.com/package/aws-cognito-jwt-authenticate
  try {
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
  console.log(event);
  //get all props from request and validate
  const { title, description, license, tags, permissions, langType } =
    JSON.parse(event.body);

  try {
    if (chkProp(title) || title.length > 5)
      throw new Error("Title needs to be set and longer than 5 letters!");
    if (chkProp(description) || description.length > 50)
      throw new Error(
        "Description needs to be set and longer than 50 letters!"
      );
    if (chkProp(tags) || tags.length > 1)
      throw new Error("Tags needs to be set to at least 2 tags!");
    if (chkProp(permissions)) throw new Error("Permissions needs to be set!");
    if (chkProp(langType)) throw new Error("LangType needs to be set!");
    if (chkProp(license)) throw new Error("License needs to be set!");

    //verify authentic user
    const result = await authUsr(event.headers.authorization); //TODO: I don't know where the jwt is sent...
    //generate new uuid
    const id = nanoid();
    //make obj urls for post
    const binLoc = result.owner + "/" + id + "/bin.wasm";
    const srcLoc = result.owner + "/" + id + "/src.zip";
    const jsonLoc = result.owner + "/" + id + "/iface.json";

    //clone objects to user folder
    const upls = [
      //TODO:this may not be a legal operation
      await s3bucket.getSignedUrl("putObject", {
        Bucket: BUCKET_NAME,
        Key: binLoc,
        Expires: 60,
        ContentType: "text/wasm",
        ACL: "public-read",
      }),
      await s3bucket.getSignedUrl("putObject", {
        Bucket: BUCKET_NAME,
        Key: srcLoc,
        Expires: 60,
        ContentType: "application/zip",
        ACL: "public-read",
      }),
      await s3bucket.getSignedUrl("putObject", {
        Bucket: BUCKET_NAME,
        Key: jsonLoc,
        Expires: 60,
        ContentType: "text/json",
        ACL: "public-read",
      }),
    ];
    //build new util
    const dt = Date.now();
    const newUtil = {
      id,
      title: title,
      description: description,
      owner: result.owner,
      tags: tags,
      permissions: permissions,
      approved: "pending",
      license,
      langType,
      binLoc,
      srcLoc,
      jsonLoc,
      numUses: 0,
      numLikes: 0,
      likes: [],
      createdAt: dt,
      updatedAt: dt,
    };
    //publish util to graphql
    await axios({
      url: GQLEPT,
      method: "post",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": GQAPIKEY,
      },
      data: {
        query: /* GraphQL */ `mutation {
                createUtil(input: ${JSON.stringify(newUtil)}) {
                }
              }`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    //return new util
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(upls),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(e.message),
    };
  }
};
