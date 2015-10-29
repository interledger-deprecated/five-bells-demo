'use strict'

const app = require('app')
const BrowserWindow = require('browser-window')

require('./server')

let mainWindow = null

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  // Create a browser window
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // Load the index.html for the demo
  mainWindow.loadUrl('http://localhost:3000/public/index.html')
})
