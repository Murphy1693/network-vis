import React, { useState, useEffect, useRef, useReducer } from "react";
import Graph from "./Graph.js";
import Panel from "./Panel.js";
import { createColorAndCount } from "../compareFunctions.js";
import FileSelector from "./FileSelector/FileSelector.js";
import GraphPanel from "./GraphPanel/GraphPanel.js";

import * as d3 from "d3";
// import Graph2 from "./Graph/Graph2.js";
// sample_id,Ara2,AS1,AS11,AS12,AS14,AS15,AS19,AS2,AS21,AS25,AS3,AS31,AS32,AS34,AS7,AS8,B7M19,PFG377,PfPK2,PolyA,TA1,TA109,TA40,TA60,TA81,TA87,Date
/*
[15, 127, 133, 41, 124, 137, 142, 192, 199]
*/

let vis;

let defaultGraph = {
  width: 1000,
  height: 600,
  nodeSize: 4,
  nodeOpacity: 1,
  nodeColor: "#000000",
  linkDistance: 30,
  arrowSize: 4,
  primaryLinkOpacity: 1,
  secondaryLinkOpacity: 1,
  primaryLinkColor: "#000000",
  secondaryLinkColor: "#000000",
  toggleAdditionalLinks: false,
  zoom: 1,
};

// const reducer = (state, action) => {
//   for (let k in state) {
//     if (action.prop === k) {
//       simulationRef.current.stop();
//       return { ...state, [[k]]: action.newValue };
//     }
//   }
//   return state;
// };

