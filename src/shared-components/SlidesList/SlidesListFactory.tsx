import React from "react";
import { MdOutlineDraw } from "react-icons/md";
import { SlidesListModel, SlidesListController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class SlidesListFactory extends UIComponentFactory {
  public get name() {
    return "slides-list";
  }

  public get example() {
    return {
      id: "slides-list-id",
      name: "slides-list",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <MdOutlineDraw />;
  }

  public generateComponent(
    component: SlidesListModel,
    parent?: UIComponentController
  ): SlidesListController {
    return new SlidesListController(component, this.factoriesManager, parent);
  }
}
