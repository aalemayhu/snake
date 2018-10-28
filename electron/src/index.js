import { app, BrowserWindow } from 'electron';

const { fsCache } = require('./util/electron-caches.js');

const axios = require('axios');
require('./api/server.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


function setGameConfig() {
  axios.post('http://localhost:3000/set-config', global.config).then(() => {
    console.log('Sending ipc call to renderer', global.config.botName);
    mainWindow.webContents.send('config-loaded', global.config);
  }).catch(error => console.log('got error -> ', error));
}

function defaultWindowState() {
  const state = { x: 0, y: 0, width: 640, height: 320 };
  if (global.config.windowState) {
    const ws = global.config.windowState;
    state.x = ws.x ? ws.x : state.x;
    state.y = ws.y ? ws.y : state.y;
    state.width = ws.width ? ws.width : state.width;
    state.height = ws.height ? ws.height : state.height;
  }
  return state;
}

const createWindow = () => {
  global.config = fsCache.config();
  const state = defaultWindowState();

  mainWindow = new BrowserWindow({
    frame: false,
    backgroundColor: '#34ace0',
    backgroundThrottling: false,
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', () => fsCache.saveAll(global.config));

  mainWindow.on('move', () => {
    const pos = mainWindow.getPosition();
    global.config.windowState.x = pos[0];
    global.config.windowState.y = pos[1];
  });

  mainWindow.on('resize', () => {
    const size = mainWindow.getSize();
    global.config.windowState.width = size[0];
    global.config.windowState.height = size[1];
  });

  setGameConfig();
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
