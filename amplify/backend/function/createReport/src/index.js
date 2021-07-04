/* Amplify Params - DO NOT EDIT
    API_SENGINE_GRAPHQLAPIIDOUTPUT
    API_SENGINE_REPORTTABLE_ARN
    API_SENGINE_REPORTTABLE_NAME
    ENV
    REGION
Amplify Params - DO NOT EDIT */

const authenticator = require("aws-cognito-jwt-authenticate");
const { nanoid } = require("nanoid");
const axios = require("axios");

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
  const { reason, utilId } = JSON.parse(event.body);

  try {
    //validate
    if (chkProp(reason)) throw new Error("reason needs to be set!");
    if (chkProp(utilId)) throw new Error("utilID needs to be set!");
    //login with token
    const result = await authUsr(event.headers.authorization); //TODO: I don't know where the jwt is sent...
    //build report
    const id = nanoid();
    const dt = Date.now();
    const report = {
      id,
      owner: result.owner,
      reason,
      reportUtilId: utilId,
      createdAt: dt,
    };
    //create new report based on schema
    await axios({
      url: GQLEPT,
      method: "post",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": GQAPIKEY,
      },
      data: {
        query: /* GraphQL */ `mutation {
                    createReport(input: ${JSON.stringify(report)}) {
                    }
                  }`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify("Created report!"),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(e.message),
    };
  }
};
