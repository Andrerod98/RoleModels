/* eslint-disable no-undef */
import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { RoleNodeWidget } from "./RoleNodeWidget";
import { RoleNodeModel } from "./RoleNodeModel";

export class RoleNodeFactory extends AbstractReactFactory<
  RoleNodeModel,
  DiagramEngine
> {
  constructor(readonly type: string, readonly name: string) {
    super(type);
  }

  generateReactWidget(event: { model: any }): JSX.Element {
    return <RoleNodeWidget engine={this.engine} node={event.model} />;
  }

  generateModel(event: any) {
    return new RoleNodeModel(this.type, this.name);
  }
}
