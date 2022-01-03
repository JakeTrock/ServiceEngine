import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './interface/data/main.css';

import Runner from './interface/runner';
import TopBar from './interface/subcomponents/organizers/topbar';
import AboutPage from './interface/aboutpage';
import Welcome from './interface/welcome';
import Editor from './interface/editor';

// composite pages into monopage app
const Switchboard = () => {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/runner/:uuid" element={<Runner />} />
        <Route path="/editor/:uuid" element={<Editor />} />
        <Route path="/" element={<Welcome />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Switchboard />
  </React.StrictMode>,
  document.getElementById('root')
);
