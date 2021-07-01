/* Amplify Params - DO NOT EDIT
    API_SENGINE_GRAPHQLAPIENDPOINTOUTPUT
    API_SENGINE_GRAPHQLAPIIDOUTPUT
    API_SENGINE_UTILTABLE_ARN
    API_SENGINE_UTILTABLE_NAME
    AUTH_SENGINEE1307A19_USERPOOLID
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
  //get all props from request and validate
  const { parentID } = JSON.parse(event.body);

  try {
    if (chkProp(parentID)) throw new Error("parentID needs to be set!");
    //verify authentic user
    const result = await authUsr(
      event.userPoolId,
      event.region,
      event.headers.authorization
    ); //TODO: I don't know where the jwt is sent...
    //find original post
    const preFork = await axios({
      url: event.API_URL,
      method: "get",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": event.API_SENGINE_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: /* GraphQL */ `query {
                    getUtil(condition:{id: ${parentID}}){
                        id
                        binLoc
                        srcLoc
                        jsonLoc
                        license
                        permissions
                        langType
                        approved
                        title
                        description
                        tags
                        forkChain
                    }
                }`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    //generate new uuid
    const id = nanoid();
    //get obj urls of original post
    const binLoc = result.owner + "/" + id + "/bin.wasm";
    const srcLoc = result.owner + "/" + id + "/src.zip";
    const jsonLoc = result.owner + "/" + id + "/iface.json";
    const bincpy = {
      Bucket: BUCKET_NAME,
      CopySource: preFork.binLoc,
      Key: binLoc,
    };
    const srccpy = {
      Bucket: BUCKET_NAME,
      CopySource: preFork.srcLoc,
      Key: srcLoc,
    };
    const ifacecpy = {
      Bucket: BUCKET_NAME,
      CopySource: preFork.jsonLoc,
      Key: jsonLoc,
    };
    //clone objects to user folder
    s3bucket.copyObject(bincpy, function (err, data) {
      if (err) throw err;
    });
    s3bucket.copyObject(srccpy, function (err, data) {
      if (err) throw err;
    });
    s3bucket.copyObject(ifacecpy, function (err, data) {
      if (err) throw err;
    });
    //get forkchain of original post
    const forkChain = preFork.data.forkChain.concat(parentID);
    //build new util
    const dt = Date.now();
    const newUtil = {
      id,
      title: preFork.title,
      description: preFork.description,
      owner: result.owner,
      forkChain,
      tags: preFork.tags,
      permissions: preFork.permissions,
      approved: preFork.approved,
      langType: preFork.langType,
      license: preFork.license,
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
    const postFork = await axios({
      url: event.API_URL,
      method: "post",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": event.API_SENGINE_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: /* GraphQL */ `mutation {
                    createUtil(input: ${JSON.stringify(newUtil)}) {
                        id
                        owner
                        forkChain {
                            id
                            title
                            description
                        }
                        title
                        description
                        tags
                        permissions
                        approved
                        langType
                        binLoc
                        srcLoc
                        jsonLoc
                        numUses
                        numLikes
                        likes
                        createdAt
                        updatedAt
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
      body: JSON.stringify(postFork),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(e.message),
    };
  }
};
