/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const { ipcRenderer } = require('electron');

const channel = 'notification-action';

export function showNotification(options) {
  ipcRenderer.send('show-notification', options);
}

export function registerHandler(listener) {
  ipcRenderer.removeAllListeners(channel);
  ipcRenderer.on(channel, listener);
}

export function removeHandler(listener) {
  ipcRenderer.removeListener(channel, listener);
}
