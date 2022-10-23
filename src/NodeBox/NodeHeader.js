import React from "react";

const NodeHeader = ({ nodeInfo, page, setPage }) => {
  console.log(page);
  return (
    <div
      className="node-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px",
      }}
    >
      <button
        // style={page === 0 ? { visiblity: "hidden" } : { visbility: "visible" }}
        style={page === 0 ? { visibility: "hidden" } : {}}
        onClick={() => {
          if (page !== 0) {
            setPage(page - 1);
          }
        }}
      >
        {"-"}
      </button>
      <span style={{ fontSize: "12px" }}>{nodeInfo.id}</span>
      <button
        style={
          page === nodeInfo.observed_genotype_display.length - 1
            ? { visibility: "hidden" }
            : {}
        }
        onClick={() => {
          if (page !== nodeInfo.observed_genotype_display.length - 1) {
            setPage(page + 1);
          }
        }}
      >
        {"+"}
      </button>
    </div>
  );
};

export default NodeHeader;
