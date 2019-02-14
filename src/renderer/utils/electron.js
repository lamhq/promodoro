/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const { app, Notification } = require('electron').remote;

export function showNotification(options) {
  const { onClick, ...rest } = options;
  const notif = new Notification({
    ...rest,
    closeButtonText: 'Close',
  });
  notif.on('click', onClick);
  notif.show();
}

export function bounceDock() {
  app.dock.bounce();
}
