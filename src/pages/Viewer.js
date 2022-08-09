import React, { useEffect } from "react";
import { useFileSystem } from "../hooks/useFileSystemState";

const SCREEN_SAVER_WAITING_TIME = 5 * 60 * 1000; // 5 min

const Viewer = () => {
  const { currentInView } = useFileSystem();

  useEffect(() => {
    var screenSaverTimer = null;
    const startScreenSaver = () => {
      // console.log("start screen saver", screenSaverTimer);
      window.location = "/screen-saver";
    };

    const resetTimeout = () => {
      // console.log("reset timeout", screenSaverTimer);
      if (screenSaverTimer) clearTimeout(screenSaverTimer);
      screenSaverTimer = setTimeout(
        startScreenSaver,
        SCREEN_SAVER_WAITING_TIME
      );
    };

    screenSaverTimer = setTimeout(startScreenSaver, SCREEN_SAVER_WAITING_TIME);

    window.ipcRenderer.receive("app:server-user-interaction", resetTimeout);
    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);

    return () => {
      window.removeEventListener("keydown", resetTimeout);
      window.removeEventListener("mousemove", resetTimeout);
      if (screenSaverTimer) clearTimeout(screenSaverTimer);
    };
  }, []);

  useEffect(() => {
    if (currentInView === null) {
      return;
    }

    let sketchScript = document.getElementById("sketchScript");
    if (sketchScript === null) {
      sketchScript = document.createElement("script");
      sketchScript.id = `sketchScript`;
      document.body.appendChild(sketchScript);
    }

    const filePath =
      currentInView.dir === "temp"
        ? currentInView.id
        : `${currentInView.id}/sketch.js`;

    sketchScript.onload = () => {
      let pscript = document.getElementById("p5script");
      if (pscript === null) {
        pscript = document.createElement("script");
        pscript.setAttribute("defer", true);
        pscript.src = `/vendor/p5.js`;
        pscript.id = `p5script`;
        document.body.appendChild(pscript);
      }
    };

    sketchScript.src = `/main/data/${currentInView.dir}/${filePath}`;
  }, [currentInView]);

  return <></>;
};

export default Viewer;
