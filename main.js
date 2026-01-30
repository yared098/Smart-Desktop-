const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const Store = require("electron-store").default;
const path = require("path");

app.setName("Smart Restaurant Desktop App");

// Local storage config
const store = new Store({
  name: "config",
  defaults: { webUrl: "" },
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Smart Restaurant Desktop App",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true, // allow ipcRenderer in setup.html
    },
  });

  const url = store.get("webUrl");

  if (!url) {
    // No URL saved → open setup page
    mainWindow.loadFile(path.join(__dirname, "setup.html"));
  } else {
    // URL saved → load it
    mainWindow.loadURL(url);
  }
}

// Receive URL from setup.html and save it
ipcMain.on("save-url", (event, url) => {
  if (!url || !url.startsWith("http")) {
    return dialog.showErrorBox("Invalid URL", "Please enter a valid URL starting with http or https.");
  }

  store.set("webUrl", url);   // save to local storage
  mainWindow.loadURL(url);    // load the URL
});

// Optional: reset URL from menu or shortcut
ipcMain.on("reset-url", () => {
  store.set("webUrl", ""); // clear saved URL
  mainWindow.loadFile(path.join(__dirname, "setup.html"));
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
