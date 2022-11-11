import React from "react";

const NodeInfo = ({ nodeInfo, color, colors, latent }) => {
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
            {latent ? nodeInfo.latent_shared_count : nodeInfo.shared_count}
          </span>
        </div>
      ) : null}
      <label>{"Total Alleles"}</label>
      <span style={{ color: color, fontSize: "24px", marginBottom: "auto" }}>
        {latent ? nodeInfo.latent_total : nodeInfo.total}
      </span>
      {nodeInfo.matches && !latent
        ? nodeInfo.matches.map((shared, colorIndex) => {
            console.log(colors[colorIndex]);
            return (
              <span key={colorIndex} style={{ color: colors[colorIndex] }}>
                {shared + "/" + nodeInfo.total}
              </span>
            );
          })
        : null}
      {nodeInfo.latent_matches && latent
        ? nodeInfo.latent_matches.map((shared, colorIndex) => {
            console.log(colors[colorIndex]);
            return (
              <span key={colorIndex} style={{ color: colors[colorIndex] }}>
                {shared + "/" + nodeInfo.latent_total}
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
