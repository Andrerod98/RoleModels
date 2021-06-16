/* eslint-disable no-undef */
import React from "react";
import { SliderUI, SliderView as SliderView } from ".";
import { GenericController } from "../UIComponent";

export class SliderController extends GenericController<SliderUI> {
  generateWidget(): JSX.Element {
    return <SliderView controller={this} />;
  }
}
