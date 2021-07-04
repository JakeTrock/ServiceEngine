/* Amplify Params - DO NOT EDIT
    API_SENGINE_GRAPHQLAPIIDOUTPUT
    API_SENGINE_REPORTTABLE_ARN
    API_SENGINE_REPORTTABLE_NAME
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
  const { id } = JSON.parse(event.body);
  try {
    if (chkProp(id) || !(typeof id == "string"))
      throw new Error("parentID needs to be set!");
    //verify authentic user
    const result = await authUsr(event.headers.authorization); //TODO: I don't know where the jwt is sent...
    //Remove Util(also makes sure the util even exists)
    const postExists = await axios({
      url: GQLEPT,
      method: "delete",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": GQAPIKEY,
      },
      data: {
        query: /* GraphQL */ `mutation {
                deleteUtil(condition: {owner:${result.owner},id:${id}}) {
                    binLoc,
                    srcLoc,
                    jsonLoc,
                    reports {
                        id
                    }
                }
              }`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    if (!postExists.data)
      throw new Error("The post you are trying to delete does not exist!");

    //Get all util keys

    const binParams = { BUCKET_NAME, Key: postExists.binLoc };
    const srcParams = { BUCKET_NAME, Key: postExists.srcLoc };
    const ifaceParams = { BUCKET_NAME, Key: postExists.jsonLoc };
    //Remove all bucket objects
    s3bucket.deleteObject(binParams, function (err, data) {
      if (err) throw err;
    });
    s3bucket.deleteObject(srcParams, function (err, data) {
      if (err) throw err;
    });
    s3bucket.deleteObject(ifaceParams, function (err, data) {
      if (err) throw err;
    });
    //Remove all reports
    postExists.reports.array
      .forEach(async (element) => {
        await axios({
          url: GQLEPT,
          method: "delete",
          headers: {
            //TODO:this could be a bad/nonexistent key
            "x-api-key": GQAPIKEY,
          },
          data: {
            query: /* GraphQL */ `mutation {
                    deleteReport(condition: {id:${element.id}}) {
                        binLoc,
                        srcLoc,
                        jsonLoc
                    }
                  }`,
          },
        });
      })
      .catch((e) => {
        throw new Error(e.message);
      });

    //Return 200
    return {
      statusCode: 200,
      headers,
      body: "Successfully deleted util!",
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(e.message),
    };
  }
};
