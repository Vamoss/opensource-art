import p5 from "p5";
import React, { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import { meatballs } from "../datavis/MeatBalls";
import { useFileSystem } from "../hooks/useFileSystemState";
import styles from "./Layout.module.css";

const MeatBallsPage = () => {
  const sketchContainer = useRef();
  const [graphData, setGraphData] = useState([]);
  const { loadFile } = useFileSystem();

  const selectHandler = (item) => {
    loadFile({
      id: item.id,
      dir: item.parentId === null ? "initial" : "derived",
    });
  };

  const saveNewGraphData = (data, { width, height }) => {
    if (data.length === 0) return;
    const dataToSave = data.map((item) => {
      return {
        id: data.id,
        parentId: data.parentId,
        x: item.pos.x / width,
        y: item.pos.y / height,
      };
    });
    // window.ipcRenderer
    //   .invoke("app:save-graph-data", dataToSave)
    //   .then((savedData) => {
    //     console.log("saved", savedData);
    //   });
  };

  useEffect(() => {
    window.ipcRenderer.invoke("app:get-graph-data").then((newGraphData) => {
      setGraphData(newGraphData);
    });
  }, []);

  useEffect(() => {
    let sketch = null;

    if (sketchContainer.current) {
      // run sketch
      const width = sketchContainer.current.offsetWidth;
      const height = sketchContainer.current.offsetHeight;
      sketch = new p5(
        meatballs({
          width,
          height,
          data: graphData,
          selectHandler,
          saveNewGraphData,
        }),
        sketchContainer.current
      );
    }

    return () => {
      if (sketch !== null) {
        // destroy sketch
        sketch.remove();
      }
    };
  }, [graphData]);

  return (
    <main className={styles.container}>
      <SideBar />
      <div className={styles.graph} ref={sketchContainer}></div>
    </main>
  );
};

export default MeatBallsPage;