const App = () => {
  const reducer = (state, action) => {
    console.log(action);
    for (let k in state) {
      if (action.prop === k) {
        simulationRef.current.stop();
        return { ...state, [[k]]: action.newValue };
      }
    }
    return state;
  };
  const refElement = useRef(null);
  const inputFile = useRef(null);
  const [activeFile, setActiveFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [active, setActive] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [simulation, setSimulation] = useState(null);
  const simulationRef = useRef(null);
  const [primaryNode, setPrimaryNode] = useState(null);
  const [secondaryNodes, setSecondaryNodes] = useState([]);
  const [additionalLinks, setAdditionalLinks] = useState([]);
  // const [toggleLinks, setToggleLinks] = useState(false);
  // const [link_distance, setLink_distance] = useState(50);
  // const [arrowSize, setArrowSize] = useState(4);
  // const [nodeColor, setNodeColor] = useState("#000000");
  // const [nodeOpacity, setNodeOpacity] = useState(1);
  // const [linkOpacity, setLinkOpacity] = useState(1);
  // const [nodeSize, setNodeSize] = useState(5);
  const [graphSettings, graphDispatch] = useReducer(reducer, defaultGraph);
  // let additionalToggle = function () {
  //   simulationRef.current.stop();
  //   setToggleLinks(!toggleLinks);
  // };

  useEffect(() => {
    setAdditionalLinks(
      [
        { from: "15", to: "84" },
        { from: "15", to: "127" },
        { from: "15", to: "133" },
        { from: "15", to: "41" },
        { from: "15", to: "124" },
        { from: "15", to: "137" },
        { from: "15", to: "142" },
        { from: "15", to: "192" },
        { from: "15", to: "199" },
      ].map((link) => {
        nodes.forEach((node) => {
          if (node.id === link.from) {
            console.log("triggered");
            link.source = node;
          } else if (node.id === link.to) {
            link.target = node;
          }
        });
        return link;
      })
    );
  }, [nodes]);

  let clearSelected = function () {
    setSelectedNodes([]);
  };

  const initializeData = (data) => {
    setActiveFile(selectedFile);
    setSelectedFile(null);
    setSelectedNodes([]);
    setActive(null);
    setPrimaryNode(null);
    setSecondaryNodes([]);
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
  };

  useEffect(() => {
    d3.json("/data/full_nodes.json").then((data) => {
      setLinks(
        data.network.map((ele) => {
          data.nodes.forEach((node) => {
            if (node.id === ele.to || node.id === ele.from) {
              node.hasLink = true;
            }
          });
          return {
            ...ele,
            source: data.nodes[parseInt(ele.from) - 1],
            target: data.nodes[parseInt(ele.to) - 1],
          };
        })
      );
      console.log(data);
      setNodes(data.nodes);
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
      primary.latent_matches = [];
      primary.source = [];
      for (let i = 0; i < secondaries.length; i++) {
        primary.matches.push(secondaries[i].shared_count);
        primary.latent_matches.push(secondaries[i].latent_shared_count);
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

  let handleAddActiveId = function (id) {
    let newNodes = [...selectedNodes];
    id = parseInt(id);
    if (selectedNodes.includes(id)) {
      newNodes.splice(newNodes.indexOf(id), 1);
    }
    setSelectedNodes(newNodes);
    setActive(id);
  };

  let handleAddSelectedId = function (id) {
    let newNodes = [...selectedNodes];
    id = parseInt(id);

    if (active === id) {
      setActive(null);
      setSelectedNodes([...newNodes, id]);
    } else if (!selectedNodes.includes(id)) {
      setSelectedNodes([...newNodes, id]);
    }
  };

  let handleNodeClick = function (id, event, mutableNodes) {
    simulationRef.current.stop();
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

  // useEffect(() => {

  // }, [links])

  // let handleNodeClick = function (id, event, mutableNodes) {
  //   let newSelected = [...selectedNodes];
  //   mutableNodes[id].color = "yellow";
  //   setNodes(mutableNodes);
  //   console.log("changing");
  // };

  let colors = ["blue", "green", "orange", "purple"];

  useEffect(() => {
    console.log("changing graph");
    initVis();
  }, [
    selectedNodes,
    active,
    links,
    nodes,
    simulation,
    additionalLinks,
    graphSettings,
  ]);

  function initVis() {
    const d3Props = {
      data: {
        nodes: nodes,
        links: links,
      },
      colors: colors,
      showLinks: true,
      width: graphSettings.width,
      height: graphSettings.height,
      active: active,
      onDatapointClick: handleNodeClick,
      simulationRef: simulationRef,
      selected: selectedNodes,
      simulation: simulation,
      additionalLinks: additionalLinks,
      toggleLinks: graphSettings.toggleAdditionalLinks,
      link_distance: graphSettings.linkDistance,
      arrowSize: graphSettings.arrowSize,
      nodeColor: graphSettings.nodeColor,
      nodeOpacity: graphSettings.nodeOpacity,
      linkOpacity: graphSettings.primaryLinkOpacity,
      nodeSize: graphSettings.nodeSize,
    };
    vis = new Graph(refElement.current, d3Props);
  }
  const onButtonClick = (e) => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  return (
    <div className="container">
      <div>
        <h1 style={{ textAlign: "center" }}>
          Network Visualizer{graphSettings.nodeSize}
        </h1>
      </div>
      <GraphPanel
        handleAddActiveId={handleAddActiveId}
        handleAddSelectedId={handleAddSelectedId}
        simulationRef={simulationRef}
        graphDispatch={graphDispatch}
        graphSettings={graphSettings}
        // setNodeColor={setNodeColor}
        // nodeColor={nodeColor}
        // arrowSize={arrowSize}
        // setArrowSize={setArrowSize}
      ></GraphPanel>
      {/* <FileSelector
        initializeData={initializeData}
        setSelectedFile={setSelectedFile}
        inputFile={inputFile}
        selectedFile={selectedFile}
        activeFile={activeFile}
      ></FileSelector> */}
      {/* <button
        onClick={() => {
          console.log(selectedFile);
          let reader = new FileReader();
          reader.readAsText(selectedFile);
          reader.onload = function () {
            initializeData(JSON.parse(reader.result));
          };
          // d3.json(selectedFile).then((data) => {
          //   console.log(data);
          // });
        }}
      ></button> */}
      <canvas
        width={graphSettings.width}
        height={graphSettings.height}
        ref={refElement}
      />
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
