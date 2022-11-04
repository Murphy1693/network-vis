import React, { useState, useEffect, useRef, useReducer } from "react";
import Graph from "./Graph.js";
import Panel from "./Panel.js";
import { createColorAndCount } from "../compareFunctions.js";
import FileSelector from "./FileSelector/FileSelector.js";
import GraphPanel from "./GraphPanel/GraphPanel.js";

import * as d3 from "d3";
// import Graph2 from "./Graph/Graph2.js";
// sample_id,Ara2,AS1,AS11,AS12,AS14,AS15,AS19,AS2,AS21,AS25,AS3,AS31,AS32,AS34,AS7,AS8,B7M19,PFG377,PfPK2,PolyA,TA1,TA109,TA40,TA60,TA81,TA87,Date
/*
[15, 127, 133, 41, 124, 137, 142, 192, 199]
*/

let vis;

let defaultGraph = {
  nodeSize: 5,
  nodeOpacity: 1,
  nodeColor: "#000000",
  linkDistance: 50,
  arrowSize: 4,
  primaryLinkOpacity: 1,
  secondaryLinkOpacity: 1,
  primaryLinkColor: "#000000",
  secondaryLinkColor: "#000000",
  toggleAdditionalLinks: false,
};
