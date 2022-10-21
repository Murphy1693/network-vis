import React from "react";

const AlleleBox = ({ boxSize = "7", borderColor = "black", color, value }) => {
  let style = {
    boxSizing: "border-box",
    width: `${boxSize}px`,
    aspectRatio: "1/1",
    border: `1px solid ${
      value === "1" ? color : value === "2" ? "red" : "black"
    }`,
    backgroundColor:
      value === "0"
        ? "white"
        : value === "1"
        ? color
        : value === "2"
        ? "red"
        : "white",
    marginLeft: "2px",
  };

  return <div style={style} className="allele-box"></div>;
};

export default AlleleBox;
