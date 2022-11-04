import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";

const GraphPanel = ({
  handleAddActiveId,
  handleAddSelectedId,
  arrowSize,
  setArrowSize,
  nodeColor,
  setNodeColor,
  simulationRef,
  graphDispatch,
  graphSettings,
}) => {
  const [selecting, setSelecting] = useState({
    selecting: false,
    aspect: "nodeColor",
  });
  const [primaryInput, setPrimaryInput] = useState("");
  const [secondaryInput, setSecondaryInput] = useState("");

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
            color={graphSettings.nodeColor}
            onChange={(color) => {
              // simulationRef.current.stop();
              if (selecting.aspect === "nodeColor") {
                graphDispatch({ prop: "nodeColor", newValue: color.hex });
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
        <div>
          <span>Node Size</span>
          <div>
            <button
              className="minus-button minus-button--small"
              onClick={() => {
                if (graphSettings.nodeSize > 0) {
                  graphDispatch({
                    prop: "nodeSize",
                    newValue: graphSettings.nodeSize - 1,
                  });
                }
              }}
            ></button>
            <button
              className="plus-button plus-button--small"
              onClick={() => {
                graphDispatch({
                  prop: "nodeSize",
                  newValue: graphSettings.nodeSize + 1,
                });
              }}
            ></button>
          </div>
        </div>
        <div>
          <span>Node Color</span>
          <div
            style={{
              backgroundColor: `${graphSettings.nodeColor}`,
              width: "20px",
              height: "20px",
              alignSelf: "end",
              borderRadius: "50%",
            }}
            onClick={() => {
              setSelecting({ selecting: true, aspect: "nodeColor" });
            }}
          ></div>
        </div>
        <div>
          <span>Node Opacity</span>
          <div>
            <button
              className="minus-button minus-button--small"
              onClick={() => {
                if (graphSettings.nodeOpacity > 0) {
                  graphDispatch({
                    prop: "nodeOpacity",
                    newValue: (graphSettings.nodeOpacity * 10 - 1) / 10,
                  });
                }
              }}
            ></button>
            <button
              className="plus-button plus-button--small"
              onClick={() => {
                if (graphSettings.nodeOpacity < 1) {
                  graphDispatch({
                    prop: "nodeOpacity",
                    newValue: (graphSettings.nodeOpacity * 10 + 1) / 10,
                  });
                }
              }}
            ></button>
          </div>
        </div>
        <div>
          <span>Arrow Size</span>
          <div>
            <button
              className="minus-button minus-button--small"
              onClick={() => {
                if (graphSettings.arrowSize > 0) {
                  graphDispatch({
                    prop: "arrowSize",
                    newValue: graphSettings.arrowSize - 1,
                  });
                }
              }}
            ></button>
            <button
              className="plus-button plus-button--small"
              onClick={() => {
                graphDispatch({
                  prop: "arrowSize",
                  newValue: graphSettings.arrowSize + 1,
                });
              }}
            ></button>
          </div>
        </div>
        <div>
          <span>Link Length</span>
          <div>
            <button
              className="minus-button minus-button--small"
              onClick={() => {
                if (graphSettings.linkDistance > 10) {
                  graphDispatch({
                    prop: "linkDistance",
                    newValue: graphSettings.linkDistance - 10,
                  });
                }
              }}
            >
              -
            </button>
            <button
              className="plus-button plus-button--small"
              onClick={() => {
                graphDispatch({
                  prop: "linkDistance",
                  newValue: graphSettings.linkDistance + 10,
                });
              }}
            >
              +
            </button>
          </div>
        </div>
        <div>
          <span>Link Opacity</span>
          <div>
            <button
              className="minus-button minus-button--small"
              onClick={() => {
                if (graphSettings.primaryLinkOpacity > 0) {
                  graphDispatch({
                    prop: "primaryLinkOpacity",
                    newValue: (graphSettings.primaryLinkOpacity * 10 - 1) / 10,
                  });
                }
              }}
            ></button>
            <button
              className="plus-button plus-button--small"
              onClick={() => {
                if (graphSettings.primaryLinkOpacity < 1) {
                  graphDispatch({
                    prop: "primaryLinkOpacity",
                    newValue: (graphSettings.primaryLinkOpacity * 10 + 1) / 10,
                  });
                }
              }}
            ></button>
          </div>
        </div>
        <div>
          <span>Show Seconadary Links</span>
          <button
            onClick={() => {
              graphDispatch({
                prop: "toggleAdditionalLinks",
                newValue: !graphSettings.toggleAdditionalLinks,
              });
            }}
          ></button>
        </div>
        <div>
          <span>Primary by ID</span>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddActiveId(primaryInput);
                setPrimaryInput("");
              }
            }}
            value={primaryInput}
            onChange={(e) => {
              setPrimaryInput(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <span>Secondary by ID</span>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddSelectedId(secondaryInput);
                setSecondaryInput("");
              }
            }}
            value={secondaryInput}
            onChange={(e) => {
              setSecondaryInput(e.target.value);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
};

export default GraphPanel;
