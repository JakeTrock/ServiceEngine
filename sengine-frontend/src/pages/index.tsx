//TODO: look into sw like this:https://gatsby.dev/offline
import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import search from './frontPage';
import dash from './dash';
import auth from './auth';
import editor from './editor';
import runner from './runner';
//import all subpages
const Dash = withRouter(dash);
const FrontPage = withRouter(search);
const Auth = withRouter(auth);
const Editor = withRouter(editor);
const Runner = withRouter(runner);
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
      </Switch>
    </Router>
  );
}