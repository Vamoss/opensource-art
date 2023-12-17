import p5 from "p5";
import React, { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import { meatballs } from "../datavis/MeatBalls.v2";
import { useFileSystem } from "../hooks/useFileSystemState";
import styles from "./Layout.module.css";

const MeatBallsPage = () => {
  const sketchContainer = useRef();
  const [graphData, setGraphData] = useState([]);
  const { loadFile, currentInView } = useFileSystem();

  const saveNewGraphData = (data, { width, height }) => {
    if (data.length === 0) return;
    const dataToSave = data.map((item) => {
      return {
        id: item.id,
        parentId: item.parentId,
        originalParentId: item.parentId,
        r: item.r,
        g: item.g,
        b: item.b,
        x: item.pos.x / width,
        y: item.pos.y / height,
      };
    });

    window.ipcRenderer
      .invoke("app:save-graph-data", dataToSave)
      .then((savedData) => {
        console.log("saved", savedData);
      });
  };

  useEffect(() => {
    const sendUserInteractionEvent = () => {
      window.ipcRenderer.send("app:editor-user-interaction");
    };
    window.addEventListener("mousemove", sendUserInteractionEvent);
    window.addEventListener("keydown", sendUserInteractionEvent);

    return () => {
      window.removeEventListener("mousemove", sendUserInteractionEvent);
      window.removeEventListener("keydown", sendUserInteractionEvent);
    };
  }, []);

  useEffect(() => {
    window.ipcRenderer.invoke("app:get-graph-data").then((newGraphData) => {
      setGraphData(newGraphData);
    });
  }, []);

  useEffect(() => {
    if (graphData.length === 0) return;
    let sketch = null;

    const selectHandler = (item) => {
      if (currentInView.id === item.id) return;
      loadFile({
        id: item.id,
        dir: item.parentId === null ? "initial" : "derived",
      });
    };

    if (sketchContainer.current) {
      // run sketch
      const windowWidth = sketchContainer.current.offsetWidth;
      const windowHeight = sketchContainer.current.offsetHeight;
      sketch = new p5(
        meatballs({
          windowWidth,
          windowHeight,
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
  }, [graphData, loadFile, currentInView]);

  return (
    <main className={styles.container}>
      <SideBar />
      <div className={styles.graph} ref={sketchContainer}></div>
    </main>
  );
};

export default MeatBallsPage;
