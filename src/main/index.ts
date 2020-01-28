import { app, BrowserWindow, Menu } from "electron";
import { join as joinPath } from "path";
import { format as formatUrl } from "url";
import setIPC from "./IPC"
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from "electron-devtools-installer";

let mainWindow: BrowserWindow = null as any;

function focus() {
  if (mainWindow) {
    mainWindow.focus();
  }
}

function createMainWindow(): void {

  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    },
  });

  if (process.env.NODE_ENV === "production") {

    mainWindow.loadURL(formatUrl({
      protocol: "file",
      slashes: true,
      pathname: joinPath(__dirname, "index.html"),
    }));

  } else {

    mainWindow.webContents.openDevTools();
    installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
          .then(name => console.log(name))
          .catch(err => console.log(err));

    mainWindow.loadURL(formatUrl({
      protocol: "http",
      slashes: true,
      hostname: process.env.ELECTRON_WEBPACK_WDS_HOST,
      port: process.env.ELECTRON_WEBPACK_WDS_PORT,
    }));

    mainWindow.webContents.on("devtools-opened", () => {
      focus();
      setImmediate(focus);
    });

  }

  mainWindow.on("closed", () => {
    mainWindow = null as any;
  });

  // send headers
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    {urls: ['*://*/*']},
    (details: Electron.OnBeforeSendHeadersListenerDetails, callback: (beforeSendResponse: Electron.BeforeSendResponse)=>void) => {
      if(mainWindow) {
        mainWindow.webContents.send('onBeforeSendHeaders', details)
        callback({cancel: false, requestHeaders: details.requestHeaders});
      } else {
        callback({cancel: true, requestHeaders: details.requestHeaders});
      }
  })
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (!mainWindow) {
    createMainWindow();
  }
});

app.on("ready", () => {
  generateMenu()
  createMainWindow()
  setIPC(mainWindow)
});

// Mac用
// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  app.quit();
});

function generateMenu() {
  // Check if we are on a MAC
  if (process.platform === 'darwin') {
    // Create our menu entries so that we can use MAC shortcuts
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: app.getName(),
        submenu: [
          {role: 'quit'},
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
        ]
      },
      {
        label: 'View',
        submenu: [
          {role: 'togglefullscreen'},
          {role: 'minimize'},
        ]
      },
    ]));
  } else if (process.platform === 'win32') {
    // winではmenuを表示しない
    Menu.setApplicationMenu(null);
  }
}