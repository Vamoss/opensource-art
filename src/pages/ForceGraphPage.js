import React, { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import { ForceGraph } from "../datavis/ForceGraph";

import * as d3 from "d3";

const ForceGraphPage = () => {
  const svgRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    window.ipcRenderer.invoke("app:get-graph-data").then((newGraphData) => {
      setGraphData(newGraphData);
    });
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      // Create root container where we will append all other chart elements
      const svgEl = d3.select(svgRef.current);
      svgEl.selectAll("*").remove();

      ForceGraph(svgEl, graphData, {
        nodeId: (d) => d.id,
        nodeGroup: (d) => d.group,
        nodeTitle: (d) => `${d.id}\n${d.group}`,
        linkStrokeWidth: (l) => Math.sqrt(l.value),
      });

      return () => {
        svgEl.selectAll("*").remove(); // Clear svg content before adding new elements
      };

      //svg.append(chart);
    }

    return () => {
      //destroy graph
    };
  }, [svgRef.current, graphData]);

  return (
    <main className="container">
      <SideBar />
      <svg ref={svgRef} />
    </main>
  );
};

export default ForceGraphPage;
