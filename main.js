const {app, BrowserWindow, Menu} = require("electron");
const fs = require('fs');
var highlightjs = require("highlight.js");

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

let win;

function createWindow () {

	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.loadFile('index.html');
	win.webContents.toggleDevTools();

	var menu = Menu.buildFromTemplate([
		{
			label: "Menu",
			submenu: [
				{
					label:"open",
					click() {
						openFileDialog();
					}
				},
				{label:"export as"},
				{
					label:"exit",
					click() {
						app.quit();
					}
				},
			]
		}
	]);
	Menu.setApplicationMenu(menu);
}

function openFileDialog() {

	// const {dialog} = require('electron').remote.dialog;
	const {dialog} = require('electron');
	// return;

	let dl = dialog.showOpenDialog(BrowserWindow,
		{
			properties: ['openFile'],
			title: 'Select a flie',
			// defaultPath: '.',
			defaultPath: './tests',
			filters: [
				{name: 'file', extensions: ['*']}
			]
		}).then(result => {
			readFile(result.filePaths[0]);

		}).catch(err => {
			console.log(err);
		});
}

function readFile(filepath) { 
	fs.readFile(filepath, 'utf-8', (err, data) => { 
		if(err){ 
			alert("An error ocurred reading the file :" + err.message) 
			return;
		} 
		win.webContents.send("file-open", data);
	}) 
} 

