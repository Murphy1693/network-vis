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
    this.fontEnabled = true;
    this.fontSettings = "10px Arial";
    this.additionalLinks = props.additionalLinks;
    this.additionalToggle = props.toggleLinks;
    this.link_distance = props.link_distance;
    this.arrowFill = props.arrowSize;
    this.nodeColor = props.nodeColor;
    (this.primaryLinkOpacity = props.primaryLinkOpacity),
      (this.nodeOpacity = props.nodeOpacity),
      (this.cursor_x = -1);
    this.cursor_y = -1;
    this.nodeSize = this.props.nodeSize;
    this.colors = props.colors;
    this.updateData();
    d3.select(this.container)
      .on("mousedown", this.handleMousedown)
      .on("mousemove", this.handleMousemove)
      .on("mouseup", this.handleMouseup)
      .on("contextmenu", this.handleRightClick);
  }

  handleRightClick = (e) => {
    console.log(e);

    e.preventDefault();
    let x = this.simulation.find(
      e.pageX - 200,
      e.pageY - 300,
      this.nodeSize * 1.5
    );
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
    e.subject = this.simulation.find(
      e.pageX - 200,
      e.pageY - 300,
      this.nodeSize * 1.5
    );
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
            e.subject.fy = this.cursor_y - 300;
          }
        } else {
          clearInterval(x);
        }
      }, 10);
    }
  };

  handleMousemove = (e) => {
    if (this.mousedown) {
      this.cursor_x = e.pageX - 200;
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
    this.context.globalAlpha = this.props.primaryLinkOpacity;
    this.links.forEach((link) => {
      // this.drawLink(link);
      // this.context.beginPath();
      // this.drawLink(link);
      // this.context.strokeStyle = "black";
      // this.context.lineWidth = Math.round(this.nodeSize / 4);
      // this.context.stroke();
      this.drawArrow(link, "black", this.primaryLinkOpacity, this.arrowFill);
    });
    if (this.additionalToggle) {
      this.additionalLinks.forEach((link) => {
        this.drawArrow(link, "orange", 1, this.arrowFill);
      });
    }
    this.context.restore();
    this.context.save();
    this.context.strokeStyle = "blue";
    this.context.globalAlpha = this.nodeOpacity;
    this.nodes.forEach((node) => {
      this.context.beginPath();
      if (this.fontEnabled) {
        this.context.fillStyle = "black";
        this.context.font = this.fontSettings;
        this.context.fillText(node.id, node.x, node.y + 15);
      }
      this.drawNode(node);
      this.context.fillStyle =
        node.index === this.active
          ? "red"
          : this.selected.includes(node.index)
          ? this.colors[this.selected.indexOf(node.index)]
          : this.nodeColor;
      this.context.strokeStyle = "red";
      this.context.strokeWidth = this.nodeSize;
      this.context.fill();
    });
    this.context.restore();
  };

  // drawLink = (d) => {
  //   this.context.moveTo(d.source.x, d.source.y);
  //   this.context.lineTo(d.target.x, d.target.y);
  // };

  drawNode = (d) => {
    this.context.moveTo(d.x, d.y);
    this.context.arc(d.x, d.y, this.nodeSize, 0, 2 * Math.PI);
  };

  drawArrow(d, color, opacity = 1, arrowFill) {
    var lineX1 = (d, target) => {
      var length = Math.sqrt(
        Math.pow(d.target.y - d.source.y, 2) +
          Math.pow(d.target.x - d.source.x, 2)
      );
      var scale = (length - this.nodeSize) / length;
      var offset = d.source.x - d.target.x - (d.source.x - d.target.x) * scale;
      return d.source.x - offset;
    };
    var lineY1 = (d, target) => {
      var length = Math.sqrt(
        Math.pow(d.target.y - d.source.y, 2) +
          Math.pow(d.target.x - d.source.x, 2)
      );
      var scale = (length - this.nodeSize) / length;
      var offset = d.source.y - d.target.y - (d.source.y - d.target.y) * scale;
      return d.source.y - offset;
    };

    var lineX2 = (d, target) => {
      var length = Math.sqrt(
        Math.pow(d.target.y - d.source.y, 2) +
          Math.pow(d.target.x - d.source.x, 2)
      );
      var scale = (length - this.nodeSize - arrowFill) / length;
      var offset = d.target.x - d.source.x - (d.target.x - d.source.x) * scale;
      return d.target.x - offset;
    };
    var lineY2 = (d, target) => {
      var length = Math.sqrt(
        Math.pow(d.target.y - d.source.y, 2) +
          Math.pow(d.target.x - d.source.x, 2)
      );
      var scale = (length - this.nodeSize - arrowFill) / length;
      var offset = d.target.y - d.source.y - (d.target.y - d.source.y) * scale;
      return d.target.y - offset;
    };

    this.context.save();
    let endX = lineX2(d, true);
    // start of arrow tip
    let startX = lineX1(d);
    //
    let endY = lineY2(d);
    //
    let startY = lineY1(d);
    const headlen = 2;
    const angle = Math.atan2(endY - startY, endX - startX);

    // starting path of the arrow from the start square to the end square and drawing the stroke
    this.context.beginPath();
    this.context.moveTo(Math.floor(endX), Math.floor(endY));
    this.context.lineTo(Math.floor(startX), Math.floor(startY));
    this.context.strokeStyle = color;
    this.context.globalAlpha = opacity;
    this.context.lineWidth = 1;
    this.context.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    const arrowLen1 = headlen * Math.cos(angle - Math.PI / 7);
    const arrowLen2 = headlen * Math.sin(angle - Math.PI / 7);

    this.context.beginPath();
    this.context.moveTo(endX, endY);
    this.context.lineTo(endX - arrowLen1, endY - arrowLen2);

    // path from the side point of the arrow, to the other side point
    this.context.lineTo(
      endX - headlen * Math.cos(angle + Math.PI / 7),
      endY - headlen * Math.sin(angle + Math.PI / 7)
    );

    // // path from the side point back to the tip of the arrow, and then again to the opposite side point
    this.context.globalAlpha = opacity;
    this.context.lineTo(endX, endY);
    this.context.lineTo(endX - arrowLen1, endY - arrowLen2);

    // draws the paths created above
    // this.context.strokeStyle = color;
    this.context.lineWidth = arrowFill;
    this.context.stroke();
    this.context.fillStyle = color;
    this.context.fill();
    this.context.restore();
    // this.context.save();
    // // const diffX = d.target.x - d.source.x;
    // // const diffY = d.target.y - d.source.y;
    // // const pathLength = Math.sqrt(diffX * diffX + diffY * diffY);
    // // let offsetX = (diffX * d.target.radius) / pathLength;
    // // let offsetY = (diffY * d.target.radius) / pathLength;

    // //
    // // const distance = Math.sqrt((fromX - toX) ** 2 + (fromY - toY) ** 2);
    // // console.log(distance);

    // // starting path of the arrow from the start square to the end square and drawing the stroke

    // // (256, 368),  (290, 297)
    // const headlen = 10;
    // const angle = Math.atan2(startX - endX, startY - endY);
    // // (0, 0) (20, 20)

    // this.context.beginPath();
    // // this.context.moveTo(Math.floor(fromX), Math.floor(fromY));
    // this.context.moveTo(startX, startY);
    // // this.context.lineTo(Math.floor(toX), Math.floor(toY));
    // this.context.lineTo(endX, endY);
    // this.context.strokeStyle = color;
    // this.context.globalAlpha = opacity;
    // this.context.lineWidth = 1;
    // this.context.stroke();

    // //starting a new path from the head of the arrow to one of the sides of the point
    // const arrowLen1 = headlen * Math.cos(angle - Math.PI / 7);
    // const arrowLen2 = headlen * Math.sin(angle - Math.PI / 7);

    // this.context.beginPath();
    // this.context.moveTo(endX, endY);
    // this.context.lineTo(endX + arrowLen1, endY + arrowLen2);
    // // this.context.moveTo(endX, endY);
    // // this.context.lineTo(
    // //   endX + headlen * Math.cos(angle + Math.PI / 7),
    // //   endY + headlen * Math.sin(angle + Math.PI / 7)
    // // );

    // // this.context.lineTo(endX + arrowLen1, endY + arrowLen1);

    // // if (d.target.id === "137") {
    // //   console.log(startX, startY);
    // //   // 672, 327
    // //   console.log(toX - arrowLen1, toY - arrowLen2);
    // // }
    // // this.context.lineTo(toX - arrowLen1, toY - arrowLen2);

    // // path from the side point of the arrow, to the other side point
    // // this.context.lineTo(
    // //   toX - headlen * Math.cos(angle + Math.PI / 7),
    // //   toY - headlen * Math.sin(angle + Math.PI / 7)
    // // );

    // // path from the side point back to the tip of the arrow, and then again to the opposite side point

    // // this.context.lineTo(toX, toY);
    // // this.context.lineTo(toX + arrowLen1, toY + arrowLen2);

    // // draws the paths created above
    // // this.context.strokeStyle = color;
    // this.context.lineWidth = 1;
    // this.context.stroke();
    // this.context.fillStyle = color;
    // this.context.fill();
    // this.context.restore();
  }

  updateData = () => {
    console.log(this.props.simulationRef);
    // const forceX = d3.forceX(this.width / 2).strength(0.1);
    const forceX = d3.forceX(this.width / 3).strength((d) => {
      console.log(parseInt(d.id));
      if (parseInt(d.id) > 100) {
        return 0.1;
      }
    });
    const forceX2 = d3.forceX(this.width / 2).strength((d) => {
      // return 0.1;
      if (parseInt(d.id) <= 100) {
        return 0.1;
      }
    });
    const forceY = d3.forceY(this.height / 2);
    // const forceY2 = d3.forceY(this.height / 2).strength(() => {
    //   return 0.1;
    // });
    const forceCollide = d3.forceCollide(15);
    const forceRadial = d3
      .forceRadial(300, this.width / 2, this.height / 2)
      .strength(0.7);
    const forceNode = d3
      .forceManyBody()
      .strength(() => {
        return -15 * Math.max(1, this.nodeSize / 5);
      })
      .theta(0.99);
    const forceLink = d3
      .forceLink(this.links)
      // .id(function (d) {
      //   return d.index;
      // })
      .strength((d) => {
        return 1;
      })
      .distance((d) => {
        // if (parseInt(d.source.id) % 2 === 0) {
        //   return 5;
        // } else {
        //   return 50;
        // }
        // return this.link_distance;
        return this.link_distance;
      });
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force("collide", forceCollide)
      .force(
        "x",
        d3
          .forceX()
          .x((d) => {
            if (d.hasLink) {
              return this.width / 4;
            } else {
              return (this.width * 3) / 4;
            }
          })
          .strength(() => {
            return 0.05;
          })
      )
      // .force("x", forceX2)
      .force("y", forceY.strength(0.05))
      .force("link", forceLink)
      .force("charge", forceNode)
      // .force("center", d3.forceCenter(this.width / 4, this.height / 2))
      .on("tick", this.ticked);
    this.props.simulationRef.current = this.simulation;
  };
}

export default Graph;
