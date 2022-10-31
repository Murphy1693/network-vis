import React from "react";

const NodeHeader = ({ nodeInfo, page, setPage }) => {
  console.log(page);
  return (
    <div
      className="node-header"
      style={{
        minHeight: "27px",
        display: "flex",
        justifyContent: "space-between",
        padding: "5px",
      }}
    >
      <div
        // style={page === 0 ? { visiblity: "hidden" } : { visbility: "visible" }}
        style={page === 0 ? { visibility: "hidden" } : { display: "flex" }}
        onClick={() => {
          if (page !== 0) {
            setPage(page - 1);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-file-minus-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM6 7.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1z" />
        </svg>
      </div>
      <span style={{ fontSize: "12px" }}>{nodeInfo.id}</span>
      <div
        style={
          page === nodeInfo.observed_genotype_display.length - 1
            ? { visibility: "hidden" }
            : { display: "flex" }
        }
        onClick={() => {
          if (page !== nodeInfo.observed_genotype_display.length - 1) {
            setPage(page + 1);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-file-plus-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0z" />
        </svg>
      </div>
    </div>
  );
};

export default NodeHeader;
