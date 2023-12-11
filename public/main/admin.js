const path = require('path');
const { spawn } = require('child_process'); // See https://github.com/calvinmetcalf/rollup-plugin-node-builtins/issues/50
const fileManager = require('./fileManager');

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


exports.runCommand = (command) => {
  switch (command) {
    case 'reiniciar-instalacao':
      runScript('cleanup.sh', () => {
        fileManager.bootInstalation()
      })
      break;
    case 'criar-backup':
      runScript('create-backup.sh')
      break;
    case 'remover-sketch':
      break;
    default:
      break;
  } 
}