import React, { useState, useEffect, useRef } from "react";
import Graph from "./Graph.js";
import Panel from "./Panel.js";
import { createColorAndCount } from "../compareFunctions.js";
import FileSelector from "./FileSelector/FileSelector.js";

import * as d3 from "d3";
// import Graph2 from "./Graph/Graph2.js";
// sample_id,Ara2,AS1,AS11,AS12,AS14,AS15,AS19,AS2,AS21,AS25,AS3,AS31,AS32,AS34,AS7,AS8,B7M19,PFG377,PfPK2,PolyA,TA1,TA109,TA40,TA60,TA81,TA87,Date

let vis;

const App = () => {
  const refElement = useRef(null);
  const [active, setActive] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [simulation, setSimulation] = useState(null);
  const [primaryNode, setPrimaryNode] = useState(null);
  const [secondaryNodes, setSecondaryNodes] = useState([]);

  let clearSelected = function () {
    setSelectedNodes([]);
  };

  useEffect(() => {
    d3.json("/data/full_nodes.json").then((data) => {
      setNodes(data.nodes);
      setLinks(
        data.network.map((ele) => {
          return {
            ...ele,
            source: data.nodes[parseInt(ele.from) - 1],
            target: data.nodes[parseInt(ele.to) - 1],
          };
        })
      );
      console.log(data);
    });
  }, []);

  useEffect(() => {
    if (active && !selectedNodes.length) {
      setPrimaryNode(createColorAndCount(nodes[active]));
    } else if (active && selectedNodes.length > 0) {
      let primary;
      let secondaries = selectedNodes.map(function (nodeIndex) {
        const [prim, sec] = createColorAndCount(
          nodes[active],
          nodes[nodeIndex]
        );
        primary = prim;
        return sec;
      });
      primary.matches = [];
      primary.source = [];
      for (let i = 0; i < secondaries.length; i++) {
        primary.matches.push(secondaries[i].shared_count);
      }
      for (let i = 0; i < links.length; i++) {
        if (links[i].to === primary.id || links[i].from === primary.id) {
          for (let y = 0; y < secondaries.length; y++) {
            if (secondaries[y].id === links[i].from) {
              secondaries[y].target = false;
              primary.source[y] = false;
            } else if (nodes[selectedNodes[y]].id === links[i].to) {
              secondaries[y].target = true;
              primary.source[y] = true;
            }
          }
        }
      }
      setPrimaryNode(primary);
      setSecondaryNodes(secondaries);
    } else if (!active) {
      setPrimaryNode(null);
      setSecondaryNodes(
        selectedNodes.map((nodeIndex) => {
          return createColorAndCount(nodes[nodeIndex]);
        })
      );
    }
    if (!selectedNodes.length) {
      setSecondaryNodes([]);
    }
  }, [selectedNodes, active]);

  let handleNodeClick = function (id, event, mutableNodes, simulation) {
    simulation.stop();
    let newNodes = [...selectedNodes];
    if (event.ctrlKey) {
      console.log("SETTING ACTIVE");
      if (active === id) {
        setActive(null);
      } else {
        if (selectedNodes.includes(id)) {
          newNodes.splice(newNodes.indexOf(id), 1);
        }
        setActive(id);
      }
    } else if (event.shiftKey && id !== active) {
      if (!selectedNodes.includes(id)) {
        newNodes.push(id);
      } else {
        newNodes.splice(newNodes.indexOf(id), 1);
      }
    } else {
      if (newNodes.indexOf(id) !== -1) {
        newNodes.splice(newNodes.indexOf(id), 1);
      }
      if (active === id) {
        setActive(null);
      } else {
        setActive(id);
      }
    }
    setSelectedNodes(newNodes);
  };

  // let handleNodeClick = function (id, event, mutableNodes) {
  //   let newSelected = [...selectedNodes];
  //   mutableNodes[id].color = "yellow";
  //   setNodes(mutableNodes);
  //   console.log("changing");
  // };

  let colors = ["blue", "green", "orange", "purple"];

  useEffect(() => {
    initVis();
  }, [selectedNodes, links, nodes, simulation]);

  function initVis() {
    const d3Props = {
      data: {
        nodes: nodes,
        links: links,
      },
      colors: colors,
      showLinks: true,
      width: 1500,
      height: 1000,
      active: active,
      onDatapointClick: handleNodeClick,
      selected: selectedNodes,
      simulation: simulation,
    };
    vis = new Graph(refElement.current, d3Props);
  }
  const onButtonClick = (e) => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  return (
    <div className="container">
      <button
        onClick={() => {
          console.log(primaryNode);
          console.log(secondaryNodes);
        }}
      >
        Nodes
      </button>
      <button
        onClick={() => {
          console.table(links);
        }}
      >
        Links
      </button>
      <FileSelector></FileSelector>
      <canvas width="1200" height="900" ref={refElement} />
      <Panel
        clearSelected={clearSelected}
        colors={colors}
        // nodes={nodes}
        // links={links}
        // selectedNodes={selectedNodes}
        // active={active}
        activeNode={primaryNode}
        compareNodes={secondaryNodes}
      ></Panel>
    </div>
  );
};

export default App;
