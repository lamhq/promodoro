const { ipcRenderer } = window.require('electron');

export function showNotification(options) {
  ipcRenderer.send('show-notification', options);
}

export function registerHandler(listener) {
  ipcRenderer.removeAllListeners('notification-action');
  ipcRenderer.on('notification-action', listener);
}
