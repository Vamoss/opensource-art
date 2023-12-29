import { useEffect, useState } from 'react'
import styles from './Admin.module.css'
import { useFileSystem } from '../hooks/useFileSystemState'

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

const KONAMY_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
]

let konami_index = 0

const PASSWORD = 'this is the pass'

const Admin = () => {
  const [passwordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const { activeSketch } = useFileSystem();
  
  const handleKeydown = (e) => {
    if (KONAMY_CODE[konami_index] === e.key) {
      konami_index += 1
    } else {
      konami_index = 0
    }

    if (konami_index >= KONAMY_CODE.length) {
      setIsPasswordModalOpen(true)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  const triggerCommand = () => {
    window.ipcRenderer.send("app:admin-run-command", {
      command: modalData.command,
      data: {
        id: activeSketch?.id
      }
    })

    setModalData(null)
  }

  return (
    <>
    {
      passwordModalOpen &&  
      <div className={styles.modal}>
        <input 
          className={styles.input} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <div className={styles.modalControls}>
          <button 
            className={styles.btn}
            onClick={() => {
              setIsPasswordModalOpen(false)
              setPassword('')
            }}
          >cancela</button>
          <button
            className={styles.btn}
            onClick={() => {
              if (password === PASSWORD) {
                setIsPasswordModalOpen(false)
                setPassword('')
                setIsOpen(true)
              }
            }}
          >confirma</button>
        </div>
      </div>
    }
    {
      isOpen &&  
      <div className={styles.container}>
        <p className={styles.text}>Admin</p>
        <p className={styles.text}>active sketch {activeSketch.id}</p>

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