/* eslint-disable no-undef */
import React from "react";
import { SliderUI, SliderView as SliderView } from ".";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class SliderController extends UIComponentController {
  constructor(protected model: SliderUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <SliderView controller={this} />;
  }
}
