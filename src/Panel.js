import React, { useState, useEffect } from "react";
import { compareObserved, paginateArray } from "../compareFunctions.js";
import NodeBox from "./NodeBox/NodeBox.js";

let zip = function (arr1, arr2, callback) {
  for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
    callback(arr1[i], arr2[i]);
  }
};

const Panel = ({ selectedNodes, active, nodes, links, colors }) => {
  let [compareNodes, setCompareNodes] = useState([]);
  let [activeNode, setActiveNode] = useState({});

  useEffect(() => {
    let newNodes;
    let newActiveNode;
    if (active) {
      newActiveNode = {
        ...nodes[active],
        observed_genotype: paginateArray(nodes[active].observed_genotype),
      };

      newNodes = selectedNodes.map(function (nodeIndex, i) {
        return {
          observed_genotype: paginateArray(
            compareObserved(nodes[active], nodes[nodeIndex], newActiveNode)
          ),
          color: colors[i],
        };
      });
      console.log(compareNodes);
    } else {
      newNodes = selectedNodes.map(function (nodeIndex, i) {
        return {
          observed_genotype: paginateArray(nodes[nodeIndex].observed_genotype),
          color: colors[i],
        };
      });
    }
    console.log("newNodes: ", newNodes);
    setActiveNode(newActiveNode);
    setCompareNodes(newNodes);
  }, [active, selectedNodes]);

  return (
    <div className="panel-container">
      <div className="panel-primary-container">
        {active ? (
          <NodeBox color={"red"} nodeInfo={activeNode}></NodeBox>
        ) : null}
      </div>
      <div className="panel-compare-container">
        {compareNodes?.map((obj, i) => {
          return <NodeBox color={colors[i]} nodeInfo={obj}></NodeBox>;
        })}
      </div>
    </div>
  );
};

export default Panel;
