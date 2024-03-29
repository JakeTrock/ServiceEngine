import { join } from 'path';
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  unlinkSync,
  mkdir,
  mkdirSync,
} from 'fs';
import * as cp from 'child_process';
import du from 'du';
import electron, { dialog, FileFilter } from 'electron';
import { v4 as uuidv4 } from 'uuid';

const { exec } = cp;
const userDataPath = (electron.app || electron.remote.app).getPath('userData');
// const { readFileSync, writeFileSync, readdirSync } = window.require('fs');
// const { join } = window.require('path');

function parseDataFile(filePath: string) {
  try {
    return JSON.parse(
      String(readFileSync(join(userDataPath, filePath, 'utility.json')))
    );
  } catch (error) {
    return {};
  }
}

export const getAll = () => {
  const files = readdirSync(userDataPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => parseDataFile(dirent.name));

  return files;
};

export function createProject(name: string) {
  mkdirSync(join(userDataPath, name));
  writeFileSync(
    join(userDataPath, `./${name}/utility.json`),
    `{
      id: ${uuidv4()},
      name: '',
      file: '',
      tags: [],
      description: '',
      binariesUsed: [],
      scheme: {},
    }`
  );
  writeFileSync(
    join(userDataPath, `./${name}/docker-compose.yaml`),
    `#file was generated by SEngine ${Date.now()}

  version: '3'

  services:
  networks:`
  );
}

export function readProject(name: string) {
  let files: { [key: string]: string } = {};
  readdirSync(join(userDataPath, name), { withFileTypes: true })
    .filter((dirent) => !dirent.isDirectory())
    .forEach((dirent) => {
      files[dirent.name] = String(readFileSync(dirent.name)) || '';
    });
  return files;
}

export function updateProject(name: string, files: { [key: string]: string }) {
  Object.getOwnPropertyNames(files).forEach((f) => {
    writeFileSync(join(userDataPath, name, f), files[f]);
  });
}

export function deleteProject(name: string) {
  unlinkSync(join(userDataPath, name));
}

interface FileOpts {
  properties: (
    | 'openFile'
    | 'openDirectory'
    | 'multiSelections'
    | 'showHiddenFiles'
  )[];
  filters: FileFilter[]; // https://www.electronjs.org/docs/latest/api/dialog/#methods
  maxSize: number;
}

export const fileDialog = (options: FileOpts) =>
  new Promise<string[]>((resolve, reject) => {
    const { properties, filters, maxSize } = options;

    dialog
      .showOpenDialog({
        properties,
        filters,
      })
      .then(async (rtv) => {
        if (rtv.canceled) reject(new Error('No files chosen!'));
        if (maxSize && maxSize !== 0) {
          const allsizes = rtv.filePaths.map(async (p) => du(p)); // TODO:path may not be absolute

          Promise.all(allsizes)
            .then((s) => {
              const ts = s.reduce((pv = 0, cv) => (pv += cv));
              if (ts <= maxSize) {
                return resolve(rtv.filePaths);
              }
              return reject(new Error('File is over the maximum size!'));
            })
            .catch((e) => reject(e));
        } else return resolve(rtv.filePaths);
        return reject(new Error('command error!'));
      })
      .catch((e) => reject(e));
  });
