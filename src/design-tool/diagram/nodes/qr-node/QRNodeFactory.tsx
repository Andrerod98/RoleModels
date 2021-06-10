/* eslint-disable no-undef */
import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { QRNodeWidget } from "./QRNodeWidget";
import { QRNodeModel } from "./QRNodeModel";

export class QRNodeFactory extends AbstractReactFactory<
  QRNodeModel,
  DiagramEngine
> {
  constructor(readonly type: string, readonly name: string) {
    super(type);
  }

  generateReactWidget(event: { model: any }): JSX.Element {
    return <QRNodeWidget engine={this.engine} node={event.model} />;
  }

  generateModel(event: any) {
    return new QRNodeModel(this.type, this.name);
  }
}
