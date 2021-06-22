import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { SliderUI } from ".";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { SliderController } from "./SliderController";

export class SliderView extends UIComponentView {
  render() {
    const controller = this.props.controller as SliderController;
    const { value, ...component } = controller.get() as SliderUI;
    console.log("Rendering");

    return (
      <Slider
        key={"slider_" + component.id}
        aria-label={"slider-ex-1"}
        value={value}
        onChange={(val) => controller.update({ ...component, value: val })}
        {...component}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    );
  }
}
