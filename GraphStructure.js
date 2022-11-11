class GraphStruture {
  constructor() {
    this._nodes = {};
  }

  addNode(node) {
    this._nodes[node.id] = this._nodes[node.id] || { ...node, edges: {} };
  }

  addEdge(from, to) {
    this._nodes[from].edges[to] = true;
    this._nodes[to].edges[from] = true;
  }
}
