const fileManager = require('./fileManager');
const stateModel = require('./stateModel');

exports.runCommand = (command, data) => {
  switch (command) {
    case 'reiniciar-instalacao':
      console.log("processo :: REINICIAR INSTALAÇÃO :: inicializado")
      fileManager.deleteFolders()
      console.log("processo :: REINICIAR INSTALAÇÃO :: iniciando reboot")
      fileManager.bootInstalation(stateModel.getDefaultState())
      break;
    case 'criar-backup':
      console.log("processo :: CRIAR BACKUP :: inicializado")
      fileManager.createBackup()
      break;
    case 'remover-sketch':
      if (data && data.id) {
        fileManager.removeNodeFromGraph(data.id, stateModel.getDefaultState())
      }
      console.log("processo :: REMOVER SKETCH :: concluido")
      break;
    default:
      break;
  } 
}