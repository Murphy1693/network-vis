import React from "react";
import { paginateArray } from "../../compareFunctions.js";

const NodeMatches = ({ matches = [], total, colors, pageSize = 3 }) => {
  console.log("paginated matches", paginateArray(matches, pageSize));
  let data = paginateArray(matches, 3);
  return (
    <div style={{ display: "flex" }}>
      {data.map((page, i) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingRight: 5,
            }}
          >
            {page.map((match, j) => {
              return (
                <span style={{ color: colors[i * pageSize + j] }}>
                  {match + "/" + total}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default NodeMatches;
