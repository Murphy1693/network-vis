import React, { useState, useEffect } from "react";
import { compareObserved, paginateArray } from "../compareFunctions.js";
import NodeBox from "./NodeBox/NodeBox.js";

let zip = function (arr1, arr2, callback) {
  for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
    callback(arr1[i], arr2[i]);
  }
};

const Panel = ({
  selectedNodes,
  active,
  nodes,
  links,
  colors,
  clearSelected,
  activeNode,
  compareNodes,
}) => {
  const [page, setPage] = useState(0);
  // let [compareNodes, setCompareNodes] = useState([]);
  // let [activeNode, setActiveNode] = useState({});

  // useEffect(() => {
  //   let newNodes;
  //   let newActiveNode;
  //   if (active) {
  //     newActiveNode = {
  //       ...nodes[active],
  //       observed_genotype_color: paginateArray(nodes[active].observed_genotype),
  //       source: [],
  //     };
  //     newNodes = selectedNodes.map(function (nodeIndex, i) {
  //       return compareObserved(nodes[active], nodes[nodeIndex], newActiveNode);
  //     });
  // for (let i = 0; i < links.length; i++) {
  //   if (
  //     links[i].to === nodes[active].id ||
  //     links[i].from === nodes[active].id
  //   ) {
  //     for (let y = 0; y < selectedNodes.length; y++) {
  //       if (nodes[selectedNodes[y]].id === links[i].from) {
  //         newNodes[y].target = false;
  //         newActiveNode.source[y] = false;
  //       } else if (nodes[selectedNodes[y]].id === links[i].to) {
  //         newNodes[y].target = true;
  //         newActiveNode.source[y] = true;
  //       }
  //     }
  //   }
  // }
  //   } else {
  //     newNodes = selectedNodes.map(function (nodeIndex, i) {
  //       return {
  //         id: nodes[nodeIndex].id,
  //         observed_genotype_color: paginateArray(
  //           nodes[nodeIndex].observed_genotype
  //         ),
  //         color: colors[i],
  //       };
  //     });
  //   }
  //   setActiveNode(newActiveNode);
  //   setCompareNodes(newNodes);
  // }, [active, selectedNodes]);

  return (
    <div className="panel-container">
      <h2 className="header">Primary</h2>
      <div className="panel-primary-container">
        {activeNode ? (
          <NodeBox
            page={page}
            setPage={setPage}
            color={"red"}
            nodeInfo={activeNode}
            colors={colors}
          ></NodeBox>
        ) : null}
      </div>
      <h2 className="header">Secondaries</h2>
      <div className="panel-compare-container">
        {compareNodes?.map((obj, i) => {
          return (
            <NodeBox
              page={page}
              setPage={setPage}
              color={colors[i]}
              nodeInfo={obj}
            ></NodeBox>
          );
        })}
      </div>
    </div>
  );
};

export default Panel;
