import React, { useEffect, useState } from "react";
import { useFileSystem } from "../hooks/useFileSystemState";
import ErrorBar from "../components/ErrorBar";
import { useLocalization } from "../hooks/useLocalization";

const SCREEN_SAVER_WAITING_TIME = 5 * 60 * 1000; // 5 min

const Viewer = () => {
  const { currentInView } = useFileSystem();
  const { changeLanguage } = useLocalization();
  const [sketchError, setSketchError] = useState(null);

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
    window.ipcRenderer.receive("app:server-change-language", (language) => changeLanguage(language));
    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);

    return () => {
      window.removeEventListener("keydown", resetTimeout);
      window.removeEventListener("mousemove", resetTimeout);
      if (screenSaverTimer) clearTimeout(screenSaverTimer);
    };
  }, [changeLanguage]);

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
      
      //carrega o Physarum
      let physarum = document.getElementById("physarumscript");
      if (physarum === null) {
      physarum = document.createElement("script");
      physarum.setAttribute("defer", true);
      physarum.src = `/vendor/physarum.js`;
      physarum.id = `physarumscript`;
      document.body.appendChild(physarum);
      }
    };
 
    window.onerror = (message, source, lineno, colno, error) => {
      setSketchError({
        message,
        source,
        lineno,
        colno,
        error,
      });
    };

    sketchScript.src = `/main/data/${currentInView.dir}/${filePath}`;
  }, [currentInView]);

  return (
    sketchError && (
      <ErrorBar message={sketchError?.message} lineno={sketchError?.lineno} />
    )
  );
};

export default Viewer;
