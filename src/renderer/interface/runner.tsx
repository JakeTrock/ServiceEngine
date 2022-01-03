import React from 'react';
import { toast } from 'react-toastify';
import './data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import GuiRunner from './subcomponents/interface/guiRunner';

// load metadata from fake database to build component, replace later with db call
const loadMetaData = (id) => {//TODO: running now entails also running
  if (id) {
    window.electron.ipcRenderer.readProject();
    return window.electron.ipcRenderer.once('readProject', (arg) => {
      return arg;
    });
  }
  return toast.error('You must provide an id of a utility to load!');
};

const SvcPage = (props) => {
  const { match } = props;
  const utilID = match.params.uuid;
  const currentComponent = loadMetaData(utilID); // current component data

  return (
    <>
      <GuiRunner component={currentComponent} />
    </>
  );
};

export default SvcPage;
