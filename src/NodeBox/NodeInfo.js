import React from "react";

const NodeInfo = ({ nodeInfo, color, colors }) => {
  console.log(colors);
  return (
    <div
      className="info-container"
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: "12px",
        paddingRight: "10px",
      }}
    >
      {nodeInfo.shared_count !== undefined ? (
        <div
          className="shared-count"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label>Shared Alleles</label>
          <span style={{ color: "red", paddingLeft: "10px", fontSize: "24px" }}>
            {nodeInfo.shared_count}
          </span>
        </div>
      ) : null}
      <label>{"Total Alleles"}</label>
      <span style={{ color: color, fontSize: "24px", marginBottom: "auto" }}>
        {nodeInfo.total}
      </span>
      {nodeInfo.matches
        ? nodeInfo.matches.map((shared, colorIndex) => {
            console.log(colors[colorIndex]);
            return (
              <span key={colorIndex} style={{ color: colors[colorIndex] }}>
                {shared + "/" + nodeInfo.total}
              </span>
            );
          })
        : null}
      <label>{"Infection Time"}</label>
      <span>{Math.round(nodeInfo.infection_time)}</span>
      <label>{"Infection Duration"}</label>
      <span>{Math.round(nodeInfo.infection_duration)}</span>
      <label>{"Observation Time"}</label>
      <span>{Math.round(nodeInfo.observation_time)}</span>
    </div>
  );
};

export default NodeInfo;
