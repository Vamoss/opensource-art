const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, screen, ipcMain } = require("electron");

const fileManager = require("./fileManager");
const stateModel = require("./stateModel");

let win;
let viewerWin;

function createWindow() {
  let displays = screen.getAllDisplays();
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });

  win = new BrowserWindow({
    // width: 800,
    // height: 600,
    kiosk: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  //win.webContents.openDevTools()

  win.loadURL("http://localhost:3000");

  viewerWin = new BrowserWindow({
    // width: 800,
    // height: 600,
    x: externalDisplay.bounds.x + 50,
    y: externalDisplay.bounds.y + 50,
    kiosk: true,
    autoHideMenuBar: true,
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

// funções de file management

/**
 * filedata = {
 *  id: string;
 *  name: string;
 *  dir: string;
 * }
 */
const loadFile = (ev, fileData) => {
  const file = fileManager.loadFile(fileData);
  if (file) {
    fileManager.updateAppState(
      stateModel.updateStateToActivateSketchFromFile(file)
    );
    viewerWin.webContents.send("app:reload-viewer", file);
    return file;
  }
};

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

ipcMain.handle("app:load-file", loadFile);

ipcMain.handle("app:save-file", (ev, file) => {
  fileManager.saveFile(file);
  
  loadFile(null, {
    name: file.name,
    id: file.id,
    dir: "derived",
  });

  const appState = fileManager.getAppState(stateModel.getDefaultState());

  return appState;
});

ipcMain.handle("app:get-graph-data", () => {
  const graphData = fileManager.getGraphDataFile();
  return graphData;
});

ipcMain.handle("app:save-graph-data", (ev, data) => {
  const graphData = fileManager.saveGraphDataFile(data);
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

ipcMain.on("app:update-file", (ev, file) => {
  fileManager.updateFile(file);
});

ipcMain.on("app:editor-user-interaction", () => {
  viewerWin.webContents.send("app:server-user-interaction");
});

ipcMain.on("app:editor-change-language", (ev, language) => {
  viewerWin.webContents.send("app:server-change-language", language);
});