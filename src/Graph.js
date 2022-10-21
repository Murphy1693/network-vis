import * as d3 from "d3";

class Graph {
  constructor(container, props) {
    this.container = container;
    this.context = container.getContext("2d");
    this.props = props;
    this.width = props.width;
    this.height = props.height;
    this.nodes = props.data.nodes;
    this.selected = props.selected;
    this.links = props.data.links;
    this.active = props.active;
    this.cursor_x = -1;
    this.cursor_y = -1;
    this.updateData();
    this.colors = props.colors;
    d3.select(this.container)
      .on("mousedown", this.handleMousedown)
      .on("mousemove", this.handleMousemove)
      .on("mouseup", this.handleMouseup)
      .on("contextmenu", this.handleRightClick);
  }

  handleRightClick = (e) => {
    e.preventDefault();
    let x = this.simulation.find(e.pageX, e.pageY - 100, 10);
    console.log(x);
    if (x) {
      this.links.forEach(function (link) {
        if (link.source === x || link.target === x) {
          link.source.fx = null;
          link.source.fy = null;
          link.target.fx = null;
          link.target.fy = null;
        }
      });
      x.fx = null;
      x.fy = null;
    }
  };

  handleMousedown = (e) => {
    this.mousedown = true;
    e.subject = this.simulation.find(e.pageX, e.pageY - 100, 10);
    this.selectedNode = e.subject;
    if (e.subject) {
      console.log(e.subject);
      this.handleClick(e);
    }
  };

  handleClick = function (e) {
    if (e.button === 0) {
      if (e.shiftKey || e.ctrlKey) {
        this.links.forEach(function (link) {
          if (link.from === e.subject || link.to === e.subject) {
            link.from.fx = link.from.x;
            link.from.fy = link.from.y;
            link.to.fx = link.to.x;
            link.to.fy = link.to.y;
          }
        });
        this.props.onDatapointClick(
          e.subject.index,
          e,
          this.nodes,
          this.simulation
        );
        return;
      } else if (e.ctrlKey) {
        return;
      }
      let x = setInterval(() => {
        console.log("mouse is down");
        this.simulation.alphaTarget(0.3).restart();
        if (this.mousedown) {
          if (this.cursor_x !== null && this.cursor_y !== null) {
            e.subject.fx = this.cursor_x;
            e.subject.fy = this.cursor_y - 100;
          }
        } else {
          clearInterval(x);
        }
      }, 10);
    }
  };

  handleMousemove = (e) => {
    if (this.mousedown) {
      this.cursor_x = e.pageX;
      this.cursor_y = e.pageY;
    } else {
      this.cursor_x = null;
      this.cursor_y = null;
    }
  };

  handleMouseup = (e) => {
    this.mousedown = false;
  };

  ticked = () => {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.save();
    this.context.globalAlpha = this.props.linkOpacity || 0.5;
    this.links.forEach((link) => {
      this.drawLink(link);
      this.context.beginPath();
      this.drawLink(link);
      this.context.strokeStyle = "black";
      this.context.lineWidth = 1;
      this.context.stroke();
    });
    this.context.restore();
    this.context.save();
    this.context.strokeStyle = "blue";
    this.context.globalAlpha = this.props.nodeOpacity || 1;
    this.nodes.forEach((node) => {
      this.context.beginPath();

      this.drawNode(node);
      this.context.fillStyle =
        node.index === this.active
          ? "red"
          : this.selected.includes(node.index)
          ? this.colors[this.selected.indexOf(node.index)]
          : "black";
      this.context.strokeStyle = "red";
      this.context.strokeWidth = 5;
      this.context.fill();
    });
    this.context.restore();
  };

  drawLink = (d) => {
    this.context.moveTo(d.source.x, d.source.y);
    this.context.lineTo(d.target.x, d.target.y);
  };

  drawNode = (d) => {
    this.context.moveTo(d.x, d.y);
    this.context.arc(d.x, d.y, 5, 0, 2 * Math.PI);
  };

  updateData = () => {
    const forceX = d3.forceX(this.width / 2).strength(0.1);
    const forceY = d3.forceY(this.height / 2).strength(0.1);
    const forceCollide = d3.forceCollide(15);
    const forceRadial = d3
      .forceRadial(200, this.width / 2, this.height / 2)
      .strength(0.7);
    const forceNode = d3.forceManyBody().strength(-30).theta(0.99);
    const forceLink = d3
      .forceLink(this.links)
      .id(function (d) {
        return d.index;
      })
      .strength((d) => {
        return 0.8;
      });

    this.simulation = d3
      .forceSimulation(this.nodes)
      .force("collide", forceCollide)
      .force("x", forceX)
      .force("y", forceY)
      .force("link", forceLink)
      .force("charge", forceNode)
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .on("tick", this.ticked);
  };
}

export default Graph;
