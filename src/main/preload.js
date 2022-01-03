const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
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
