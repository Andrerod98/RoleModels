import React from "react";
import { MdOutlineDraw } from "react-icons/md";
import { SlideControlsModel, SlideControlsController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class SlideControlsFactory extends UIComponentFactory {
  public get name() {
    return "slide-controls";
  }

  public get example() {
    return {
      id: "slide-controls-id",
      name: "slide-controls",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <MdOutlineDraw />;
  }

  public generateComponent(
    component: SlideControlsModel,
    parent?: UIComponentController
  ): SlideControlsController {
    return new SlideControlsController(
      component,
      this.factoriesManager,
      parent
    );
  }
}
