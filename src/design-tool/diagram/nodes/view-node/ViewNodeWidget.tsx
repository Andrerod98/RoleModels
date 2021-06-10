/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-namespace */
import * as React from "react";
import { DefaultPortLabel, DiagramEngine } from "@projectstorm/react-diagrams";
import { ViewNodeModel } from "./ViewNodeModel";

import "../../../styles/example.css";
//import "react-edit-text/dist/index.css";
import { ViewComponent } from "./ViewComponent";

export interface DiamondNodeWidgetProps {
  node: ViewNodeModel;
  engine: DiagramEngine;
  isPreview: boolean;
}

export class ViewNodeWidget extends React.Component<DiamondNodeWidgetProps> {
  constructor(
    props: DiamondNodeWidgetProps | Readonly<DiamondNodeWidgetProps>
  ) {
    super(props);
    console.log(this.props.node.width);
  }

  generatePort = (port: any) => {
    return (
      <DefaultPortLabel
        engine={this.props.engine}
        port={port}
        key={port.getID()}
      />
    );
  };

  onResize = (event: any, { element, size, handle }: any) => {
    this.props.node.setLocked(true);
    if (size.width < 20 || size.height < 20) return;
    this.props.node.updateDimensions(size);
    this.forceUpdate();
  };

  onResizeStop = (event: any, { element, size, handle }: any) => {
    this.props.node.setLocked(false);
  };

  handle = (h: string, ref: any) => {
    switch (h) {
      case "n":
        return <div ref={ref} className={"custom-handle custom-handle-n"} />;
      case "sw":
        return <div ref={ref} className={"custom-handle custom-handle-sw"} />;
      case "se":
        return <div ref={ref} className={"custom-handle custom-handle-se"} />;
      case "nw":
        return <div ref={ref} className={"custom-handle custom-handle-nw"} />;
      case "ne":
        return <div ref={ref} className={"custom-handle custom-handle-ne"} />;
      case "w":
        return <div ref={ref} className={"custom-handle custom-handle-w"} />;
      case "e":
        return <div ref={ref} className={"custom-handle custom-handle-e"} />;
      case "s":
        return <div ref={ref} className={"custom-handle custom-handle-s"} />;
      default:
        return <div ref={ref} className={"custom-handle"} />;
    }
  };

  render() {
    return (
      <ViewComponent
        isPreview={this.props.isPreview}
        handle={this.handle}
        engine={this.props.engine}
        onResize={this.onResize}
        onResizeStop={this.onResizeStop}
        generatePort={this.generatePort}
        node={this.props.node}
      />
    );
  }
}
