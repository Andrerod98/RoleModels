import React from "react";
import { SliderUI } from ".";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { SliderController } from "./SliderController";

export function SliderView({ controller }: { controller: SliderController }) {
  const { value, ...component } = controller.get() as SliderUI;

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
