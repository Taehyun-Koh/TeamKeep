const { app, BrowserWindow, ipc } = require('electron');
const path = require('path');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 480, //480 -> 900 (디버깅용)
        height: 770,
        resizable: false,
        show:false,
        title: "TeemKeep",
        icon: __dirname + 'assets/icons/png/icon.png',
        webPreferences: { 
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration : true,
            contextIsolation : false,
            enableRemoteModule : true,
            devTools: false,
        },
    });
    //페이지 모두 로딩될때까지 기다렸다가 show
    win.once('ready-to-show', () => {
        win.show()
    })
    win.setMenuBarVisibility(false);
    win.setFullScreenable(false);
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