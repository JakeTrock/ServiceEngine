const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    // fs
    getAll() {
      return ipcRenderer.send('getAllFiles', '');
    },
    createProject(arg) {
      return ipcRenderer.send('createProject', arg);
    },
    readProject(arg) {
      return ipcRenderer.send('readProject', arg);
    },
    updateProject(arg) {
      return ipcRenderer.send('updateProject', arg);
    },
    deleteProject(arg) {
      return ipcRenderer.send('deleteProject', arg);
    },
    fileDialog(arg) {
      return ipcRenderer.send('fileDialog', arg);
    },
    // docker
    runHook(pjname, arg) {
      return ipcRenderer.send('runHook', pjname, arg);
    },
    dockUp(pjname) {
      return ipcRenderer.send('dockUp', pjname);
    },
    dockDown(pjname) {
      return ipcRenderer.send('dockDown', pjname);
    },
    dockStatus(pjname) {
      return ipcRenderer.send('dockStatus', pjname);
    },
    dockPause(pjname, arg) {
      return ipcRenderer.send('dockPause', pjname, arg);
    },
    dockUnpause(pjname, arg) {
      return ipcRenderer.send('dockUnpause', pjname, arg);
    },
    on(channel, func) {
      const validChannels = [
        'getAllFiles',
        'createProject',
        'readProject',
        'updateProject',
        'deleteProject',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = [
        'getAllFiles',
        'createProject',
        'readProject',
        'updateProject',
        'deleteProject',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
