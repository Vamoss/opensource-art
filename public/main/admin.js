const path = require('path');
const { spawn } = require('child_process'); // See https://github.com/calvinmetcalf/rollup-plugin-node-builtins/issues/50
const fileManager = require('./fileManager');
const stateModel = require('./stateModel');

/**
 * @public
 * Run build script from node
 * @param {boolean} yarn
 * @param {function} cb - A callback function
 */
const runScript = (scriptName, cb) => {
  const args = [];
  
  const ls = spawn('bash', [path.join(__dirname, scriptName)].concat(args), { stdio: 'inherit' });
  ls.on('close', (code) => {
    console.log('COMPLETED RUNNING :: ' + scriptName + " :: with code :: " + code)
    if(cb) {
      cb()
    }
  });
}

exports.runCommand = (command, data) => {
  switch (command) {
    case 'reiniciar-instalacao':
      fileManager.deleteFolders()
      fileManager.bootInstalation()
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