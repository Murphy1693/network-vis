import React from "react";
import GraphButton from "./GraphButton.js";

const GraphPanelRow = ({ text, buttons = [] }) => {
  console.log(buttons);
  return (
    <div>
      <span>{text}</span>
      <div>
        {buttons.map(({ className, callback, buttonStyle }) => {
          console.log(className, callback);
          return (
            <GraphButton
              buttonStyle={buttonStyle}
              callback={callback}
              className={className}
            ></GraphButton>
          );
        })}
      </div>
    </div>
  );
};

export default GraphPanelRow;
