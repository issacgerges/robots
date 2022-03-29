const {ipcRenderer} = require('electron');
const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('robots', {
    versions: {chromium: process.versions.chrome, electron: process.versions.electron},
    startTest: ({iterations, delay}) => ipcRenderer.invoke('start-test', {iterations, delay}),
    stopTest: () => ipcRenderer.send('stop-test')
})