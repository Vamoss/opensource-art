import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { FileSystemContext } from "./FileSystemContext";
import { getFileMetaData } from "./getFileMeta";
import { defaultPersistentState, initialState } from "./initialState";
import { reducer } from "./reducer";

const ALLOW_RUN_SKETCH_DEBOUNCE_TIME = 1000

export const FileSystemProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  let navigate = useNavigate();

  const updateCode = (code) => {
    dispatch({ type: "update_code", payload: code });
  };

  useEffect(() => {
    let allowRunSketchTimeout = null
    if(!state.canRunSketch) {
      allowRunSketchTimeout = setTimeout(() => {
        dispatch({ type: "allow_run_sketch" })
      }, ALLOW_RUN_SKETCH_DEBOUNCE_TIME)
    };

    return () => {
      if (allowRunSketchTimeout) {
        clearTimeout(allowRunSketchTimeout)
      }
    }
  })

  /**
   * Internal methods comunication with file system
   */

  useEffect(() => {
    window.ipcRenderer
      .invoke("app:get-app-state", defaultPersistentState)
      .then((appState) => {
        dispatch({
          type: "update_state",
          payload: appState,
        });
      });
  }, []);

  useEffect(() => {
    window.ipcRenderer.invoke("app:get-files").then((files) => {
      dispatch({ type: "update_files", payload: files });
    });
  }, []);

  /**
   * Exposed methods for comunication with file system
   */

  const runSketch = () => {
    if (!state.canRunSketch) {
      return
    }
    const sketchName = `${uuidv4()}.js`;
    window.ipcRenderer.send("app:run-sketch", {
      id: sketchName,
      content: state.code,
    });

    dispatch({
      type: "update_state",
      payload: {
        currentInView: {
          id: sketchName,
          dir: "temp",
        },
      },
    });
  };

  const loadFile = (fileData = { dir: null, id: null, name: null }) => {
    if (fileData.dir === null) {
      // informar que está faltando coisa
      return;
    }

    if (fileData.id === null) {
      // informar que está faltando coisa
      return;
    }

    window.ipcRenderer.invoke("app:load-file", fileData).then((newState) => {
      if (newState === null) {
        return;
      }
      dispatch({
        type: "update_state",
        payload: newState,
      });
    });
  };

  const saveFile = () => {
    const fileId = uuidv4();
    const fileMetaData = getFileMetaData(
      {
        id: fileId,
        name: fileId,
        code: state.code,
      },
      state.activeSketch
    );
    window.ipcRenderer
      .invoke("app:save-file", fileMetaData)
      .then((newState) => {
        if (newState === null) {
          return;
        }
        dispatch({
          type: "update_state",
          payload: newState,
        });
        navigate("/force-graph");
      });
  };

  return (
    <FileSystemContext.Provider
      value={{ 
        ...state,
        updateCode,
        runSketch,
        loadFile,
        saveFile 
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
