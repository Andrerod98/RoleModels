import React from "react";
import { BiSliderAlt } from "react-icons/bi";
import { SliderUI, SliderController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class SliderFactory extends UIComponentFactory {
  public get name() {
    return "slider";
  }

  public get example() {
    return {
      id: "slider-id",
      name: "slider",
    };
  }

  public get icon() {
    return <BiSliderAlt />;
  }

  public generateComponent(
    component: SliderUI,
    parent?: UIComponentController
  ): SliderController {
    return new SliderController(component, this.factoriesManager, parent);
  }
}
