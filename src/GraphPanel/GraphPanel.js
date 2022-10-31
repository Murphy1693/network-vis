import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";

const GraphPanel = ({
  arrowSize,
  setArrowSize,
  nodeColor,
  setNodeColor,
  simulationRef,
}) => {
  const [selecting, setSelecting] = useState({
    selecting: false,
    aspect: "nodeColor",
  });

  if (selecting.selecting) {
    return (
      <div className="graph-panel-container">
        <div>
          <button
            onClick={() => {
              setSelecting({ selecting: false, aspect: null });
            }}
          >
            CLOSE
          </button>
          {selecting.aspect}
          <SketchPicker
            color={nodeColor}
            onChange={(color) => {
              simulationRef.current.stop();
              if (selecting.aspect === "nodeColor") {
                setNodeColor(color.hex);
              } else if (selecting.aspect === "primaryLinkColor") {
              } else if (selecting.aspect === "secondaryLinkColor") {
              }
            }}
          ></SketchPicker>
        </div>
      </div>
    );
  }

  return (
    <div className="graph-panel-container">
      <div className="graph-panel">
        <div>Node Size</div>
        <div>
          <div style={{ display: "flex" }}>
            Node Color
            <div
              style={{
                backgroundColor: `${nodeColor}`,
                marginLeft: "auto",
                width: "20px",
                borderRadius: "50%",
              }}
              onClick={() => {
                setSelecting({ selecting: true, aspect: "nodeColor" });
              }}
            ></div>
          </div>
        </div>
        <div>Node Opacity</div>
        <div>
          Arrow Size
          <button
            onClick={() => {
              if (arrowSize > 0) {
                simulationRef.current.stop();
                setArrowSize(arrowSize - 1);
              }
            }}
          >
            -
          </button>
          <button
            onClick={() => {
              simulationRef.current.stop();
              setArrowSize(arrowSize + 1);
            }}
          >
            +
          </button>
        </div>
        <div>Link Length</div>
        <div>Link Opacity</div>
        <div></div>
        <div></div>
        <div></div>
        <div>Primary by ID</div>
        <div>Secondary by ID</div>
      </div>
    </div>
  );
};

export default GraphPanel;
