//TODO: look into sw like this:https://gatsby.dev/offline
import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import search from './interface/frontPage';
import dash from './interface/dash';
import auth from './interface/auth';
import editor from './interface/editor';
import runner from './interface/runner';
import NotFoundPage from './interface/404';
//configure aws
import Amplify from 'aws-amplify'
import aws_exports from './aws-exports'

// Amplify.configure(aws_exports);
Amplify.configure({
  Auth: {//TODO:INSERTME
    identityPoolId: aws_exports.aws_cognito_identity_pool_id,
    region: aws_exports.aws_project_region,
    userPoolId: aws_exports.aws_user_pools_id,
    userPoolWebClientId: aws_exports.aws_user_pools_web_client_id,
  },
  Storage: {
    AWSS3: {
      bucket: aws_exports.aws_user_files_s3_bucket,
      region: aws_exports.aws_project_region,
    }
  }
});

//import all subpages
const Dash = withRouter(dash);
const FrontPage = withRouter(search);
const Auth = withRouter(auth);
const Editor = withRouter(editor);
const Runner = withRouter(runner);
const NotFound = withRouter(NotFoundPage);
//composite pages into monopage app
export default function () {
  return (
    <Router>
      <Switch>
        <Route path="/dash">
          <Dash />
        </Route>
        <Route path="/editor">
          <Editor />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/runner">
          <Runner />
        </Route>
        <Route path="/">
          <FrontPage />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

//TODO:https://docs.amplify.aws/lib/utilities/i18n/q/platform/js


//TODO: Set bucket CORS policy to
//from https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#amazon-s3-bucket-cors-policy-setup
/*
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2",
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    }
]
*/

// https://docs.aws.amazon.com/amplify/latest/userguide/to-add-a-custom-domain-managed-by-amazon-route-53.html