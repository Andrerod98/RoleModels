import React from "react";
import { BiLink } from "react-icons/bi";
import { LinkUI, LinkController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class LinkFactory extends UIComponentFactory {
  public get name() {
    return "link";
  }

  public get example() {
    return {
      id: "link",
      name: "a",
      width: 460,
      height: 300,
      value: "Link",
      href: "",
    };
  }

  public get icon() {
    return <BiLink />;
  }

  public generateComponent(
    component: LinkUI,
    parent?: UIComponentController
  ): LinkController {
    return new LinkController(component, this.factoriesManager, parent);
  }
}
