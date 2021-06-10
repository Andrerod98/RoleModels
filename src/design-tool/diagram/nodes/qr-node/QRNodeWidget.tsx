/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-namespace */
import * as React from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { QRNodeModel } from "./QRNodeModel";

import "../../../styles/example.css";
import QRCode from "qrcode.react";
import { Resizable } from "react-resizable";
import { Box } from "@chakra-ui/react";

export interface QRNodeWidgetProps {
  node: QRNodeModel;
  engine: DiagramEngine;
}

export const QRNodeWidget = (props: QRNodeWidgetProps) => {
  const onResize = (event: any, { size }: any) => {
    props.node.setLocked(true);
    const maxSize = Math.max(size.width, size.height);
    props.node.updateDimensions({
      width: maxSize,
      height: maxSize,
    });
    setSize(size);
  };

  const onResizeStop = (event: any) => {
    props.node.setLocked(false);
  };

  const handle = (h: string, ref: any) => {
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

  const [, setSize] = React.useState({ width: 0, height: 0 });
  return props.node.isSelected() ? (
    <Resizable
      height={props.node.height}
      width={props.node.width}
      handle={(h: any, ref: any) => handle(h, ref)}
      handleSize={[8, 8]}
      maxConstraints={[Infinity, Infinity]}
      minConstraints={[20, 20]}
      onResize={onResize}
      axis={"both"}
      onResizeStop={onResizeStop}
      resizeHandles={["sw", "se", "nw", "ne", "w", "e", "n", "s"]}
    >
      <Box
        className={"box"}
        bg={"white"}
        p={5}
        height={props.node.height + "px"}
        width={props.node.width + "px"}
      >
        <QRCode
          size={Math.min(props.node.width, props.node.height)}
          value={"http://facebook.github.io/react/"}
        />
      </Box>
    </Resizable>
  ) : (
    <Box
      className={"box"}
      bg={"black"}
      p={5}
      height={props.node.height + "px"}
      width={props.node.width + "px"}
    >
      <QRCode
        size={Math.min(props.node.width, props.node.height)}
        value={"http://facebook.github.io/react/"}
      />
    </Box>
  );
};
