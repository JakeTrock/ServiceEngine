import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      routes: {
        //usr
        "GET /user/": "src/functions_usr.getCurrent",
        "GET /user/Userutils/": "src/functions_usr.getUserUtils",
        "GET /user/likedUtils/": "src/functions_usr.getUserLiked",
        "POST /user/signup/": "src/functions_usr.signup",
        "POST /user/login": "src/functions_usr.login",
        "POST /user/update/": "src/functions_usr.updateProp",
        "GET /user/checkToken/": "src/functions_usr.checkToken",
        "GET /user/reset": "src/functions_usr.askResetPassword",
        "POST /user/reset/": "src/functions_usr.ResetPassword",
        "GET /user/delete": "src/functions_usr.askAcctDelete",
        "POST /user/delete/": "src/functions_usr.AcctDelete",
        //util
        "POST /utils/create": "src/functions_util.createUtil",
        "POST /utils/remix/": "src/functions_util.remixUtil",
        "GET /utils/load": "src/functions_util.getUtil",
        "POST /utils/save/": "src/functions_util.saveUtil",
        "DELETE /utils/delete/": "src/functions_util.deleteUtil",
        "POST /utils/like/": "src/functions_util.likeUtil",
        "POST /utils/dislike/": "src/functions_util.dislikeUtil",
        "POST /utils/search/": "src/functions_util.search",
        "POST /utils/report": "src/functions_util.report",
      },
    });

    // Show API endpoint in output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
