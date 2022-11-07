import React from "react";

const GraphButton = ({ className, callback, buttonStyle }) => {
  if (buttonStyle) {
    return (
      <div style={buttonStyle} className={className} onClick={callback}></div>
    );
  } else {
    return <button className={className} onClick={callback}></button>;
  }
};

export default GraphButton;
