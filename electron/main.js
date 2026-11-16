// Dil Bahçesi – Windows, Mac ve Linux masaüstü uygulaması
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function pencereAc() {
  const win = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 380,
    minHeight: 560,
    title: 'Dil Bahçesi',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#EAF3F6',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.removeMenu();
  win.loadFile(path.join(__dirname, '..', 'www', 'index.html'));

  // Uygulama dışındaki bağlantılar normal tarayıcıda açılsın
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Aynı anda yalnızca bir pencere açık olsun
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const w = BrowserWindow.getAllWindows()[0];
    if (w) { if (w.isMinimized()) w.restore(); w.focus(); }
  });
  app.whenReady().then(() => {
    pencereAc();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) pencereAc(); });
  });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}
