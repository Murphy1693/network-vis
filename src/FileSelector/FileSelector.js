import React from "react";

const FileSelector = (props) => {
  return (
    <div className="file-selector-container">
      <div className="file-buttons-container">
        <button>Select File</button>
        <button>Clear Files</button>
        <input type="file" hidden></input>
        <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
      </div>
      <div className="selected-files-container"></div>
      <div className="create-sim-button"></div>
    </div>
  );
};

export default FileSelector;
