const { app, BrowserWindow, ipc } = require('electron');
const path = require('path');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 1000,
        webPreferences: { 
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration : true,
            contextIsolation : false,
            enableRemoteModule : true,
        }
    });

    win.webContents.openDevTools();
    win.loadFile('login.html');
};
 
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});