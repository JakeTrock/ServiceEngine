/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  createProject,
  deleteProject,
  fileDialog,
  getAll,
  readProject,
  updateProject,
} from './fileIO';
import {
  dockDown,
  dockPause,
  dockStatus,
  dockUnpause,
  dockUp,
  Hprops,
  runHook,
} from './dockInterface';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

// FILE OPS BLOCK
ipcMain.on('getAllFiles', (event, arg) => {
  event.reply('getAllFiles', getAll());
});

ipcMain.on('createProject', (event, name) => {
  event.reply('fileCrud', createProject(name));
});

ipcMain.on('readProject', (event, name) => {
  event.reply('fileCrud', readProject(name));
});

ipcMain.on('updateProject', (event, arg) => {
  event.reply('fileCrud', updateProject(arg.name, arg.files));
});

ipcMain.on('deleteProject', (event, name) => {
  event.reply('fileCrud', deleteProject(name));
});

ipcMain.on('fileDialog', (event, arg) => {
  event.reply('fileDialog', fileDialog(arg));
});

// DOCKER VM MGR BLOCK

ipcMain.on('runHook', (event, pjname: string, arg: Hprops) => {
  event.reply('runHook', runHook(pjname, arg));
});

ipcMain.on('dockUp', (event, pjname: string) => {
  event.reply('dockUp', dockUp(pjname));
});

ipcMain.on('dockDown', (event, pjname: string) => {
  event.reply('dockDown', dockDown(pjname));
});

ipcMain.on('dockStatus', (event, pjname: string) => {
  event.reply('dockStatus', dockStatus(pjname));
});

ipcMain.on('dockPause', (event, pjname: string, ctname: string) => {
  event.reply('dockPause', dockPause(pjname, ctname));
});

ipcMain.on('dockUnpause', (event, pjname: string, ctname: string) => {
  event.reply('dockUnpause', dockUnpause(pjname, ctname));
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
