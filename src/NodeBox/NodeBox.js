import React, { useState } from "react";
import Row from "./Row.js";

const NodeBox = ({ nodeInfo, color }) => {
  const [page, setPage] = useState(0);
  console.log(nodeInfo);
  let style = {
    width: "fit-content",
    height: "fit-content",
    position: "relative",
    display: "flex",
    margin: "auto",
    flexDirection: "column",
    border: `4px solid ${color}`,
  };

  return (
    <div style={style} className="node-box">
      <button
        onClick={() => {
          if (page !== 0) {
            setPage(page - 1);
          }
        }}
      >
        Prev Page
      </button>
      <button
        onClick={() => {
          if (page !== nodeInfo?.observed_genotype.length - 1) {
            setPage(page + 1);
          }
        }}
      >
        Next Page
      </button>
      {nodeInfo?.observed_genotype[page].map((obs_geno, i) => {
        return <Row color={color} key={i} row={obs_geno.genotype}></Row>;
      })}
    </div>
  );
};

export default NodeBox;
