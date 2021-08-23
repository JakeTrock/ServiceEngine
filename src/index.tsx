import React from "react";
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import codeeditor from './interface/editor-code';
import interfaceeditor from './interface/editor-interface';
import runner from './interface/runner';
import NotFoundPage from './interface/404';
import TopBar from "./interface/subcomponents/organizers/topbar";
import { usrCreds } from "./interface/data/interfaces";

//import all subpages
const CodeEditor = withRouter(codeeditor);
const InterfaceEditor = withRouter(interfaceeditor);
const Runner = withRouter(runner);
const NotFound = withRouter(NotFoundPage);
//composite pages into monopage app
const Switchboard = () => {
  const [currentUser, setCurrentUser] = React.useState<usrCreds>({
    confirmed: true,
    username: "banan",
    userSub: "49234920093",
  });

  return (
    <Router>
      {/* TODO: pass topbar pfp image */}
      <nav><TopBar /></nav>
      <Switch>
        {currentUser ?
          <React.Fragment>
            <Route path="/codeeditor/:uuid">
              <CodeEditor userInfo={currentUser} />
            </Route>

            <Route path="/interfaceeditor/:uuid">
              <InterfaceEditor userInfo={currentUser} />
            </Route>
          </React.Fragment> :
          <Route exact path="/login">
            please log in
            TODO: in future, provide userInfo={currentUser} and userSet={setCurrentUser}
          </Route>
        }

        <Route path="/runner/:uuid">
          <Runner userInfo={currentUser} />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Switchboard />
  </React.StrictMode>,
  document.getElementById('root')
);

// TODO:https://docs.amplify.aws/lib/utilities/i18n/q/platform/js

// https://docs.aws.amazon.com/amplify/latest/userguide/to-add-a-custom-domain-managed-by-amazon-route-53.html