import React from "react";
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import './interface/data/main.css'

import runner from './interface/runner';
import NotFoundPage from './interface/404';
import TopBar from "./interface/subcomponents/organizers/topbar";
import AboutPage from "./interface/aboutpage";
import AllPage from "./interface/allpage";
import Welcome from "./interface/welcome";
import Editor from "./interface/editor";

//import all subpages
const Runner = withRouter(runner);
const NotFound = withRouter(NotFoundPage);
//composite pages into monopage app
const Switchboard = () => {

  return (
    <Router>
      <TopBar />
      <Switch>
        <Route exact path="/about">
          <AboutPage />
        </Route>
        <Route exact path="/all">
          <AllPage />
        </Route>
        <Route path="/runner/:uuid">
          <Runner />
        </Route>
        <Route path="/editor/:uuid">
          <Editor />
        </Route>

        <Route path="/">
          <Welcome />
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