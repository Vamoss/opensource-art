import { useState } from 'react'
import styles from './Admin.module.css'

const REINICIAR_MESSAGE = 'Tem certeza que voce quer reiniciar a instalação, todos os dados serão perdidos caso não tenha feito o backup.'
const CRIAR_BACKUP_MESSAGE = 'Tem certeza que voce quer criar o backup da instalação?'
const REMOVER_SKETCH_MESSAGE = 'Tem certeza que voce quer remover essa sketch?'

const MODAL_DATA = {
  reiniciar: {
    command: 'reiniciar-instalacao',
    message: REINICIAR_MESSAGE
  },
  criarBackup: {
    command: 'criar-backup',
    message: CRIAR_BACKUP_MESSAGE
  },
  removerSketch: {
    command: 'remover-sketch',
    message: REMOVER_SKETCH_MESSAGE
  },
}

const Admin = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  
  window.openAdmin = () => {
    setIsOpen(true)
  }

  const triggerCommand = (command) => {
    window.ipcRenderer.send("app:admin-run-command", {
      command: modalData.command
    })

    setModalData(null)
  }

  return (
    <>
    {
      isOpen &&  
      <div className={styles.container}>
          <button
            onClick={() => setIsOpen(false)} 
            className={`${styles.btn} ${styles.closeBtn}`}
          >X</button>

          <div className={styles.controlsContainer}>
            <button
              onClick={() => setModalData(MODAL_DATA.reiniciar)}
              className={`${styles.btn}`}
            >reiniciar instalação</button>

            <button
              onClick={() => setModalData(MODAL_DATA.criarBackup)}
              className={`${styles.btn}`}
            >criar backup</button>

            <button
              onClick={() => setModalData(MODAL_DATA.removerSketch)}
              className={`${styles.btn}`}
            >remover sketch</button>
          </div>

          {
            modalData &&
            <div className={styles.modal}>
              {modalData.message}
              <div className={styles.modalControls}>
                <button 
                  className={styles.btn}
                  onClick={() => setModalData(null)}
                >cancela</button>
                <button
                  className={styles.btn}
                  onClick={triggerCommand}
                >confirma</button>
              </div>
            </div>
          }
        </div>
      }
    </>
  )
}

export default Admin