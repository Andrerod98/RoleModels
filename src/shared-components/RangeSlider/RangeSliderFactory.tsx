import React from "react";
import { BiRectangle } from "react-icons/bi";
import { RangeSliderModel, RangeSliderController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class RangeSliderFactory extends UIComponentFactory {
  public get name() {
    return "range-slider";
  }

  public get example() {
    return {
      id: "range-slider-id",
      name: "range-slider",
      value: "Default",
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: RangeSliderModel,
    parent?: UIComponentController
  ): RangeSliderController {
    return new RangeSliderController(component, this.factoriesManager, parent);
  }
}
