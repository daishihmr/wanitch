const { app, BrowserWindow } = require('electron')
const path = require('path');
const fs = require('fs');

const config = require('./server/config').config;
const server = require('./server/server');

console.log(config);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });
  win.loadFile(path.join(__dirname, 'app/console.html'));
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

server.setup();
