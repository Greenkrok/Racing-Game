const dir = '../../';
const url = require('url').format({
  protocol: 'file',
  slashes: true,
  pathname: require('path').join(dir, 'index.html')
});

const {app, BrowserWindow} = require('electron');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1024,
    height: 768
  });

  win.loadURL(url);

  win.on('closed', function(){
    win = null;
  });

}

app.whenReady().then(() => {
  createWindow()
});

app.on('window-all-closed', function(){
  app.quit();
});
