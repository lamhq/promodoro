/* eslint-disable no-console */
const { ipcRenderer } = window;

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

  ipcRenderer.removeAllListeners('notification-action');
  ipcRenderer.on('notification-action', listener);
}
