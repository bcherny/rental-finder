const dataServer = require('./data-server')
const electron = require('electron')
const getPort = require('get-port')
const winston = require('winston')

const fetchData = dataServer.fetchData
const startServer = dataServer.startServer
const BrowserWindow = electron.BrowserWindow
const app = electron.app

winston.add(winston.transports.File, { filename: 'log.txt' })

app.on('ready', function() {
  getPort().then(port =>
    startServer(port).then(() => {
      const d = electron.screen.getPrimaryDisplay().workAreaSize
      new BrowserWindow({
        backgroundColor: '#D1D1D1',
        height: .8*d.height,
        title: 'rental finder!',
        width: .8*d.width
      }).loadURL(`http://localhost:${port}`)
      fetchData()
    })
  ).catch(e => { throw e })
})

app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
})