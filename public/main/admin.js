const path = require('path');
const { spawn } = require('child_process'); // See https://github.com/calvinmetcalf/rollup-plugin-node-builtins/issues/50
const fileManager = require('./fileManager');
const stateModel = require('./stateModel');

exports.runCommand = (command, data) => {
  switch (command) {
    case 'reiniciar-instalacao':
      fileManager.deleteFolders()
      fileManager.bootInstalation(stateModel.getDefaultState())
      break;
    case 'criar-backup':
      fileManager.createBackup()
      break;
    case 'remover-sketch':
      if (data && data.id) {
        fileManager.removeNodeFromGraph(data.id, stateModel.getDefaultState())
      }
      break;
    default:
      break;
  } 
}