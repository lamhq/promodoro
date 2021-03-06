/* eslint-disable import/no-extraneous-dependencies */
// Modules to control application life and create native browser window
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const os = require('os');
const {
  app, BrowserWindow, ipcMain,
} = require('electron');

const isDev = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 350,
    height: 400,
    resizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    // enable React Developer Tools
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0'),
    );
    // open dev tool
    mainWindow.webContents.openDevTools();
    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:4001');
  } else {
    mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
