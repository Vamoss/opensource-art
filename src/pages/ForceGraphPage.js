import React, { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import { ForceGraph } from "../datavis/ForceGraph";

import * as d3 from "d3";
import { useFileSystem } from "../hooks/useFileSystemState";

import styles from "./Layout.module.css";

const ForceGraphPage = () => {
  const svgRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const { loadFile } = useFileSystem();

  useEffect(() => {
    window.ipcRenderer.invoke("app:get-graph-data").then((newGraphData) => {
      setGraphData(newGraphData);
    });
  }, []);

  useEffect(() => {
    const handleGraphNodeClicked = (item) => {
      const clickedItemData = graphData.nodes.find(
        (selectedItem) => selectedItem.id === item.id
      );
      const itemDir = clickedItemData.group === 1 ? "initial" : "derived";
      loadFile({
        id: item.id,
        dir: itemDir,
      });
    };

    if (svgRef.current) {
      // Create root container where we will append all other chart elements
      const svgEl = d3.select(svgRef.current);
      svgEl.selectAll("*").remove();

      ForceGraph(svgEl, graphData, {
        nodeId: (d) => d.id,
        nodeGroup: (d) => d.group,
        nodeTitle: (d) => `${d.id}`,
        linkStrokeWidth: (l) => Math.sqrt(l.value),
        nodeRadius: 10,
        handleGraphNodeClicked,
      });

      return () => {
        svgEl.selectAll("*").remove(); // Clear svg content before adding new elements
      };
    }

    return () => {
      //destroy graph
    };
  }, [graphData]);

  return (
    <main className={styles.container}>
      <SideBar />
      <svg ref={svgRef} />
    </main>
  );
};

export default ForceGraphPage;
