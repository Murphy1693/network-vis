import React from "react";
import AlleleBox from "./AlleleBox.js";

const Row = ({ row, color }) => {
  let style = {
    margin: "2px",
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "rgb(255 255 255 / 50%)",
  };
  return (
    <div style={style}>
      {row.split("").map((value, i) => {
        return <AlleleBox color={color} key={i} value={value}></AlleleBox>;
      })}
    </div>
  );
};

export default Row;
