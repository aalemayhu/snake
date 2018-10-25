import { ipcMain, app, BrowserWindow } from 'electron';

const { fsCache } = require('./util/electron-caches.js');

const axios = require('axios');
require('./api/server.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


function loadConfig() {
  global.config = fsCache.config();
  axios.post('http://localhost:3000/set-config', global.config).then(() => {
    console.log('Sending ipc call to renderer', global.config.botName);
    mainWindow.webContents.send('config-loaded', global.config);
  }).catch((error) => {
    if (error) {
      console.log('got error -> ', error);
    }
  });
}

const createWindow = () => {
  // Create the browser window.
  // TODO: make the window stuff configurable and persisted
  mainWindow = new BrowserWindow({
    frame: false,
    backgroundColor: '#34ace0',
    backgroundThrottling: false,
    x: 0,
    y: 0,
    width: 294,
    height: 182,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  loadConfig();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    fsCache.saveAll(global.config);
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Game HUD events

ipcMain.on('update-game', (event, state) => {
  global.config.gameState = state;
  axios.post('http://localhost:3000/set-state', {
    gameState: state,
  }).then(() => {
    console.log('done');
  }).catch((error) => {
    if (error) {
      console.log('got error -> ', error);
    }
  });
});
