import { useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

import { FileSystemContext } from "./FileSystemContext";
import { defaultState, initialState } from "./initialState";
import { reducer } from "./reducer";

export const FileSystemProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateCode = (code) => {
    dispatch({ type: "update_code", payload: code });
  };

  /**
   * Internal methods comunication with file system
   */

  useEffect(() => {
    window.ipcRenderer
      .invoke("app:get-files")
      .then((files = initialState.files) => {
        dispatch({ type: "update_files", payload: files });
      });
  }, []);

  useEffect(() => {
    window.ipcRenderer
      .invoke("app:get-app-state", defaultState)
      .then((appState = initialState.currentSketch) => {
        dispatch({
          type: "update_state",
          payload: {
            currentSketch: appState.currentSketch,
            code: appState.content,
          },
        });
      });
  }, []);

  /**
   * Exposed methods for comunication with file system
   */

  const runSketch = () => {
    const sketchName = `${uuidv4()}.js`;
    window.ipcRenderer.send("app:run-sketch", {
      name: `${uuidv4()}.js`,
      content: state.code,
    });

    dispatch({
      type: "update_state",
      payload: {
        currentSketch: {
          name: sketchName,
          dir: "temp",
        },
      },
    });
  };

  const loadFile = (fileData = { dir: null, name: null }) => {
    window.ipcRenderer.invoke("app:load-file", fileData).then((file = null) => {
      if (file === null) {
        return;
      }
      dispatch({
        type: "update_state",
        payload: {
          currentSketch: fileData,
          code: file.content,
        },
      });
    });
  };

  const saveFile = () => {
    window.ipcRenderer.send("app:save-file", {
      parent: state?.currentSketch?.name,
      name: `${uuidv4()}`,
      content: state.code,
    });
  };

  return (
    <FileSystemContext.Provider
      value={{ ...state, updateCode, runSketch, loadFile, saveFile }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
