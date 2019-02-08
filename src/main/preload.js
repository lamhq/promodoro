/**
 * This script have access to require and other Node.js features,
 * allowing developers to expose a custom API to remotely loaded content.
 */

/* eslint-disable import/no-extraneous-dependencies */
const { ipcRenderer } = require('electron');

// simply set the ipcRenderer instance of electron to a
// global javascript variable so that renderer script
// has access to ipcRenderer
window.ipcRenderer = ipcRenderer;
