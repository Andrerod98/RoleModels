import React from "react";
import { MdOutlineDraw } from "react-icons/md";
import { RemoteControlModel, RemoteControlController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class RemoteControlFactory extends UIComponentFactory {
  public get name() {
    return "remote-control";
  }

  public get example() {
    return {
      id: "remote-control-id",
      name: "remote-control",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <MdOutlineDraw />;
  }

  public generateComponent(
    component: RemoteControlModel,
    parent?: UIComponentController
  ): RemoteControlController {
    return new RemoteControlController(
      component,
      this.factoriesManager,
      parent
    );
  }
}
