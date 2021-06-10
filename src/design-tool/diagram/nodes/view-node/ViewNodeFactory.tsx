/* eslint-disable no-undef */
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { ViewNodeWidget } from "./ViewNodeWidget";
import { ViewNodeModel } from "./ViewNodeModel";
import * as React from "react";
import { View } from "../../../../prototyping-tool/shared-object/views/View";

export class ViewNodeFactory extends AbstractReactFactory<
  ViewNodeModel,
  DiagramEngine
> {
  constructor(
    readonly type: string,
    readonly name: string,
    readonly view: View
  ) {
    super(type);
  }

  generateReactWidget(event: { model: any }): JSX.Element {
    return (
      <ViewNodeWidget
        engine={this.engine}
        node={event.model}
        isPreview={false}
      />
    );
  }

  generateModel(event: any) {
    return new ViewNodeModel(this.type, this.name, this.view);
  }
}
