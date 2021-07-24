import React from "react";
import { BiImage } from "react-icons/bi";
import { ImageUI, ImageController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class ImageFactory extends UIComponentFactory {
  public get name() {
    return "image";
  }
  public get example() {
    return {
      id: "image-id",
      name: "image",
      width: "100px",
      height: "100px",
      src: "https://singularityhub.com/wp-content/uploads/2018/10/shutterstock_672433252-1068x601.jpg",
    };
  }

  public get icon() {
    return <BiImage />;
  }

  public generateComponent(
    component: ImageUI,
    parent?: UIComponentController
  ): ImageController {
    return new ImageController(component, this.factoriesManager, parent);
  }
}
