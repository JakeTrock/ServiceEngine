/* Amplify Params - DO NOT EDIT
    API_SENGINE_GRAPHQLAPIENDPOINTOUTPUT
    API_SENGINE_GRAPHQLAPIIDOUTPUT
    AUTH_SENGINEE1307A19_USERPOOLID
    ENV
    REGION
Amplify Params - DO NOT EDIT */
const authenticator = require("aws-cognito-jwt-authenticate");
const axios = require("axios");

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
  //get util id from event
  const utilID = event.body.JSON.util;

  try {
    if (chkProp(utilID)) throw new Error("you must choose a util to like!");

    const result = await authUsr(
      event.userPoolId,
      event.region,
      event.headers.authorization
    ); //TODO: I don't know where the jwt is sent...

    //make axios query get to the util id to get likes, who likes
    const preLike = await axios({
      url: event.API_URL,
      method: "get",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": event.API_SENGINE_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: /* GraphQL */ `query {
                    getUtil(condition:{id: ${utilID}}){
                        likes
                        numLikes
                    }
                }`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    if (!preLike.data)
      throw new Error("The post you are trying to like does not exist!");
    const likedAlready = preLike.likes.contains(result.clientId); //TODO:would this be username or clientid?
    //if person already likes, remove like
    //if person dosen't like, add like and id
    const variables = likedAlready
      ? {
          likes: preLike.likes.filter((s) => s !== result.clientId),
          numLikes: preLike.numLikes--,
        }
      : {
          likes: preLike.likes.concat(result.clientId),
          numLikes: preLike.numLikes++,
        };
    await axios({
      url: event.API_URL,
      method: "post",
      headers: {
        //TODO:this could be a bad/nonexistent key
        "x-api-key": event.API_SENGINE_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: /* GraphQL */ `mutation {
                    updateUtil(input: { likes: ${variables.likes}, numlikes: ${variables.numLikes} }, condition:{id: ${utilID}}) {
                    }
                  }`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });

    //return if user liked or removed like
    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        likedAlready ? "Removed like on post" : "Liked a post"
      ),
    };
    return response;
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(err.message),
    };
  }
};
