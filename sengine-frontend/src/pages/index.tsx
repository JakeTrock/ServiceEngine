//TODO: look into sw like this:https://gatsby.dev/offline
/*
SEO optimize subpages
what the engines like:
>ppl linking to you with similar text describing the link
>on-page
  >descriptive title tags
  >descriptive h1/h2/h3 tags
  >^these are prioritized if rendered on first contentful paint
  >fast loadtimes and good lighthouse scores
  >they dont care about meta tags

*/
import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import search from './search';
import dash from './dash';
import auth from './auth';
import editor from './editor';
const Dash = withRouter(dash);
const Search = withRouter(search);
const Auth = withRouter(auth);
const Editor = withRouter(editor);
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
        <Route path="/">
          <Search />
        </Route>
      </Switch>
    </Router>
  );
}