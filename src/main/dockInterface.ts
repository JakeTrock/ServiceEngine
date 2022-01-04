import * as cp from 'child_process';
import electron from 'electron';
import { join } from 'path';

const { exec } = cp;

const userDataPath = (electron.app || electron.remote.app).getPath('userData');

const runComm = (projectName: string, comm: string) =>
  new Promise<string>((resolve, reject) => {
    const cppath = join(userDataPath, projectName); // TODO: working dir may not be correctly set!
    exec(
      `cd ${cppath} && ${comm}`,
      (error: cp.ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          return reject(new Error(`error: ${error.message}`));
        }
        if (stderr) {
          return reject(new Error(`error: ${stderr}`));
        }
        return resolve(stdout);
      }
    );
    return reject(new Error('command error!'));
  });

export interface Hprops {
  user: string;
  workdir: string;
  container: string;
  command: string;
}

const genCommand = (usr: string, dir: string, con: string, com: string) =>
  `sudo docker exec${usr ? ` -u ${usr}` : ''}${
    dir ? ` --workdir ${dir}` : ''
  } -it ${con} ${com}`;

export const runHook = (pjname: string, hookProps: Hprops) =>
  new Promise<string>((resolve, reject) => {
    const { user, workdir, container, command } = hookProps;
    // TODO:validate commands, you can use && or ; to get a shell

    if (container && command) {
      return runComm(pjname, genCommand(user, workdir, container, command))
        .then((s) => resolve(s))
        .catch((e) => reject(e));
    }
    return reject(
      new Error(
        'you must specify the container to run this on, and what to run'
      )
    );
  });

export const dockUp = (pjname: string) =>
  runComm(pjname, 'sudo docker-compose up -d --force-recreate');

export const dockDown = (pjname: string) =>
  runComm(pjname, 'sudo docker-compose down');

export const dockStatus = (pjname: string) =>
  new Promise<string[][]>((resolve, reject) =>
    runComm(pjname, `sudo docker-compose ps`)
      .then((psout) => {
        const cleanps = psout
          .split('\n')
          .slice(2)
          .map((e) => {
            const rsplit = e.split(/(?:(?!\n)\s)/).filter((ashes) => ashes);
            const rsl = rsplit.length - 2;
            return rsplit.filter((l, i) => i === 0 || i === rsl);
          });
        return resolve(cleanps);
      })
      .catch((e) => reject(e))
  );

export const dockPause = (pjname: string, ctname: string) =>
  new Promise<string>((resolve, reject) =>
    dockStatus(pjname)
      .then((cleanps) => {
        const tr = cleanps && cleanps.find((e) => e[0] === ctname)[1] === 'Up';
        if (tr) {
          return runComm(pjname, `sudo docker-compose pause ${ctname}`)
            .then((e) => resolve(e))
            .catch((e) => reject(e));
        }
        return reject(new Error('cannot pause this container'));
      })
      .catch((e) => reject(e))
  );

export const dockUnpause = (pjname: string, ctname: string) =>
  new Promise<string>((resolve, reject) =>
    dockStatus(pjname)
      .then((cleanps) => {
        const tr =
          cleanps && cleanps.find((e) => e[0] === ctname)[1] === 'Paused';
        if (tr) {
          return runComm(pjname, `sudo docker-compose unpause ${ctname}`)
            .then((e) => resolve(e))
            .catch((e) => reject(e));
        }
        return reject(new Error('cannot pause this container'));
      })
      .catch((e) => reject(e))
  );
