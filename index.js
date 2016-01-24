import { fetchData, startServer } from './data-server'
import { BrowserWindow, app, screen } from 'electron'
import getPort from 'get-port'

app.on('ready', function() {
	getPort().then(port =>
		startServer(port).then(() => {
			const { height, width } = screen.getPrimaryDisplay().workAreaSize
			new BrowserWindow({
				backgroundColor: '#D1D1D1',
				height: .8*height,
				title: 'rental finder!',
				width: .8*width
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