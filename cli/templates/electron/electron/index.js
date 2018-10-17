import { app, BrowserWindow } from 'electron';

app.on('ready', () => {
	const mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
	});

	mainWindow.loadURL('http://localhost:3000');
	mainWindow.webContents.on('did-finish-load', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}

		mainWindow.show();
		mainWindow.focus();
	});
});
