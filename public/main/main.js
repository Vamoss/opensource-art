const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, shell, ipcMain } = require("electron");

const fileManager = require("./fileManager");
const stateModel = require("./stateModel");

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

ipcMain.handle("app:get-app-state", () => {
  const appState = fileManager.getAppState(stateModel.getDefaultState());
  const file = fileManager.loadFile(appState.currentInView);
  return {
    ...appState,
    // carrega a atual versão do current in view pra mostrar o código quando inicia o app
    code: file.content,
  };
});

ipcMain.handle("app:get-files", () => {
  return fileManager.getFileList();
});

ipcMain.handle("app:load-file", (ev, fileData) => {
  const file = fileManager.loadFile(fileData);
  fileManager.updateAppState(
    stateModel.updateStateToActivateSketchFromFile(file)
  );
  viewerWin.webContents.send("app:reload-viewer", file);
  return file;
});

ipcMain.handle("app:get-graph-data", () => {
  const graphData = fileManager.getGraphDataFile();
  return graphData;
});

ipcMain.on("app:run-sketch", (ev, file) => {
  const appState = fileManager.getAppState(stateModel.getDefaultState());
  fileManager.updateAppState({
    ...appState,
    currentInView: {
      id: file.id,
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
