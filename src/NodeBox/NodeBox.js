import React, { useState } from "react";
import Row from "./Row.js";
import NodeHeader from "./NodeHeader.js";
import NodeInfo from "./NodeInfo.js";

const NodeBox = ({ nodeInfo, color, colors, page, setPage, latent }) => {
  // const [page, setPage] = useState(0);
  console.log("NODEINFO", nodeInfo);
  const makeRGBA = function (color, opacity = 0.2) {
    if (color === "red") {
      return `rgba(255, 0, 0, ${opacity})`;
    } else if (color === "blue") {
      return `rgba(0, 0, 255, ${opacity})`;
    } else if (color === "green") {
      return `rgba(0, 255, 0, ${opacity})`;
    } else if (color === "purple") {
      return `rgba(128, 0, 128, ${opacity})`;
    } else if (color === "orange") {
      return `rgba(255, 165, 0, ${opacity})`;
    }
  };
  let style = {
    position: "relative",
    pointerEvents: "all",
    boxSizing: "border-box",
    width: "fit-content",
    boxShadow: `black 0px 5px 15px`,
    backgroundColor: "white",
    margin: "auto",
    border: `2px solid ${color || "black"}`,
    scale: ".75",
  };

  return (
    <div style={style} className="node-box">
      <div
        style={{ backgroundColor: makeRGBA(color, 0.15) }}
        className="node-alpha-background"
      >
        {/* <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            position: "absolute",
          }}
          type="button"
          class="close"
          aria-label="Close"
        >
          <span
            style={{
              fontSize: "40px",
            }}
            aria-hidden="true"
          >
            &times;
          </span>
        </button> */}
        <NodeHeader
          latent={latent}
          color={color}
          page={page}
          setPage={setPage}
          nodeInfo={nodeInfo}
        ></NodeHeader>
        <div className="rows-container" style={{ display: "flex" }}>
          <div
            style={{ display: "inline-block", width: "fit-content" }}
            className="row-container"
          >
            {latent
              ? nodeInfo?.latent_genotype_display[page]?.map((obs_geno, i) => {
                  return (
                    <Row color={color} key={i} row={obs_geno.genotype}></Row>
                  );
                })
              : nodeInfo?.observed_genotype_display[page]?.map(
                  (obs_geno, i) => {
                    return (
                      <Row color={color} key={i} row={obs_geno.genotype}></Row>
                    );
                  }
                )}
          </div>
          <NodeInfo
            latent={latent}
            colors={colors}
            color={color}
            nodeInfo={nodeInfo}
          ></NodeInfo>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div style={style} className="node-box">
  //     <pre style={{ position: "absolute", top: "-30px", left: 0 }}>{page}</pre>
  //     <button
  //       onClick={() => {
  //         if (page !== 0) {
  //           setPage(page - 1);
  //         }
  //       }}
  //     >
  //       Prev Page
  //     </button>
  //     <button
  //       onClick={() => {
  //         if (page !== nodeInfo?.observed_genotype_display.length - 1) {
  //           setPage(page + 1);
  //         }
  //       }}
  //     >
  //       Next Page
  //     </button>
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //         paddingLeft: "5px",
  //         paddingRight: "5px",
  //       }}
  //       className="info-container"
  //     >
  //       <div
  //         style={{
  //           fontWeight: "bold",
  //           fontSize: "12px",
  //           display: "flex",
  //           gap: "5px",
  //         }}
  //       >
  //         <span>{nodeInfo?.id}</span>
  //         <span>{"Observed"}</span>
  //       </div>
  //       {color === "red" ? (
  //         <span
  //           style={{
  //             color: color,
  //             fontWeight: "bold",
  //             textAlign: "center",
  //           }}
  //         >
  //           {nodeInfo?.total}
  //         </span>
  //       ) : nodeInfo.shared_count !== undefined &&
  //         nodeInfo.total !== undefined ? (
  //         <span
  //           style={{
  //             color: color,
  //             fontWeight: "bold",
  //             textAlign: "center",
  //           }}
  //         >
  //           {nodeInfo?.shared_count + "/" + nodeInfo?.total}
  //         </span>
  //       ) : null}
  //     </div>
  // <div style={{ display: "flex" }}>
  //   <div
  //     style={{ display: "inline-block", width: "fit-content" }}
  //     className="row-container"
  //   >
  //     {nodeInfo?.observed_genotype_display[page].map((obs_geno, i) => {
  //       return <Row color={color} key={i} row={obs_geno.genotype}></Row>;
  //     })}
  //   </div>
  //       <div
  //         className="shared-container"
  //         style={
  //           color === "red"
  //             ? { display: "flex", flexDirection: "column", padding: "10px" }
  //             : null
  //         }
  //       >
  //         {color === "red"
  //           ? nodeInfo?.matches?.map((shared, i) => {
  //               return (
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     color: colors[i],
  //                     marginTop: "5px",
  //                     fontWeight: "bold",
  //                   }}
  //                 >
  //                   <span key={i}>{shared + "/" + nodeInfo?.total}</span>
  //                   {nodeInfo?.source[i] !== undefined ? (
  //                     <span style={{ marginLeft: "5px", color: "red" }}>
  //                       {nodeInfo.source[i] ? "S" : "T"}
  //                     </span>
  //                   ) : null}
  //                 </div>
  //               );
  //             })
  //           : null}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default NodeBox;
