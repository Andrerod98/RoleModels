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
    const component = controller.get() as SliderUI;

    return (
      <Slider
        key={"slider_" + component.id}
        aria-label={"slider-ex-1"}
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
