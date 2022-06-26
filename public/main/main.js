const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, shell, ipcMain } = require("electron");

const fileManager = require("./fileManager");

let win;
let viewerWin;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:3000");

  viewerWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  viewerWin.loadURL("http://localhost:3000/viewer");
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Comunição entre o browser e o nativo

ipcMain.handle("app:get-app-state", (ev, defaultState) => {
  const appState = fileManager.getAppState(defaultState);
  const file = fileManager.loadFile(appState.currentSketch);
  return { ...appState, ...file };
});

ipcMain.handle("app:get-files", () => {
  return fileManager.getFileList();
});

ipcMain.handle("app:load-file", (ev, fileData) => {
  const file = fileManager.loadFile(fileData);
  fileManager.updateAppState({
    currentSketch: fileData,
  });
  viewerWin.webContents.send("app:reload-viewer", file);
  return file;
});

ipcMain.on("app:run-sketch", (ev, file) => {
  fileManager.updateAppState({
    currentSketch: {
      name: file.name,
      dir: "temp",
    },
  });
  fileManager.saveTempFile(file, viewerWin);
});

ipcMain.on("app:save-file", (ev, file) => {
  fileManager.saveFile(file);
});

ipcMain.on("app:update-file", (ev, file) => {
  fileManager.updateFile(file);
});
