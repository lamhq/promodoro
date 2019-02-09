/* eslint-disable no-console */
const { ipcRenderer } = window;
const channel = 'notification-action';

export function showNotification(options) {
  if (!ipcRenderer) {
    console.log('showNotification is called but no ipcRenderer instance setted, exiting...');
    return;
  }

  ipcRenderer.send('show-notification', options);
}

export function registerHandler(listener) {
  if (!ipcRenderer) {
    console.log('registerHandler is called but no ipcRenderer instance setted, exiting...');
    return;
  }

  ipcRenderer.removeAllListeners(channel);
  ipcRenderer.on(channel, listener);
}

export function removeHandler(listener) {
  if (!ipcRenderer) {
    console.log('removeHandler is called but no ipcRenderer instance setted, exiting...');
    return;
  }

  ipcRenderer.removeListener(channel, listener);
}
