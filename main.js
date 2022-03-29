var robot = require("robotjs");
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

let shouldContinue = true;
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
  mainWindow.on('blur', () => {
    shouldContinue = false;
  });
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => app.quit());

function awaiter(msToWait) {
  return new Promise((resolve) => setTimeout(resolve, msToWait));
}

ipcMain.handle("start-test", async (e, {iterations = 1000, delay = 50}) => {
  shouldContinue = true;
  for (let i = 0; i < iterations; i++) {
    robot.keyTap("a");
    await awaiter(delay);
    if (!shouldContinue) {
      break;
    }
  }
});

ipcMain.on("stop-test", (e) => {
  shouldContinue = false;
})