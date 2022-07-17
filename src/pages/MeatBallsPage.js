import p5 from "p5";
import React, { useEffect, useRef } from "react";
import SideBar from "../components/SideBar";
import { meatballs } from "../datavis/MeatBalls";
import styles from "./Layout.module.css";

const MeatBallsPage = () => {
  const sketchContainer = useRef();

  useEffect(() => {
    let sketch = null;

    if (sketchContainer.current) {
      // run sketch
      const width = sketchContainer.current.offsetWidth;
      const height = sketchContainer.current.offsetHeight;
      sketch = new p5(meatballs({ width, height }), sketchContainer.current);
    }

    return () => {
      if (sketch !== null) {
        // destroy sketch
        sketch.remove();
      }
    };
  }, []);

  return (
    <main className={styles.container}>
      <SideBar />
      <div className={styles.graph} ref={sketchContainer}></div>
    </main>
  );
};

export default MeatBallsPage;
